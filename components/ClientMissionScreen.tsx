import { AppHeader } from '@/components/AppHeader';
import { MissionMap } from '@/components/MissionMap';
import { MissionPriceBreakdown } from '@/components/MissionPriceBreakdown';
import { MissionQRCode } from '@/components/MissionQRCode';
import { MissionTimeline } from '@/components/MissionTimeline';
import { Card } from '@/components/ui/Card';
import { palette } from '@/constants/Theme';
import { useMission } from '@/hooks/useMission';
import { missionService } from '@/services/missionService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClientMissionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const mission = useMission(id || '');

  const [loading, setLoading] = useState(true);

  const fetchMission = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      await missionService.refreshMission(id);
    } catch (e) {
      console.error('[CLIENT SCREEN] Erro ao carregar:', e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMission();
  }, [fetchMission]);

  if (loading || !mission) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <AppHeader title="Detalhes da Missão" onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.loadingText}>A carregar a sua missão...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppHeader title="Detalhes da Missão" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={{ padding: 16 }}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{mission.status}</Text>
            </View>
            <Text style={styles.price}>{mission.serviceAmount.toLocaleString('pt-AO')} Kz</Text>
          </View>
          <Text style={styles.title}>{mission.title}</Text>
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={12} color={palette.onSurfaceVariant} /> {mission.location} · {mission.scheduledAt}
          </Text>
          {mission.description ? <Text style={styles.description}>{mission.description}</Text> : null}
          <View style={styles.metaGrid}>
            <View style={styles.meta}>
              <Ionicons name="navigate-outline" size={14} color={palette.primary} />
              <Text style={styles.metaText}>{mission.location}</Text>
            </View>
            <View style={styles.meta}>
              <Ionicons name="time-outline" size={14} color={palette.primary} />
              <Text style={styles.metaText}>{mission.scheduledAt}</Text>
            </View>
          </View>
        </Card>

        <View style={{ marginTop: 16 }}>
          <MissionMap
            destination={mission.destinationLocation}
            executorLocation={mission.executorLocation}
            status={mission.status}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <MissionPriceBreakdown serviceAmount={mission.serviceAmount} purchaseAmount={mission.purchaseAmount} />
        </View>

        <Text style={styles.section}>Acompanhe a sua missão</Text>
        <View style={styles.timelineCard}>
          <MissionTimeline mission={mission} />
        </View>

        {mission.status === 'AWAITING_CONFIRMATION' && (
          <>
            <View style={{ marginTop: 16 }}>
              <MissionQRCode mission={mission} />
            </View>
            <Pressable
              onPress={() => router.push({ pathname: '/(client)/mission/confirmation', params: { id: mission.id } })}
              style={({ pressed }) => [styles.btn, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <Text style={styles.btnText}>Ver confirmação</Text>
            </Pressable>
          </>
        )}

        {mission.status === 'COMPLETED' && (
          <Pressable
            onPress={() => router.push({ pathname: '/(client)/rating', params: { missionId: mission.id, executorId: mission.executorId ?? '' } })}
            style={({ pressed }) => [styles.btnSecondary, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <Text style={styles.btnSecondaryText}>Avaliar Nengue</Text>
          </Pressable>
        )}

        {mission.status === 'AVAILABLE' && (
          <Pressable
            onPress={() => router.push({ pathname: '/(client)/mission/active', params: { id: mission.id } })}
            style={({ pressed }) => [styles.btnOutline, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.btnOutlineText}>Ver estado atual</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 16, paddingBottom: 32 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: 'rgba(255,137,40,0.12)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 9999 },
  badgeText: { color: palette.secondary, fontSize: 11, fontWeight: '700' },
  price: { color: palette.primary, fontSize: 16, fontWeight: '800' },
  title: { color: palette.onSurface, fontSize: 20, fontWeight: '700', marginTop: 12 },
  location: { color: palette.onSurfaceVariant, marginTop: 6, fontSize: 13 },
  description: { color: palette.onSurfaceVariant, fontSize: 14, lineHeight: 20, marginTop: 10 },
  metaGrid: { flexDirection: 'row', gap: 12, marginTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(195,198,213,0.2)', paddingTop: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  metaText: { color: palette.onSurface, fontSize: 12, fontWeight: '500' },
  section: { color: palette.onSurface, fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  timelineCard: { backgroundColor: palette.surfaceContainerLowest, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)' },
  btn: { backgroundColor: palette.secondaryContainer, height: 56, borderRadius: 9999, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  btnText: { color: palette.onSecondaryContainer, fontSize: 14, fontWeight: '700' },
  btnSecondary: { backgroundColor: palette.secondaryContainer, height: 56, borderRadius: 9999, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  btnSecondaryText: { color: palette.onSecondaryContainer, fontWeight: '700' },
  btnOutline: { borderWidth: 1, borderColor: palette.primary, height: 56, borderRadius: 9999, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  btnOutlineText: { color: palette.primary, fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: palette.onSurfaceVariant, fontSize: 14 },
});