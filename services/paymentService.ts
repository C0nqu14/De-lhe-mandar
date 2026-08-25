import { supabase } from '@/lib/supabase';
import type { Database, MissionPaymentMethod } from '@/types/supabase';

export const paymentService = {
  async createPending(missionId: string, amount: number, method: MissionPaymentMethod, reference: string) {
    if (amount < 0 || !reference.trim()) throw new Error('Dados de pagamento inválidos.');
    const input: Database['public']['Tables']['payments']['Insert'] = { mission_id: missionId, amount, method, reference: reference.trim(), status: 'PENDING' };
    const { data, error } = await supabase.from('payments').insert(input).select().single();
    if (error) throw error;
    return data;
  },
  async get(missionId: string) {
    const { data, error } = await supabase.from('payments').select('*').eq('mission_id', missionId).maybeSingle();
    if (error) throw error;
    return data;
  },
};
