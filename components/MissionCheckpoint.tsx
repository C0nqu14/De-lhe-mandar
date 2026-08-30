import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { palette } from '@/constants/Theme';
import { MissionCheckpoint as Checkpoint } from '@/types/mission';

export function MissionCheckpoint({ checkpoint, completed, isActive }: { checkpoint: Checkpoint; completed: boolean; isActive?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={styles.lineWrap}>
        <View style={[styles.circle, completed && styles.active, isActive && styles.isActive]}>
          {completed ? <Ionicons name="checkmark" size={14} color="#FFF" /> : isActive ? <View style={styles.dot} /> : null}
        </View>
        <View style={[styles.line, completed && styles.lineActive]} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, (completed || isActive) && styles.activeText]}>{checkpoint.description}</Text>
        <Text style={styles.time}>{checkpoint.timestamp ? new Date(checkpoint.timestamp).toLocaleString('pt-AO') : ''}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', minHeight: 56 },
  lineWrap: { alignItems: 'center', width: 32 },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: palette.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceContainerLowest,
  },
  active: { backgroundColor: palette.primary, borderColor: palette.primary },
  isActive: { borderColor: palette.primary, backgroundColor: palette.surfaceContainerLowest, borderWidth: 2, shadowColor: palette.primary, shadowOpacity: 0.15, shadowRadius: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: palette.primary },
  line: { flex: 1, width: 2, backgroundColor: 'rgba(195,198,213,0.3)', marginTop: 4, marginBottom: -4 },
  lineActive: { backgroundColor: palette.primary },
  copy: { marginLeft: 8, flex: 1, paddingBottom: 16 },
  title: { color: palette.onSurfaceVariant, fontSize: 14, fontWeight: '500' },
  activeText: { color: palette.onSurface, fontWeight: '700' },
  time: { color: palette.outline, fontSize: 12, marginTop: 4 },
});
