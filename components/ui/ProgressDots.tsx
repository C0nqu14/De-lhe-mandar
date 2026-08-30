import { View, StyleSheet, Text } from 'react-native';
import { palette } from '@/constants/Theme';

export function ProgressDots({ current, total, label }: { current: number; total: number; label?: string }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.dots}>
        {Array.from({ length: total }).map((_, i) => {
          const active = i < current;
          return <View key={i} style={[styles.dot, active ? styles.active : styles.inactive]} />;
        })}
      </View>
    </View>
  );
}

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(1, current / total);
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${pct * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { color: palette.onSurfaceVariant, fontSize: 12, fontWeight: '600' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { height: 6, flex: 1, borderRadius: 9999 },
  active: { backgroundColor: palette.primary, shadowColor: palette.primary, shadowOpacity: 0.3, shadowRadius: 6 },
  inactive: { backgroundColor: palette.surfaceContainerHighest },
  barTrack: { height: 6, backgroundColor: palette.surfaceContainerHighest, borderRadius: 9999, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: palette.primary, borderRadius: 9999 },
});
