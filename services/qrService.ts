import { Mission } from '@/types/mission';

export type MissionConfirmationPayload = { missionId: string; confirmationToken: string };

export function createConfirmationToken(missionId: string) {
  return `${missionId}.${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}`;
}

export function createConfirmationPayload(mission: Mission): MissionConfirmationPayload {
  if (!mission.confirmationToken) throw new Error('Token de confirmação indisponível.');
  return { missionId: mission.id, confirmationToken: mission.confirmationToken };
}

export function parseConfirmationPayload(value: string): MissionConfirmationPayload | null {
  try {
    const payload = JSON.parse(value) as MissionConfirmationPayload;
    if (typeof payload.missionId !== 'string' || typeof payload.confirmationToken !== 'string') return null;
    return payload;
  } catch {
    return null;
  }
}