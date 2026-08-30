import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, StatusBar } from 'react-native';
import { palette } from '@/constants/Theme';

export function AppHeader({
  title,
  onBack,
  right,
  centeredTitle = false,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  centeredTitle?: boolean;
}) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={palette.primary} />
        </Pressable>
      ) : (
        <View style={styles.space} />
      )}
      <Text style={[styles.title, centeredTitle && styles.centered]} numberOfLines={1}>
        {title}
      </Text>
      {right ? <View style={styles.right}>{right}</View> : <View style={styles.space} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195,198,213,0.5)',
    minHeight: 56,
    marginBottom: 0,
    paddingTop: (StatusBar.currentHeight ? 4 : 0),
  },
  title: { color: palette.primary, fontSize: 22, fontWeight: '700', letterSpacing: -0.2, flex: 1, textAlign: 'left' },
  centered: { textAlign: 'center' },
  space: { width: 32 },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  right: { minWidth: 32, alignItems: 'flex-end' },
});