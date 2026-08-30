import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { palette, radius, shadows } from '@/constants/Theme';
import { Mission, statusLabels } from '@/types/mission';

type MissionCardProps = { mission: Mission; onPress?: () => void; onAccept?: () => void; progress?: number };

const categoryIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  Fila: 'people-outline',
  Gás: 'flame-outline',
  Mercado: 'basket-outline',
  Documentos: 'document-text-outline',
};

function getProgress(status: string): number | null {
  const map: Record<string, number> = { AVAILABLE: 0, ACCEPTED: 30, IN_PROGRESS: 65, AWAITING_CONFIRMATION: 90, COMPLETED: 100 };
  return map[status] ?? null;
}

export function MissionCard({ mission, onPress, onAccept, progress }: MissionCardProps) {
  const pct = progress ?? getProgress(mission.status);
  const isAvailable = mission.status === 'AVAILABLE';
  const iconName = (categoryIcon[mission.title] as any) || 'briefcase-outline';
  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconBox, isAvailable && styles.iconBoxSecondary]}>
          <Ionicons name={iconName} size={22} color={isAvailable ? palette.secondary : palette.primary} />
        </View>
        <View style={styles.main}>
          <View style={styles.topLine}>
            <Text style={styles.title} numberOfLines={1}>
              {mission.title}
            </Text>
            <View style={[styles.badge, isAvailable ? styles.badgeAvailable : styles.badgeProgress]}>
              <Text style={[styles.badgeText, isAvailable ? styles.badgeTextAvailable : styles.badgeTextProgress]}>
                {statusLabels[mission.status]}
              </Text>
            </View>
          </View>
          <Text numberOfLines={1} style={styles.executor}>
            {mission.executorId ? `Estafeta: ${mission.executorId.slice(0, 8)}` : mission.location}
          </Text>
          {pct !== null && pct > 0 && pct < 100 && (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
            </View>
          )}
          {isAvailable && (
            <View style={styles.metaRow}>
              <View style={styles.metaPill}>
                <Ionicons name="location-outline" size={12} color={palette.onSurfaceVariant} />
                <Text style={styles.metaText}>{mission.location}</Text>
              </View>
              <Text style={styles.price}>{mission.serviceAmount.toLocaleString('pt-AO')} Kz</Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={18} color={palette.outline} style={{ marginLeft: 4 }} />
      </View>
      {onAccept && isAvailable && (
        <Pressable onPress={onAccept} style={({ pressed }) => [styles.accept, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}>
          <Text style={styles.acceptText}>Aceitar Missão</Text>
        </Pressable>
      )}
      {!onAccept && !isAvailable && pct === null && (
        <View style={styles.amounts}>
          <Text style={styles.amount}>Serviço {mission.serviceAmount.toLocaleString('pt-AO')} Kz</Text>
          <Text style={styles.total}>{mission.totalAmount.toLocaleString('pt-AO')} Kz</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surfaceContainerLowest,
    borderRadius: radius['2xl'],
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(195,198,213,0.3)',
    ...shadows.card,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  main: { flex: 1, gap: 4 },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(0,68,163,0.08)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,68,163,0.05)' },
  iconBoxSecondary: { backgroundColor: 'rgba(255,137,40,0.1)' },
  topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { color: palette.onSurface, fontSize: 14, fontWeight: '700', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9999 },
  badgeProgress: { backgroundColor: 'rgba(0,68,163,0.1)' },
  badgeAvailable: { backgroundColor: 'rgba(255,137,40,0.12)' },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  badgeTextProgress: { color: palette.primary },
  badgeTextAvailable: { color: palette.secondary },
  executor: { color: palette.onSurfaceVariant, fontSize: 12, fontWeight: '500' },
  progressTrack: { height: 6, backgroundColor: palette.surfaceContainer, borderRadius: 9999, overflow: 'hidden', marginTop: 6 },
  progressFill: { height: '100%', backgroundColor: palette.primary, borderRadius: 9999 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: palette.onSurfaceVariant, fontSize: 12 },
  price: { color: palette.primary, fontSize: 13, fontWeight: '800' },
  amounts: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: palette.surfaceContainer, marginTop: 12, paddingTop: 10 },
  amount: { color: palette.onSurfaceVariant, fontSize: 11 },
  total: { color: palette.primary, fontWeight: '800', fontSize: 13 },
  accept: { backgroundColor: palette.primary, borderRadius: 12, alignItems: 'center', paddingVertical: 12, marginTop: 12 },
  acceptText: { color: palette.onPrimary, fontWeight: '800', fontSize: 14 },
});