import { palette, radius } from '@/constants/Theme';
import { missionDraft } from '@/services/missionDraft';
import { missionService } from '@/services/missionService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { ProgressBar } from '@/components/ui/ProgressDots';

export default function PriceStep() {
  const [service, setService] = useState(String(missionDraft.serviceAmount || ''));
  const total = (Number(service) || 0) + missionDraft.purchaseAmount;
  const fee = Math.round((Number(service) || 0) * 0.1);
  const quick = [2000, 5000, 10000];

  const publish = async () => {
    try {
      missionDraft.serviceAmount = Number(service) || 0;
      await missionService.create(missionDraft);
      router.replace('/(client)/home');
    } catch {}
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppHeader title="Criar Missão" onBack={() => router.back()} />
      <View style={styles.progressWrap}>
        <Text style={styles.progressLabel}>Passo 6 de 6 • Oferta</Text>
        <ProgressBar current={6} total={6} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Quanto oferece pelo serviço?</Text>
        <Text style={styles.sub}>Defina o valor que oferece ao Nengue pelo seu tempo.</Text>

        <View style={styles.currencyCard}>
          <Text style={styles.kz}>Kz</Text>
          <TextInput value={service} onChangeText={setService} keyboardType="numeric" placeholder="0,00" placeholderTextColor={palette.outline} style={styles.currencyInput} />
        </View>

        <View style={styles.quick}>
          {quick.map((v) => (
            <Pressable key={v} onPress={() => setService(String(v))} style={[styles.quickChip, service === String(v) && styles.quickActive]}>
              <Text style={[styles.quickText, service === String(v) && styles.quickTextActive]}>{v.toLocaleString('pt-AO')} Kz</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.row}><Text style={styles.label}>Valor do serviço</Text><Text style={styles.value}>{(Number(service) || 0).toLocaleString('pt-AO')} Kz</Text></View>
          <View style={styles.row}><Text style={styles.label}>Compras estimadas</Text><Text style={styles.value}>{missionDraft.purchaseAmount.toLocaleString('pt-AO')} Kz</Text></View>
          <View style={styles.row}><Text style={styles.label}>Taxa (10%)</Text><Text style={styles.value}>{fee.toLocaleString('pt-AO')} Kz</Text></View>
          <View style={styles.total}><Text style={styles.totalLabel}>Total estimado</Text><Text style={styles.totalValue}>{total.toLocaleString('pt-AO')} Kz</Text></View>
          <View style={styles.trust}>
            <Ionicons name="lock-closed-outline" size={14} color={palette.primary} />
            <Text style={styles.trustText}>Pagamento protegido • Só liberta após confirmação</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={() => router.back()} style={styles.secondaryBtn}><Text style={styles.secondaryText}>Anterior</Text></Pressable>
        <Pressable onPress={() => void publish()} disabled={!service} style={({ pressed }) => [styles.primaryBtn, (!service || pressed) && { opacity: !service ? 0.5 : 0.9 }, pressed && { transform: [{ scale: 0.98 }] }]}>
          <Text style={styles.primaryText}>Publicar Missão</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  progressWrap: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, backgroundColor: palette.surface },
  progressLabel: { color: palette.onSurfaceVariant, fontSize: 12, fontWeight: '600' },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  h1: { color: palette.onSurface, fontSize: 28, fontWeight: '700', lineHeight: 34 },
  sub: { color: palette.onSurfaceVariant, fontSize: 14, marginTop: 8, marginBottom: 16 },
  currencyCard: { height: 96, backgroundColor: palette.surfaceContainerLowest, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: radius['2xl'], flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 12 },
  kz: { color: palette.primary, fontSize: 20, fontWeight: '800' },
  currencyInput: { flex: 1, color: palette.primary, fontSize: 36, fontWeight: '800' },
  quick: { flexDirection: 'row', gap: 8, marginTop: 12 },
  quickChip: { flex: 1, height: 44, borderRadius: 9999, borderWidth: 1, borderColor: palette.outlineVariant, backgroundColor: palette.surfaceContainerLowest, alignItems: 'center', justifyContent: 'center' },
  quickActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  quickText: { color: palette.onSurfaceVariant, fontWeight: '600', fontSize: 13 },
  quickTextActive: { color: palette.onPrimary },
  summary: { backgroundColor: palette.surfaceContainerLow, borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  label: { color: palette.onSurfaceVariant, fontSize: 14 },
  value: { color: palette.onSurface, fontWeight: '700' },
  total: { borderTopWidth: 1, borderTopColor: palette.outlineVariant, marginTop: 10, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { color: palette.onSurface, fontWeight: '800' },
  totalValue: { color: palette.primary, fontSize: 18, fontWeight: '800' },
  trust: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 12, backgroundColor: 'rgba(0,68,163,0.06)', padding: 10, borderRadius: 12 },
  trustText: { color: palette.onSurfaceVariant, fontSize: 11, flex: 1 },
  footer: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: palette.surface, borderTopWidth: 1, borderTopColor: 'rgba(195,198,213,0.2)' },
  secondaryBtn: { flex: 1, height: 56, borderRadius: 9999, borderWidth: 1, borderColor: palette.primary, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: palette.primary, fontWeight: '700' },
  primaryBtn: { flex: 1, height: 56, backgroundColor: palette.primary, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: palette.onPrimary, fontWeight: '700' },
});
