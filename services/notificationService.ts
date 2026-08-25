import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

export type Notification = Database['public']['Tables']['notifications']['Row'];

export const notificationService = {
  async list() {
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  async markRead(id: string) {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) throw error;
  },
  subscribe(onChange: (notification: Notification) => void) {
    const channel = supabase.channel('notifications-realtime').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => onChange(payload.new as Notification)).subscribe();
    return () => { void supabase.removeChannel(channel); };
  },
};
