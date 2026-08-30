import { View, StyleSheet, ViewStyle } from 'react-native';
import { palette, radius, shadows } from '@/constants/Theme';

export function Card({ children, style, padded = true }: { children: React.ReactNode; style?: ViewStyle; padded?: boolean }) {
  return <View style={[styles.card, padded && styles.padded, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surfaceContainerLowest,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(195,198,213,0.3)',
    ...shadows.card,
  },
  padded: { padding: 16 },
});
