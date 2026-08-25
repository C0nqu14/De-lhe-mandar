import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

export const ratingService = {
  async create(missionId: string, executorId: string, score: number, comment?: string) {
    if (!Number.isInteger(score) || score < 1 || score > 5) throw new Error('A avaliação deve estar entre 1 e 5.');
    const { data: mission, error: missionError } = await supabase.from('missions').select('status, client_id, executor_id').eq('id', missionId).single();
    if (missionError || !mission || mission.status !== 'COMPLETED') throw new Error('Só é possível avaliar missões concluídas.');
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user || user.user.id !== mission.client_id || mission.executor_id !== executorId) throw new Error('Sem permissão para avaliar esta missão.');
    const input: Database['public']['Tables']['ratings']['Insert'] = { mission_id: missionId, from_user_id: user.user.id, to_user_id: executorId, score, comment: comment?.trim() || null };
    const { error } = await supabase.from('ratings').insert(input);
    if (error) throw error;
  },
};
