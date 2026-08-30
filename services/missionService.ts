import { checkpointDescriptions, checkpointLabels, missionTransitions } from '@/constants/mission';
import { supabase } from '@/lib/supabase';
import { MissionConfirmationPayload } from '@/services/qrService';
import { Mission, MissionCheckpoint, MissionLocation, MissionStatus } from '@/types/mission';

type Database = import('@/types/supabase').Database;
type MissionRow = Database['public']['Tables']['missions']['Row'];
type CheckpointRow = Database['public']['Tables']['mission_checkpoints']['Row'];
type LocationRow = Database['public']['Tables']['mission_locations']['Row'];
type ExecutorLocationRow = Database['public']['Tables']['mission_executor_locations']['Row'];
type ConfirmationRow = Database['public']['Tables']['mission_confirmations']['Row'];
type MissionInput = Pick<Mission, 'title' | 'description' | 'location' | 'scheduledAt' | 'serviceAmount' | 'purchaseAmount' | 'destinationLocation'>;
type CheckpointType = 'MISSION_CREATED' | 'MISSION_ACCEPTED' | 'EXECUTOR_ON_THE_WAY' | 'EXECUTOR_ARRIVED' | 'MISSION_STARTED' | 'COMPLETION_REQUESTED' | 'MISSION_CONFIRMED' | 'MISSION_CANCELLED';

const cache = new Map<string, Mission>();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
const checkpointStatus: Record<string, MissionStatus> = { MISSION_CREATED: 'CREATED', MISSION_ACCEPTED: 'ACCEPTED', EXECUTOR_ON_THE_WAY: 'ACCEPTED', EXECUTOR_ARRIVED: 'ACCEPTED', MISSION_STARTED: 'IN_PROGRESS', COMPLETION_REQUESTED: 'AWAITING_CONFIRMATION', MISSION_CONFIRMED: 'COMPLETED', MISSION_CANCELLED: 'CANCELLED' };
const checkpointDescription = (type: CheckpointType) => checkpointDescriptions[checkpointStatus[type]];
const currentUserId = async () => { const { data, error } = await supabase.auth.getUser(); if (error || !data.user) throw new Error('Sessão expirada. Entre novamente.'); return data.user.id; };

function mapMission(row: MissionRow, checkpoints: CheckpointRow[], destination?: LocationRow, executorLocation?: ExecutorLocationRow, confirmation?: ConfirmationRow): Mission {
  return { id: row.id, title: row.title, description: row.description, location: destination?.address ?? '', scheduledAt: row.scheduled_at, serviceAmount: Number(row.service_amount), purchaseAmount: Number(row.purchase_amount), totalAmount: Number(row.total_amount), clientId: row.client_id, executorId: row.executor_id ?? undefined, status: row.status as MissionStatus, createdAt: row.created_at, acceptedAt: row.accepted_at ?? undefined, startedAt: row.started_at ?? undefined, completedAt: row.completed_at ?? undefined, checkpoints: checkpoints.map((item): MissionCheckpoint => ({ status: checkpointStatus[item.status] ?? item.status as MissionStatus, timestamp: item.created_at, description: item.description })), confirmationCode: confirmation?.otp, confirmationToken: confirmation?.confirmation_token, confirmationCodeUsed: confirmation?.used, destinationLocation: destination ? { latitude: destination.latitude, longitude: destination.longitude, address: destination.address ?? undefined } : undefined, executorLocation: executorLocation ? { latitude: executorLocation.latitude, longitude: executorLocation.longitude, accuracy: executorLocation.accuracy ?? undefined, updatedAt: executorLocation.created_at } : undefined };
}

async function loadMission(id: string) {
  const { data: row, error } = await supabase.from('missions').select('*').eq('id', id).single();
  if (error || !row) throw new Error('Missão não encontrada.');
  const [checkpointResult, destinationResult, executorResult, confirmationResult] = await Promise.all([supabase.from('mission_checkpoints').select('*').eq('mission_id', id).order('created_at'), supabase.from('mission_locations').select('*').eq('mission_id', id).maybeSingle(), supabase.from('mission_executor_locations').select('*').eq('mission_id', id).order('created_at', { ascending: false }).limit(1).maybeSingle(), supabase.from('mission_confirmations').select('*').eq('mission_id', id).eq('used', false).order('created_at', { ascending: false }).limit(1).maybeSingle()]);
  if (checkpointResult.error) throw checkpointResult.error;
  const mission = mapMission(row, checkpointResult.data ?? [], destinationResult.data ?? undefined, executorResult.data?.[0] ?? undefined, confirmationResult.data ?? undefined);
  cache.set(id, mission);
  return mission;
}

