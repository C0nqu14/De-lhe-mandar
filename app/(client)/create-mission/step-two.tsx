import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { palette, radius } from '@/constants/Theme';
import { missionDraft } from '@/services/missionDraft';
import { getCurrentLocation, requestForegroundPermission } from '@/services/locationService';
import { AppHeader } from '@/components/AppHeader';
import { ProgressBar } from '@/components/ui/ProgressDots';

export default function StepTwo() {
  const [location, setLocation] = useState(missionDraft.location);
  const [message, setMessage] = useState('');
  const [when, setWhen] = useState<'AGORA' | 'AGENDAR'>('AGORA');

  const capture = async () => {
    setMessage('A pedir acesso à localização...');
    if (!(await requestForegroundPermission())) {
      setMessage('Sem localização GPS, pode continuar a indicar o endereço manualmente.');
      return;
    }
    try {
      const position = await getCurrentLocation();
      missionDraft.destinationLocation = position;
      setMessage('Destino GPS guardado.');
    } catch {
      setMessage('Não foi possível obter GPS. Pode continuar manualmente.');
    }
  };

  const next = () => {
    missionDraft.location = location;
    router.push('/(client)/create-mission/step-three');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppHeader title="Criar Missão" onBack={() => router.back()} />
      <View style={styles.progressWrap}>
        <Text style={styles.progressLabel}>Passo 2 de 6 • Onde?</Text>
        <ProgressBar current={2} total={6} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Onde?</Text>
        <Text style={styles.sub}>Indique o local e permita GPS para definir o destino com precisão.</Text>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Endereço ou referência</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="location-outline" size={18} color={palette.onSurfaceVariant} style={{ marginLeft: 14 }} />
              <TextInput value={location} onChangeText={setLocation} placeholder="Ex.: Maianga, Luanda" placeholderTextColor={palette.outline} style={styles.input} />
            </View>
          </View>

          <View style={styles.mapPreview}>
            <Ionicons name="map-outline" size={28} color={palette.primary} />
            <Text style={styles.mapText}>Pré-visualização do mapa</Text>
            <Pressable onPress={capture} style={styles.mapBtn}>
              <Ionicons name="locate" size={16} color={palette.primary} />
              <Text style={styles.mapBtnText}>Usar a minha localização atual</Text>
            </Pressable>
          </View>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>

        <Text style={[styles.label, { marginTop: 20, marginBottom: 8 }]}>Quando?</Text>
        <View style={styles.whenGrid}>
          <Pressable onPress={() => setWhen('AGORA')} style={[styles.whenCard, when === 'AGORA' && styles.whenActive]}>
            <Ionicons name="flash" size={22} color={when === 'AGORA' ? palette.onPrimary : palette.primary} />
            <Text style={[styles.whenTitle, when === 'AGORA' && styles.whenTitleActive]}>Agora</Text>
            <Text style={styles.whenDesc}>O mais rápido possível</Text>
          </Pressable>
          <Pressable onPress={() => setWhen('AGENDAR')} style={[styles.whenCard, when === 'AGENDAR' && styles.whenActive]}>
            <Ionicons name="calendar-outline" size={22} color={when === 'AGENDAR' ? palette.onPrimary : palette.primary} />
            <Text style={[styles.whenTitle, when === 'AGENDAR' && styles.whenTitleActive]}>Agendar</Text>
            <Text style={styles.whenDesc}>Escolher data e hora</Text>
          </Pressable>
        </View>
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
  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 16 },
  h1: { color: palette.onSurface, fontSize: 28, fontWeight: '700' },
  sub: { color: palette.onSurfaceVariant, marginTop: 6, marginBottom: 16, fontSize: 14, lineHeight: 20 },
  card: { backgroundColor: palette.surfaceContainerLowest, borderRadius: 24, padding: 16, borderWidth: 1, borderColor: 'rgba(195,198,213,0.3)' },
  field: { gap: 8 },
  label: { color: palette.onSurfaceVariant, fontSize: 14, fontWeight: '500' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 56, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: radius.xl, backgroundColor: palette.surfaceContainerLowest },
  input: { flex: 1, paddingHorizontal: 12, color: palette.onSurface, fontSize: 16 },
  mapPreview: { height: 160, backgroundColor: palette.surfaceContainerLow, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8, borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)', borderStyle: 'dashed' },
  mapText: { color: palette.onSurfaceVariant, fontSize: 12 },
  mapBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: palette.surfaceContainerLowest, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999, borderWidth: 1, borderColor: palette.outlineVariant },
  mapBtnText: { color: palette.primary, fontSize: 12, fontWeight: '600' },
  message: { color: palette.onSurfaceVariant, marginTop: 10, textAlign: 'center', fontSize: 12 },
  whenGrid: { flexDirection: 'row', gap: 12 },
  whenCard: { flex: 1, backgroundColor: palette.surfaceContainerLowest, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: palette.outlineVariant },
  whenActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  whenTitle: { color: palette.onSurface, fontWeight: '700' },
  whenTitleActive: { color: palette.onPrimary },
  whenDesc: { color: palette.onSurfaceVariant, fontSize: 11, textAlign: 'center' },
  footer: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: palette.surface, borderTopWidth: 1, borderTopColor: 'rgba(195,198,213,0.2)' },
  secondaryBtn: { flex: 1, height: 56, borderRadius: 9999, borderWidth: 1, borderColor: palette.primary, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: palette.primary, fontWeight: '700' },
  primaryBtn: { flex: 1, height: 56, backgroundColor: palette.secondaryContainer, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: palette.onSecondaryContainer, fontWeight: '700' },
});
