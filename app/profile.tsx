import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@/constants/Theme';
import { missionService } from '@/services/missionService';
import { sessionService } from '@/services/sessionService';

export default function ProfileScreen() {
  const profile = sessionService.getProfile();
  const isExecutor = profile?.role === 'EXECUTOR';
  const name = profile?.full_name || 'Utilizador';
  const roleLabel = isExecutor ? 'Nengue' : 'Cota';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAmount: 0,
    activeCount: 0,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        setLoading(true);
        
        // Carrega as missões do serviço de forma segura
        const missions = typeof missionService.getMissions === 'function' 
          ? await missionService.getMissions() 
          : [];

        if (isExecutor) {
          const completed = missions.filter((m: any) => m.status === 'COMPLETED');
          const totalEarnings = completed.reduce((acc: number, curr: any) => acc + (curr.serviceAmount || curr.service_amount || 0), 0);
          const active = missions.filter((m: any) => m.status !== 'COMPLETED' && m.status !== 'CANCELLED').length;

          if (isMounted) {
            setStats({ totalAmount: totalEarnings, activeCount: active });
          }
        } else {
          const totalSpent = missions.reduce(
            (acc: number, curr: any) => acc + (curr.serviceAmount || curr.service_amount || 0) + (curr.purchaseAmount || curr.purchase_amount || 0),
            0
          );
          const active = missions.filter((m: any) => m.status !== 'COMPLETED' && m.status !== 'CANCELLED').length;

          if (isMounted) {
            setStats({ totalAmount: totalSpent, activeCount: active });
          }
        }
      } catch (error) {
        console.error('[PROFILE] Erro ao carregar estatísticas:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, [isExecutor]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.appbar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={palette.primary} />
        </Pressable>
        <Text style={styles.appbarTitle}>Perfil</Text>
        <Pressable onPress={() => router.push('/(client)/notifications')}>
          <Ionicons name="settings-outline" size={20} color={palette.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>{name.slice(0, 2).toUpperCase()}</Text>
            </View>
            <Pressable style={styles.editFab}>
              <Ionicons name="pencil" size={14} color={palette.onPrimary} />
            </Pressable>
          </View>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.ratingPill}>
            <Ionicons name="shield-checkmark" size={14} color={palette.secondary} />
            <Text style={styles.ratingText}>
              {roleLabel} {profile?.created_at ? `desde ${new Date(profile.created_at).getFullYear()}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            {loading ? (
              <ActivityIndicator color={palette.primary} size="small" />
            ) : (
              <Text style={styles.statValue}>
                Kz {stats.totalAmount.toLocaleString('pt-AO')}
              </Text>
            )}
            <Text style={styles.statLabel}>{isExecutor ? 'Ganhos totais' : 'Total gasto'}</Text>
          </View>
          <View style={styles.statCard}>
            {loading ? (
              <ActivityIndicator color={palette.primary} size="small" />
            ) : (
              <Text style={styles.statValue}>{stats.activeCount}</Text>
            )}
            <Text style={styles.statLabel}>Missões ativas</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <Pressable style={styles.menuItem} onPress={() => router.push('/history')}>
            <View style={styles.menuIcon}>
              <Ionicons name="time-outline" size={18} color={palette.primary} />
            </View>
            <Text style={styles.menuText}>Histórico de missões</Text>
            <Ionicons name="chevron-forward" size={18} color={palette.outline} />
          </Pressable>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="wallet-outline" size={18} color={palette.primary} />
            </View>
            <Text style={styles.menuText}>Pagamentos</Text>
            <Ionicons name="chevron-forward" size={18} color={palette.outline} />
          </Pressable>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="briefcase-outline" size={18} color={palette.primary} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Text style={styles.menuText}>
                {isExecutor ? 'Modo Cota' : 'Tornar-se Nengue'}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Novo</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.outline} />
          </Pressable>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="help-circle-outline" size={18} color={palette.primary} />
            </View>
            <Text style={styles.menuText}>Ajuda</Text>
            <Ionicons name="chevron-forward" size={18} color={palette.outline} />
          </Pressable>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="document-text-outline" size={18} color={palette.primary} />
            </View>
            <Text style={styles.menuText}>Termos</Text>
            <Ionicons name="chevron-forward" size={18} color={palette.outline} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => void sessionService.signOut().then(() => router.replace('/(auth)/login'))}
          style={styles.logout}
        >
          <Text style={styles.logoutText}>Terminar Sessão</Text>
        </Pressable>
        <Text style={styles.version}>v1.0.0 • De Lhe Mandar</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  appbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: palette.surface, borderBottomWidth: 1, borderBottomColor: 'rgba(195,198,213,0.3)' },
  appbarTitle: { color: palette.onSurface, fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  header: { alignItems: 'center', paddingVertical: 24 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: palette.primaryFixed, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: palette.surfaceContainerLowest },
  initials: { color: palette.primary, fontSize: 28, fontWeight: '800' },
  editFab: { position: 'absolute', right: -4, bottom: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: palette.surfaceContainerLowest },
  name: { color: palette.onSurface, fontSize: 22, fontWeight: '800', marginTop: 12 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, backgroundColor: palette.surfaceContainerLow, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999 },
  ratingText: { color: palette.onSurfaceVariant, fontSize: 12, fontWeight: '600' },
  stats: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: palette.surfaceContainerLowest, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)' },
  statValue: { color: palette.primary, fontSize: 18, fontWeight: '800' },
  statLabel: { color: palette.onSurfaceVariant, fontSize: 12, marginTop: 4 },
  menu: { backgroundColor: palette.surfaceContainerLowest, borderRadius: 24, marginTop: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: palette.surfaceVariant },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,68,163,0.08)', alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1, color: palette.onSurface, fontSize: 15, fontWeight: '500' },
  badge: { backgroundColor: palette.secondaryContainer, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9999 },
  badgeText: { color: palette.onSecondaryContainer, fontSize: 10, fontWeight: '700' },
  logout: { height: 56, borderRadius: 9999, borderWidth: 1, borderColor: palette.error, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  logoutText: { color: palette.error, fontWeight: '700' },
  version: { textAlign: 'center', color: palette.outline, fontSize: 12, marginTop: 12 },
});