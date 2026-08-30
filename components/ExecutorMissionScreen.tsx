import { AppHeader } from '@/components/AppHeader';
import { MissionMap } from '@/components/MissionMap';
import { MissionTimeline } from '@/components/MissionTimeline';
import { Card } from '@/components/ui/Card';
import { palette } from '@/constants/Theme';
import { useMission } from '@/hooks/useMission';
import { useMissionLocation } from '@/hooks/useMissionLocation';
import { missionService } from '@/services/missionService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExecutorMissionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const mission = useMission(id || '');

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const loadData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      await missionService.refreshMission(id);
    } catch (e) {
      console.error('[EXECUTOR SCREEN] Erro ao carregar:', e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onWay = mission?.checkpoints?.some((item) => item.description === 'O Nengue está a caminho.') ?? false;
  const tracking = onWay || mission?.status === 'IN_PROGRESS';
  const { location, permissionGranted, error } = useMissionLocation(tracking);

  useEffect(() => {
    if (location && mission?.id && mission?.executorId) {
      missionService.setExecutorLocation(mission.id, { ...location, updatedAt: new Date().toISOString() });
    }
  }, [location, mission?.id, mission?.executorId]);

  const handleAction = async (actionFn: () => Promise<any> | void) => {
    try {
      setActionLoading(true);
      setActionError('');
      await actionFn();
    } catch (caught: any) {
      setActionError(caught?.message || 'Não foi possível avançar a missão.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !mission) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <AppHeader title="Missão Ativa" onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.loadingText}>A carregar os detalhes da missão...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const action: { label: string; run: () => Promise<any> | void } | null =
    mission.status === 'ACCEPTED' && !onWay
      ? { label: 'Estou a caminho', run: () => missionService.startTravel(mission.id) }
      : mission.status === 'ACCEPTED' && onWay
        ? {
            label: 'Cheguei ao local',
            run: async () => {
              if (!location || !permissionGranted) {
                throw new Error('Precisamos da sua localização para confirmar a chegada.');
              }
              await missionService.arriveAtMission(mission.id, location);
            },
          }
        : mission.status === 'IN_PROGRESS'
          ? {
              label: 'Finalizar missão',
              run: async () => {
                await missionService.requestCompletion(mission.id);
                router.push({ pathname: '/(executor)/mission/confirmation', params: { id: mission.id } });
              },
            }
          : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppHeader title="Missão Ativa" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{mission.status}</Text>
            </View>
            <Text style={styles.price}>{mission.serviceAmount.toLocaleString('pt-AO')} Kz</Text>
          </View>
          <Text style={styles.title}>{mission.title}</Text>
          <Text style={styles.location}>
            {mission.location} · {mission.scheduledAt}
          </Text>
          {mission.description ? <Text style={styles.description}>{mission.description}</Text> : null}
        </Card>

        <View style={{ marginTop: 16 }}>
          <MissionMap
            destination={mission.destinationLocation}
            executorLocation={mission.executorLocation}
            status={onWay ? 'A caminho' : mission.status}
          />
        </View>

        <Text style={styles.section}>Checklist da missão</Text>
        <View style={styles.timelineCard}>
          <MissionTimeline mission={mission} />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {actionError ? <Text style={styles.error}>{actionError}</Text> : null}

        {action && (
          <Pressable
            onPress={() => handleAction(action.run)}
            disabled={actionLoading}
            style={({ pressed }) => [styles.btn, (actionLoading || pressed) && { opacity: 0.8 }]}
          >
            {actionLoading ? (
              <ActivityIndicator color={palette.onPrimary} size="small" />
            ) : (
              <>
                <Text style={styles.btnText}>{action.label}</Text>
                <Ionicons name="arrow-forward" size={18} color={palette.onPrimary} />
              </>
            )}
          </Pressable>
        )}

        {mission.status === 'AWAITING_CONFIRMATION' && (
          <Pressable
            onPress={() => router.push({ pathname: '/(executor)/mission/confirmation', params: { id: mission.id } })}
            style={styles.outline}
          >
            <Text style={styles.outlineText}>Ver confirmação</Text>
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
  badge: { backgroundColor: 'rgba(0,68,163,0.1)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 9999 },
  badgeText: { color: palette.primary, fontSize: 11, fontWeight: '700' },
  price: { color: palette.primary, fontWeight: '800' },
  title: { color: palette.onSurface, fontSize: 20, fontWeight: '700', marginTop: 12 },
  location: { color: palette.onSurfaceVariant, marginTop: 6, fontSize: 13 },
  description: { color: palette.onSurfaceVariant, fontSize: 14, lineHeight: 20, marginTop: 10 },
  section: { color: palette.onSurface, fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  timelineCard: { backgroundColor: palette.surfaceContainerLowest, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)' },
  btn: { backgroundColor: palette.primary, height: 56, borderRadius: 9999, justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row', gap: 8 },
  btnText: { color: palette.onPrimary, fontSize: 14, fontWeight: '700' },
  outline: { borderWidth: 1, borderColor: palette.primary, height: 56, borderRadius: 9999, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  outlineText: { color: palette.primary, fontWeight: '700' },
  error: { color: palette.error, marginTop: 12, fontSize: 13 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: palette.onSurfaceVariant, fontSize: 14 },
});