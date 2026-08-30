import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { palette } from '@/constants/Theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
export function AppButton({
  label,
  onPress,
  variant = 'primary',
  secondary = false,
  disabled = false,
  loading = false,
  icon,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}) {
  const v: Variant = secondary ? 'secondary' : variant;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        styles[v],
        (disabled || loading) && styles.disabled,
        pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
      ]}
    >
      {loading ? <ActivityIndicator color={v === 'primary' ? palette.onPrimary : v === 'outline' ? palette.primary : palette.onSecondaryContainer} /> : null}
      {icon}
      <Text style={[styles.text, styles[`text_${v}` as const], (disabled || loading) && styles.textDisabled]}>{label}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    gap: 8,
  },
  primary: { backgroundColor: palette.primary },
  secondary: { backgroundColor: palette.secondaryContainer },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.primary },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  text: { fontSize: 14, fontWeight: '700', letterSpacing: 0.1 },
  text_primary: { color: palette.onPrimary },
  text_secondary: { color: palette.onSecondaryContainer },
  text_outline: { color: palette.primary },
  text_ghost: { color: palette.primary },
  textDisabled: {},
});