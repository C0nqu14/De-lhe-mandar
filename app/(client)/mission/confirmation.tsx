import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { AppHeader } from '@/components/AppHeader';
import { MissionQRCode } from '@/components/MissionQRCode';
import { palette } from '@/constants/Theme';
import { useMission } from '@/hooks/useMission';
import { missionService } from '@/services/missionService';

export default function ClientConfirmation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const mission = useMission(id || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    missionService
      .refreshMission(id)
      .catch((err) => console.error('[CONFIRMATION] Erro ao carregar missão:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <AppHeader title="Confirmar Conclusão" onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.loadingText}>A carregar código de confirmação...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!mission) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <AppHeader title="Confirmar Conclusão" onBack={() => router.back()} />
        <View style={styles.center}>
          <Text style={styles.emptyText}>Missão não encontrada.</Text>
          <Pressable onPress={() => router.replace('/(client)/home')} style={styles.button}>
            <Text style={styles.buttonText}>Voltar à Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppHeader title="Confirmar Conclusão" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Confirme a entrega</Text>
          <Text style={styles.copy}>
            Mostre este QR ao Nengue ou diga o código OTP para validar a conclusão da missão.
          </Text>
        </View>

        <MissionQRCode mission={mission} />

        <View style={styles.dots}>
          <View style={[styles.dot, styles.active]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Pressable
          onPress={() => router.replace('/(client)/home')}
          style={({ pressed }) => [styles.button, pressed && { transform: [{ scale: 0.98 }] }]}
        >
          <Text style={styles.buttonText}>Voltar à Home</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 16, paddingTop: 16, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 16 },
  title: { color: palette.onSurface, fontSize: 24, fontWeight: '700', textAlign: 'center' },
  copy: { color: palette.onSurfaceVariant, textAlign: 'center', lineHeight: 20, marginTop: 8, fontSize: 14 },
  dots: { flexDirection: 'row', gap: 8, marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.outlineVariant },
  active: { backgroundColor: palette.primary, width: 24 },
  button: { width: '100%', height: 56, backgroundColor: palette.primary, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  buttonText: { color: palette.onPrimary, fontWeight: '700', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  loadingText: { color: palette.onSurfaceVariant, fontSize: 14 },
  emptyText: { color: palette.onSurfaceVariant, fontSize: 16, textAlign: 'center' },
});