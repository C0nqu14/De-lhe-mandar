import { MissionCard } from '@/components/MissionCard';
import { palette } from '@/constants/Theme';
import { useMissions } from '@/hooks/useMission';
import { missionService } from '@/services/missionService';
import { sessionService } from '@/services/sessionService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation } from '@/components/BottomNavigation';

export default function ExecutorDashboard() {
  const missions = useMissions();
  const userId = sessionService.get()?.userId;
  const available = missions.filter((m) => m.status === 'AVAILABLE');
  const myActive = missions.filter((m) => m.executorId === userId && ['ACCEPTED', 'IN_PROGRESS'].includes(m.status));
  const earnings = missions.filter((m) => m.executorId === userId && m.status === 'COMPLETED').reduce((t, m) => t + m.serviceAmount, 0);
  const walletTotal = 12450;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.appbar}>
        <View style={styles.user}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(sessionService.get()?.displayName || 'N').slice(0, 1)}</Text>
          </View>
          <View>
            <Text style={styles.greet}>Olá, Nengue</Text>
            <Text style={styles.subGreet}>Pronto para trabalhar?</Text>
          </View>
        </View>
        <View style={styles.walletChip}>
          <Ionicons name="wallet-outline" size={14} color={palette.primary} />
          <Text style={styles.walletText}>{walletTotal.toLocaleString('pt-AO')} Kz</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resumo Hoje - match HTML */}
        <View style={styles.summary}>
          <View style={styles.summaryTop}>
            <Text style={styles.summaryLabel}>GANHOS DE HOJE</Text>
            <View style={styles.trend}>
              <Ionicons name="trending-up" size={12} color="#008545" />
              <Text style={styles.trendText}>+12%</Text>
            </View>
          </View>
          <Text style={styles.summaryAmount}>{earnings.toLocaleString('pt-AO')} Kz</Text>
          <Text style={styles.summaryMeta}>{myActive.length} missões • 3 concluídas</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <View style={[styles.tab, styles.tabActive]}><Text style={styles.tabTextActive}>Missões Disponíveis</Text></View>
          <Pressable style={styles.tab}><Text style={styles.tabText}>Minhas</Text></Pressable>
          <Pressable style={styles.tab}><Text style={styles.tabText}>Histórico</Text></Pressable>
          <Pressable style={styles.tab}><Text style={styles.tabText}>Ganhos</Text></Pressable>
        </View>

        <Text style={styles.section}>Disponíveis agora</Text>
        {available.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={24} color={palette.outline} />
            <Text style={styles.emptyText}>Nenhuma missão disponível agora.</Text>
          </View>
        ) : (
          available.slice(0, 6).map((mission) => (
            <MissionCard key={mission.id} mission={mission} onPress={() => router.push(`/(executor)/mission/details?id=${mission.id}`)} onAccept={() => void missionService.acceptMission(mission.id)} />
          ))
        )}

        <Pressable onPress={() => router.push('/(executor)/available-missions')}>
          <Text style={styles.link}>Ver todas as missões</Text>
        </Pressable>
      </ScrollView>

      {/* FAB Map */}
      <Pressable style={styles.fab}>
        <Ionicons name="map" size={22} color={palette.onPrimary} />
      </Pressable>

      <BottomNavigation executor />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  appbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: palette.surface, borderBottomWidth: 1, borderBottomColor: 'rgba(195,198,213,0.3)' },
  user: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: palette.primaryFixed, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: palette.primary, fontWeight: '800' },
  greet: { color: palette.onSurface, fontSize: 14, fontWeight: '700' },
  subGreet: { color: palette.onSurfaceVariant, fontSize: 12 },
  walletChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: palette.primaryFixed, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999 },
  walletText: { color: palette.onPrimaryFixed, fontWeight: '700', fontSize: 13 },
  content: { paddingHorizontal: 16, paddingBottom: 90 },
  summary: { backgroundColor: palette.surfaceContainerLowest, borderRadius: 24, padding: 20, marginTop: 16, borderWidth: 1, borderColor: 'rgba(195,198,213,0.3)', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 16, elevation: 2 },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: palette.onSurfaceVariant, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  trend: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,133,69,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 },
  trendText: { color: '#008545', fontSize: 11, fontWeight: '700' },
  summaryAmount: { color: palette.onSurface, fontSize: 28, fontWeight: '800', marginTop: 8 },
  summaryMeta: { color: palette.onSurfaceVariant, fontSize: 12, marginTop: 4 },
  tabs: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 16 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9999, backgroundColor: palette.surfaceContainer, borderWidth: 1, borderColor: 'transparent' },
  tabActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  tabText: { color: palette.onSurfaceVariant, fontSize: 13, fontWeight: '500' },
  tabTextActive: { color: palette.onPrimary, fontWeight: '700', fontSize: 13 },
  section: { color: palette.onSurface, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  empty: { backgroundColor: palette.surfaceContainerLowest, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)', gap: 8 },
  emptyText: { color: palette.onSurfaceVariant },
  link: { color: palette.primary, textAlign: 'center', fontWeight: '700', marginTop: 12 },
  fab: { position: 'absolute', right: 16, bottom: 76, width: 56, height: 56, borderRadius: 28, backgroundColor: palette.secondary, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
});