async function addCheckpoint(missionId: string, type: CheckpointType, description = checkpointDescription(type)) { const { error } = await supabase.from('mission_checkpoints').insert({ mission_id: missionId, status: type, description }); if (error) throw error; }
async function transition(id: string, next: MissionStatus, checkpoint: CheckpointType, updates: Database['public']['Tables']['missions']['Update'] = {}) { const mission = cache.get(id) ?? await loadMission(id); if (!missionTransitions[mission.status].includes(next)) throw new Error(`Transição inválida: ${mission.status} para ${next}.`); const { data, error } = await supabase.from('missions').update({ ...updates, status: next, updated_at: new Date().toISOString() }).eq('id', id).eq('status', mission.status).select().single(); if (error || !data) throw new Error('A missão foi alterada por outro utilizador. Atualize e tente novamente.'); await addCheckpoint(id, checkpoint); const result = await loadMission(id); notify(); return result; }

export const missionService = {
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  list() { return Array.from(cache.values()); },
  async refresh() { const { data, error } = await supabase.from('missions').select('*').order('created_at', { ascending: false }); if (error) throw error; await Promise.all((data ?? []).map((row) => loadMission(row.id))); notify(); return this.list(); },
  get(id: string) { return cache.get(id) ?? { id, title: '', description: '', location: '', scheduledAt: '', serviceAmount: 0, purchaseAmount: 0, totalAmount: 0, clientId: '', status: 'CREATED' as MissionStatus, createdAt: '', checkpoints: [] }; },
  async create(input: MissionInput) { const clientId = await currentUserId(); const { data, error } = await supabase.from('missions').insert({ client_id: clientId, title: input.title, description: input.description, service_amount: input.serviceAmount, purchase_amount: input.purchaseAmount, total_amount: input.serviceAmount + input.purchaseAmount, scheduled_at: input.scheduledAt, status: 'AVAILABLE' }).select().single(); if (error || !data) throw error ?? new Error('Não foi possível criar a missão.'); if (input.destinationLocation) { const { error: locationError } = await supabase.from('mission_locations').insert({ mission_id: data.id, latitude: input.destinationLocation.latitude, longitude: input.destinationLocation.longitude, address: input.location }); if (locationError) throw locationError; } await addCheckpoint(data.id, 'MISSION_CREATED'); const { error: notificationError } = await supabase.from('notifications').insert({ user_id: clientId, type: 'MISSION_CREATED', title: 'Missão criada', message: 'A sua missão foi criada com sucesso.' }); if (notificationError) throw notificationError; return loadMission(data.id); },
  async acceptMission(id: string) { const { error } = await supabase.rpc('accept_mission', { p_mission_id: id }); if (error) throw error; return loadMission(id); },
  async startTravel(id: string) { const { error } = await supabase.rpc('advance_mission', { p_mission_id: id, p_action: 'ON_THE_WAY' }); if (error) throw error; return loadMission(id); },
  async arriveAtMission(id: string, _location: MissionLocation) { const { error } = await supabase.rpc('advance_mission', { p_mission_id: id, p_action: 'ARRIVED' }); if (error) throw error; return loadMission(id); },
  async startMission(id: string) { const { error } = await supabase.rpc('advance_mission', { p_mission_id: id, p_action: 'START' }); if (error) throw error; return loadMission(id); },
  async requestCompletion(id: string) { const { error } = await supabase.rpc('request_mission_confirmation', { p_mission_id: id }); if (error) throw error; return loadMission(id); },
  async confirmMission(id: string, value: string) { const { error } = await supabase.rpc('confirm_mission', { p_mission_id: id, p_value: value }); if (error) throw new Error(error.message || 'OTP ou QR inválido ou expirado.'); return loadMission(id); },
  async confirmMissionByQr(payload: MissionConfirmationPayload) { return this.confirmMission(payload.missionId, payload.confirmationToken); },
  async setExecutorLocation(id: string, location: { latitude: number; longitude: number; accuracy?: number; updatedAt: string }) { const executorId = await currentUserId(); const { error } = await supabase.from('mission_executor_locations').insert({ mission_id: id, executor_id: executorId, latitude: location.latitude, longitude: location.longitude, accuracy: location.accuracy, created_at: location.updatedAt }); if (error) throw error; const result = await loadMission(id); notify(); return result; },
  async cancelMission(id: string) { const { error } = await supabase.rpc('cancel_mission', { p_mission_id: id }); if (error) throw error; return loadMission(id); },
};

export { checkpointLabels };
