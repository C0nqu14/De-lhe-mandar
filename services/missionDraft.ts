import { MissionLocation } from '@/types/mission';
export type MissionDraft = { title: string; description: string; location: string; scheduledAt: string; purchaseAmount: number; serviceAmount: number; destinationLocation?: MissionLocation };
export const missionDraft: MissionDraft = { title: '', description: '', location: '', scheduledAt: '', purchaseAmount: 0, serviceAmount: 0 };