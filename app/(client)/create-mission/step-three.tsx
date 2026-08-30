import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { palette, radius } from '@/constants/Theme';
import { missionDraft } from '@/services/missionDraft';
import { AppHeader } from '@/components/AppHeader';
import { ProgressBar } from '@/components/ui/ProgressDots';

export default function StepThree() {
  const [scheduledAt, setScheduledAt] = useState(missionDraft.scheduledAt);
  const [mode, setMode] = useState<'AGORA' | 'AGENDAR'>('AGORA');

  const next = () => {
    missionDraft.scheduledAt = mode === 'AGORA' ? 'Agora' : scheduledAt;
    router.push('/(client)/create-mission/step-four');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppHeader title="Criar Missão" onBack={() => router.back()} />
      <View style={styles.progressWrap}>
        <Text style={styles.progressLabel}>Passo 3 de 6 • Quando?</Text>
        <ProgressBar current={3} total={6} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Quando precisa?</Text>
        <Text style={styles.sub}>Escolha quando o Nengue deve realizar a missão.</Text>

        <Pressable onPress={() => setMode('AGORA')} style={[styles.method, mode === 'AGORA' && styles.methodActive]}>
          <View style={[styles.radio, mode === 'AGORA' && styles.radioActive]}>{mode === 'AGORA' ? <View style={styles.radioDot} /> : null}</View>
          <View style={styles.methodIcon}><Ionicons name="flash" size={20} color={mode === 'AGORA' ? palette.onPrimary : palette.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.methodTitle, mode === 'AGORA' && styles.methodTitleActive]}>Agora</Text>
            <Text style={styles.methodDesc}>Assim que possível</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => setMode('AGENDAR')} style={[styles.method, mode === 'AGENDAR' && styles.methodActive]}>
          <View style={[styles.radio, mode === 'AGENDAR' && styles.radioActive]}>{mode === 'AGENDAR' ? <View style={styles.radioDot} /> : null}</View>
          <View style={styles.methodIcon}><Ionicons name="calendar" size={20} color={mode === 'AGENDAR' ? palette.onPrimary : palette.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.methodTitle, mode === 'AGENDAR' && styles.methodTitleActive]}>Agendar</Text>
            <Text style={styles.methodDesc}>Definir data e hora</Text>
          </View>
        </Pressable>

        {mode === 'AGENDAR' ? (
          <View style={styles.field}>
            <Text style={styles.label}>Data e hora</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="time-outline" size={18} color={palette.onSurfaceVariant} style={{ marginLeft: 14 }} />
              <TextInput value={scheduledAt} onChangeText={setScheduledAt} placeholder="Hoje às 15:00" placeholderTextColor={palette.outline} style={styles.input} />
            </View>
          </View>
        ) : null}
      </ScrollView>

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
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  h1: { color: palette.onSurface, fontSize: 28, fontWeight: '700' },
  sub: { color: palette.onSurfaceVariant, marginTop: 6, marginBottom: 20, fontSize: 14 },
  method: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.surfaceContainerLowest, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: palette.outlineVariant, marginBottom: 12 },
  methodActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: palette.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: palette.onPrimary, backgroundColor: palette.onPrimary },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.primary },
  methodIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  methodTitle: { color: palette.onSurface, fontWeight: '700' },
  methodTitleActive: { color: palette.onPrimary },
  methodDesc: { color: palette.onSurfaceVariant, fontSize: 12 },
  field: { gap: 8, marginTop: 8 },
  label: { color: palette.onSurfaceVariant, fontSize: 14, fontWeight: '500' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 56, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: radius.xl, backgroundColor: palette.surfaceContainerLowest },
  input: { flex: 1, paddingHorizontal: 12, color: palette.onSurface, fontSize: 16 },
  footer: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: palette.surface, borderTopWidth: 1, borderTopColor: 'rgba(195,198,213,0.2)' },
  secondaryBtn: { flex: 1, height: 56, borderRadius: 9999, borderWidth: 1, borderColor: palette.primary, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: palette.primary, fontWeight: '700' },
  primaryBtn: { flex: 1, height: 56, backgroundColor: palette.secondaryContainer, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: palette.onSecondaryContainer, fontWeight: '700' },
});
