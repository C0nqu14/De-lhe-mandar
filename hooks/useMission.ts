import { useEffect, useState } from 'react';
import { missionService } from '@/services/missionService';
import { Mission } from '@/types/mission';

export function useMissions() { const [items, setItems] = useState<Mission[]>(missionService.list()); useEffect(() => { const unsubscribe = missionService.subscribe(() => setItems(missionService.list())); return unsubscribe; }, []); return items; }
export function useMission(id: string) { const [mission, setMission] = useState<Mission>(() => missionService.get(id)); useEffect(() => { const unsubscribe = missionService.subscribe(() => setMission(missionService.get(id))); return unsubscribe; }, [id]); return mission; }