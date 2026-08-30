import { Text, View, StyleSheet } from 'react-native';
import { palette } from '@/constants/Theme';

export function Badge({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'success' | 'error' | 'secondary' }) {
  const bg =
    variant === 'success' ? 'rgba(0,133,69,0.1)' : variant === 'error' ? palette.errorContainer : variant === 'secondary' ? 'rgba(255,137,40,0.12)' : 'rgba(0,68,163,0.1)';
  const color = variant === 'success' ? '#008545' : variant === 'error' ? palette.error : variant === 'secondary' ? palette.secondary : palette.primary;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9999, alignSelf: 'flex-start' },
  text: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
});
