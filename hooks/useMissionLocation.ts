import { useEffect, useState } from 'react';
import { getCurrentLocation, requestForegroundPermission, startMissionTracking, stopMissionTracking } from '@/services/locationService';
import { ExecutorLocation, MissionLocation } from '@/types/mission';

export function useMissionLocation(tracking = false) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [location, setLocation] = useState<ExecutorLocation | MissionLocation | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; if (!tracking) return () => { active = false; void stopMissionTracking(); }; requestForegroundPermission().then(async (granted) => { if (!active) return; setPermissionGranted(granted); if (!granted) return; await startMissionTracking(setLocation); }).catch(() => setError('Não foi possível obter a sua localização.')); return () => { active = false; void stopMissionTracking(); }; }, [tracking]);
  return { location, permissionGranted, error };
}