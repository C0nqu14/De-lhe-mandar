import { AppHeader } from '@/components/AppHeader';
import { ProgressBar } from '@/components/ui/ProgressDots';
import { palette } from '@/constants/Theme';
import { missionDraft } from '@/services/missionDraft';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StepFour() {
  const handleNoPurchase = () => {
    missionDraft.purchaseAmount = 0;
    router.push('/(client)/create-mission/price');
  };

  const handleHasPurchase = () => {
    router.push('/(client)/create-mission/purchase-value');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppHeader title="Criar Missão" onBack={() => router.back()} />
      <View style={styles.progressWrap}>
        <Text style={styles.progressLabel}>Passo 4 de 6 • Produtos</Text>
        <ProgressBar current={4} total={6} />
      </View>

      <View style={styles.content}>
        <Text style={styles.h1}>É necessário comprar algum produto?</Text>
        <Text style={styles.sub}>Pode indicar o valor estimado na próxima etapa.</Text>

        <View style={styles.grid}>
          <Pressable
            onPress={handleNoPurchase}
            style={({ pressed }) => [styles.choice, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <View style={styles.choiceIcon}>
              <Ionicons name="close" size={24} color={palette.onSurfaceVariant} />
            </View>
            <Text style={styles.choiceLabel}>Não</Text>
            <Text style={styles.choiceDesc}>Apenas serviço</Text>
          </Pressable>

          <Pressable
            onPress={handleHasPurchase}
            style={({ pressed }) => [styles.choice, styles.choicePrimary, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <View style={[styles.choiceIcon, styles.choiceIconPrimary]}>
              <Ionicons name="cart" size={24} color={palette.onPrimary} />
            </View>
            <Text style={[styles.choiceLabel, styles.choiceLabelPrimary]}>Sim</Text>
            <Text style={[styles.choiceDesc, styles.choiceDescPrimary]}>Compras incluídas</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={() => router.back()} style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Anterior</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  progressWrap: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, backgroundColor: palette.surface },
  progressLabel: { color: palette.onSurfaceVariant, fontSize: 12, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  h1: { color: palette.onSurface, fontSize: 28, lineHeight: 34, fontWeight: '700' },
  sub: { color: palette.onSurfaceVariant, fontSize: 14, marginTop: 8, marginBottom: 24 },
  grid: { flexDirection: 'row', gap: 12 },
  choice: { flex: 1, height: 180, backgroundColor: palette.surfaceContainerLowest, borderRadius: 24, borderWidth: 1, borderColor: palette.outlineVariant, alignItems: 'center', justifyContent: 'center', gap: 8 },
  choicePrimary: { backgroundColor: palette.primary, borderColor: palette.primary },
  choiceIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  choiceIconPrimary: { backgroundColor: 'rgba(255,255,255,0.18)' },
  choiceLabel: { color: palette.onSurface, fontSize: 18, fontWeight: '700' },
  choiceLabelPrimary: { color: palette.onPrimary },
  choiceDesc: { color: palette.onSurfaceVariant, fontSize: 12 },
  choiceDescPrimary: { color: palette.onPrimary },
  footer: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: palette.surface, borderTopWidth: 1, borderTopColor: 'rgba(195,198,213,0.2)' },
  secondaryBtn: { flex: 1, height: 56, borderRadius: 9999, borderWidth: 1, borderColor: palette.primary, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: palette.primary, fontWeight: '700' },
});