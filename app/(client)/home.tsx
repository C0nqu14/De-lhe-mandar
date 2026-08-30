import { MissionCard } from '@/components/MissionCard';
import { palette } from '@/constants/Theme';
import { useMissions } from '@/hooks/useMission';
import { sessionService } from '@/services/sessionService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation } from '@/components/BottomNavigation';

const categories = [
  { label: 'Fila', icon: 'people-outline' as const },
  { label: 'Gás', icon: 'flame-outline' as const },
  { label: 'Mercado', icon: 'basket-outline' as const },
  { label: 'Documentos', icon: 'document-text-outline' as const },
  { label: 'Outros', icon: 'ellipsis-horizontal' as const },
];

export default function ClientHome() {
  const missions = useMissions().filter((m) => m.clientId === sessionService.get()?.userId);
  const name = sessionService.get()?.displayName?.split(' ')[0] || 'João';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.appbar}>
        <Text style={styles.logo}>De Lhe Mandar</Text>
        <View style={styles.user}>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.ola}>Olá,</Text>
            <Text style={styles.nome}>{name}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.slice(0, 2).toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>O que precisa que façamos por si hoje?</Text>
          <Pressable onPress={() => router.push('/(client)/create-mission')} style={({ pressed }) => [styles.heroBtn, pressed && { transform: [{ scale: 0.98 }] }]}>
            <Ionicons name="add-circle-outline" size={20} color={palette.onSecondary} />
            <Text style={styles.heroBtnText}>Criar Missão</Text>
          </Pressable>
          <View style={styles.heroBg} pointerEvents="none">
            <Ionicons name="clipboard-outline" size={120} color={palette.primary} style={{ opacity: 0.05 }} />
          </View>
        </View>

        {/* Categorias */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {categories.map((c) => (
            <View key={c.label} style={styles.cat}>
              <View style={styles.catIcon}>
                <Ionicons name={c.icon} size={22} color={palette.primary} />
              </View>
              <Text style={styles.catLabel}>{c.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Missões Ativas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Missões Ativas</Text>
          <Pressable onPress={() => router.push('/(client)/mission/active')}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </Pressable>
        </View>

        {missions.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={28} color={palette.outline} />
            <Text style={styles.emptyText}>Ainda não tem missões ativas.</Text>
          </View>
        ) : (
          missions.slice(0, 4).map((mission) => (
            <MissionCard key={mission.id} mission={mission} onPress={() => router.push({ pathname: '/(client)/mission/[id]', params: { id: mission.id } })} />
          ))
        )}

        {/* Sugestões */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Sugestões para si</Text>
        <View style={styles.suggestGrid}>
          <View style={styles.suggestCard}>
            <View style={styles.suggestIcon}>
              <Ionicons name="cart-outline" size={20} color={palette.primary} />
            </View>
            <Text style={styles.suggestTitle}>Fazer Compras</Text>
            <Text style={styles.suggestDesc}>Lista de supermercado entregue em casa.</Text>
          </View>
          <View style={styles.suggestCard}>
            <View style={styles.suggestIcon}>
              <Ionicons name="water-outline" size={20} color={palette.primary} />
            </View>
            <Text style={styles.suggestTitle}>Pagar Água</Text>
            <Text style={styles.suggestDesc}>Tratamos do pagamento da sua factura EPAL.</Text>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  appbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: palette.surface, borderBottomWidth: 1, borderBottomColor: 'rgba(195,198,213,0.3)' },
  logo: { color: palette.primary, fontSize: 20, fontWeight: '700' },
  user: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ola: { color: palette.onSurfaceVariant, fontSize: 12, fontWeight: '600', textAlign: 'right' },
  nome: { color: palette.onSurface, fontSize: 14, fontWeight: '700', textAlign: 'right' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: palette.primaryFixed, borderWidth: 2, borderColor: 'rgba(0,68,163,0.15)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: palette.primary, fontWeight: '800' },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  hero: { backgroundColor: palette.surfaceContainerLowest, borderRadius: 24, padding: 20, marginTop: 16, borderWidth: 1, borderColor: 'rgba(195,198,213,0.3)', alignItems: 'center', overflow: 'hidden' },
  heroTitle: { color: palette.primary, fontSize: 20, fontWeight: '600', textAlign: 'center', lineHeight: 28 },
  heroBtn: { marginTop: 16, backgroundColor: palette.secondary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 9999, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: palette.secondary, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  heroBtnText: { color: palette.onSecondary, fontWeight: '700', fontSize: 14 },
  heroBg: { position: 'absolute', top: -10, right: -10 },
  catRow: { gap: 12, paddingVertical: 16, paddingRight: 16 },
  cat: { alignItems: 'center', gap: 8, minWidth: 72 },
  catIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(0,68,163,0.08)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,68,163,0.05)' },
  catLabel: { color: palette.onSurfaceVariant, fontSize: 12, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: palette.onSurface, fontSize: 18, fontWeight: '700' },
  seeAll: { color: palette.primary, fontSize: 14, fontWeight: '500' },
  empty: { backgroundColor: palette.surfaceContainerLowest, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)', gap: 8 },
  emptyText: { color: palette.onSurfaceVariant, fontSize: 14 },
  suggestGrid: { flexDirection: 'row', gap: 12 },
  suggestCard: { flex: 1, backgroundColor: palette.surfaceContainerLow, borderRadius: 16, padding: 16, gap: 8, borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)' },
  suggestIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: palette.surfaceContainerLowest, alignItems: 'center', justifyContent: 'center' },
  suggestTitle: { color: palette.onSurface, fontSize: 14, fontWeight: '700' },
  suggestDesc: { color: palette.onSurfaceVariant, fontSize: 12, lineHeight: 16 },
});
