import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { palette, radius } from '@/constants/Theme';
import { missionDraft } from '@/services/missionDraft';
import { AppHeader } from '@/components/AppHeader';
import { ProgressBar } from '@/components/ui/ProgressDots';

export default function PurchaseValue() {
  const [value, setValue] = useState(String(missionDraft.purchaseAmount || ''));

  const next = () => {
    missionDraft.purchaseAmount = Number(value) || 0;
    router.push('/(client)/create-mission/price');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppHeader title="Criar Missão" onBack={() => router.back()} />
      <View style={styles.progressWrap}>
        <Text style={styles.progressLabel}>Passo 5 de 6 • Valor estimado</Text>
        <ProgressBar current={5} total={6} />
      </View>

      <View style={styles.content}>
        <Text style={styles.h1}>Qual o valor estimado das compras?</Text>
        <Text style={styles.sub}>Este valor será retido e devolvido com comprovativo.</Text>

        <View style={styles.currencyCard}>
          <Text style={styles.kz}>Kz</Text>
          <TextInput value={value} onChangeText={setValue} keyboardType="numeric" placeholder="0,00" placeholderTextColor={palette.outline} style={styles.currencyInput} />
        </View>

        <View style={styles.info}>
          <Ionicons name="shield-checkmark-outline" size={16} color={palette.primary} />
          <Text style={styles.infoText}>Valor retido com segurança até a confirmação da entrega.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={() => router.back()} style={styles.secondaryBtn}><Text style={styles.secondaryText}>Anterior</Text></Pressable>
        <Pressable onPress={next} style={({ pressed }) => [styles.primaryBtn, pressed && { transform: [{ scale: 0.98 }] }]}>
          <Text style={styles.primaryText}>Continuar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  progressWrap: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, backgroundColor: palette.surface },
  progressLabel: { color: palette.onSurfaceVariant, fontSize: 12, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  h1: { color: palette.onSurface, fontSize: 28, fontWeight: '700', lineHeight: 34 },
  sub: { color: palette.onSurfaceVariant, fontSize: 14, marginTop: 8, marginBottom: 20 },
  currencyCard: { height: 96, backgroundColor: palette.surfaceContainerLowest, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: radius['2xl'], flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 12 },
  kz: { color: palette.primary, fontSize: 20, fontWeight: '800' },
  currencyInput: { flex: 1, color: palette.primary, fontSize: 36, fontWeight: '800' },
  info: { flexDirection: 'row', gap: 8, backgroundColor: 'rgba(0,68,163,0.06)', borderRadius: 12, padding: 12, marginTop: 16, alignItems: 'center' },
  infoText: { flex: 1, color: palette.onSurfaceVariant, fontSize: 12, lineHeight: 16 },
  footer: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: palette.surface, borderTopWidth: 1, borderTopColor: 'rgba(195,198,213,0.2)' },
  secondaryBtn: { flex: 1, height: 56, borderRadius: 9999, borderWidth: 1, borderColor: palette.primary, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: palette.primary, fontWeight: '700' },
  primaryBtn: { flex: 1, height: 56, backgroundColor: palette.secondaryContainer, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: palette.onSecondaryContainer, fontWeight: '700' },
});
