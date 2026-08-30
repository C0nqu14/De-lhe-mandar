import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { missionService } from '@/services/missionService';
import { Mission } from '@/types/mission';

export function useMissions() {
  const [items, setItems] = useState<Mission[]>(() => missionService.list());

  useEffect(() => {
    void missionService.refresh().then(setItems).catch(() => undefined);
    const unsubscribe = missionService.subscribe(() => setItems(missionService.list()));

    // Nome único para evitar reutilizar canais em estado SUBSCRIBED
    const channelName = `missions-realtime-${Math.random().toString(36).substring(2, 9)}`;

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'missions' }, () => {
        void missionService.refresh().catch(() => undefined);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mission_checkpoints' }, () => {
        void missionService.refresh().catch(() => undefined);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mission_executor_locations' }, () => {
        void missionService.refresh().catch(() => undefined);
      });

    channel.subscribe();

    return () => {
      unsubscribe();
      void supabase.removeChannel(channel);
    };
  }, []);

  return items;
}

export function useMission(id: string) {
  const [mission, setMission] = useState<Mission | undefined>(() => missionService.get(id));

  useEffect(() => {
    if (!id) return;

    void missionService
      .refresh()
      .then(() => setMission(missionService.get(id)))
      .catch(() => undefined);

    const unsubscribe = missionService.subscribe(() => setMission(missionService.get(id)));

    // Nome único por instância/missão
    const channelName = `mission-${id}-${Math.random().toString(36).substring(2, 9)}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'missions', filter: `id=eq.${id}` },
        () => {
          void missionService.refresh().catch(() => undefined);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mission_checkpoints', filter: `mission_id=eq.${id}` },
        () => {
          void missionService.refresh().catch(() => undefined);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mission_executor_locations', filter: `mission_id=eq.${id}` },
        () => {
          void missionService.refresh().catch(() => undefined);
        }
      );

    channel.subscribe();

    return () => {
      unsubscribe();
      void supabase.removeChannel(channel);
    };
  }, [id]);

  return mission;
}