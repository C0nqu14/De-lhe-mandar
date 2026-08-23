import { StyleSheet, View } from 'react-native';
import { checkpointDescriptions } from '@/constants/mission';
import { Mission } from '@/types/mission';
import { MissionCheckpoint } from '@/components/MissionCheckpoint';

const sequence = ['CREATED', 'ACCEPTED', 'IN_PROGRESS', 'AWAITING_CONFIRMATION', 'COMPLETED'] as const;
export function MissionTimeline({ mission }: { mission: Mission }) {
  return <View style={styles.timeline}>{sequence.map((status) => { const checkpoint = mission.checkpoints.find((item) => item.status === status) ?? { status, timestamp: '', description: checkpointDescriptions[status] }; return <MissionCheckpoint key={status} checkpoint={checkpoint} completed={Boolean(mission.checkpoints.find((item) => item.status === status))} />; })}</View>;
}
const styles = StyleSheet.create({ timeline: { marginBottom: 8 } });