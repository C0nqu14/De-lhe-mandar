import { palette } from '@/constants/Theme';
import { ratingService } from '@/services/ratingService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const labels = ['', 'Muito Fraco', 'Fraco', 'Razoável', 'Muito Bom', 'Excelente!'];
const chips = ['Pontualidade', 'Educação', 'Rapidez'];

export default function RatingScreen() {
  const { missionId = '', executorId = '' } = useLocalSearchParams<{ missionId: string; executorId: string }>();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    try {
      await ratingService.create(missionId, executorId, rating, `${selected.join(', ')}${selected.length && comment ? ': ' : ''}${comment}`);
      setSent(true);
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível submeter a avaliação.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.appbar}>
        <Pressable onPress={() => router.back()} hitSlop={12}><Ionicons name="arrow-back" size={22} color={palette.primary} /></Pressable>
        <Text style={styles.logo}>De Lhe Mandar</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Como foi a sua experiência?</Text>
        <Text style={styles.copy}>Avalie o serviço prestado para nos ajudar a melhorar.</Text>

        <View style={styles.profile}>
          <View style={styles.avatar}><Text style={styles.avatarText}>MA</Text><View style={styles.verified}><Ionicons name="checkmark" size={12} color="#FFF" /></View></View>
          <Text style={styles.name}>Marcos A.</Text>
          <Text style={styles.role}>Executor de Missão</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((v) => (
              <Pressable key={v} onPress={() => setRating(v)} hitSlop={8}>
                <Ionicons name={v <= rating ? 'star' : 'star-outline'} size={36} color={v <= rating ? palette.secondaryContainer : palette.outlineVariant} />
              </Pressable>
            ))}
          </View>
          <Text style={styles.ratingLabel}>{labels[rating]}</Text>
        </View>

        <Text style={styles.label}>O que correu bem?</Text>
        <View style={styles.textareaWrap}>
          <TextInput value={comment} onChangeText={setComment} multiline numberOfLines={4} placeholder="Escreva aqui o seu comentário..." placeholderTextColor={palette.outline} style={styles.textarea} />
        </View>

        <View style={styles.chips}>
          {chips.map((chip) => (
            <Pressable key={chip} onPress={() => setSelected((c) => (c.includes(chip) ? c.filter((i) => i !== chip) : [...c, chip]))} style={[styles.chip, selected.includes(chip) && styles.selectedChip]}>
              <Text style={[styles.chipText, selected.includes(chip) && styles.selectedText]}>{chip}</Text>
            </Pressable>
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {sent ? (
          <View style={styles.toast}><Ionicons name="checkmark-circle" size={18} color="#008545" /><Text style={styles.toastText}>Obrigado pela sua avaliação!</Text></View>
        ) : null}

        <Pressable onPress={() => void submit()} disabled={rating === 0} style={({ pressed }) => [styles.btn, rating === 0 && { opacity: 0.5 }, pressed && { transform: [{ scale: 0.98 }] }]}>
          <Text style={styles.btnText}>Submeter Avaliação</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={{ padding: 16 }}><Text style={styles.skip}>Saltar por agora</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  appbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: palette.surface, borderBottomWidth: 1, borderBottomColor: 'rgba(195,198,213,0.3)' },
  logo: { color: palette.primary, fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 16 },
  title: { color: palette.onSurface, fontSize: 28, lineHeight: 34, fontWeight: '700', textAlign: 'center' },
  copy: { color: palette.onSurfaceVariant, fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 8 },
  profile: { alignItems: 'center', backgroundColor: palette.surfaceContainerLowest, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(195,198,213,0.3)', padding: 24, marginTop: 20, marginBottom: 20 },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: palette.primaryFixed, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: palette.surfaceContainerLowest },
  avatarText: { color: palette.primary, fontSize: 24, fontWeight: '800' },
  verified: { position: 'absolute', right: -2, bottom: 0, backgroundColor: palette.primary, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: palette.surfaceContainerLowest },
  name: { color: palette.onSurface, fontSize: 18, fontWeight: '800', marginTop: 12 },
  role: { color: palette.onSurfaceVariant, fontSize: 13, marginTop: 2, marginBottom: 16 },
  stars: { flexDirection: 'row', gap: 4 },
  ratingLabel: { color: palette.secondary, fontWeight: '700', marginTop: 8, height: 20 },
  label: { color: palette.onSurface, fontWeight: '700', fontSize: 14, marginBottom: 8 },
  textareaWrap: { backgroundColor: palette.surfaceContainerLowest, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: 16, minHeight: 110, padding: 12 },
  textarea: { flex: 1, color: palette.onSurface, fontSize: 14, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 14 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9999, borderWidth: 1, borderColor: palette.outlineVariant, backgroundColor: palette.surfaceContainerLowest },
  selectedChip: { backgroundColor: palette.primary, borderColor: palette.primary },
  chipText: { color: palette.onSurfaceVariant, fontSize: 13, fontWeight: '500' },
  selectedText: { color: palette.onPrimary },
  error: { color: palette.error, textAlign: 'center', marginBottom: 8 },
  toast: { flexDirection: 'row', gap: 8, backgroundColor: 'rgba(0,133,69,0.1)', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  toastText: { color: '#008545', fontWeight: '600' },
  btn: { height: 56, backgroundColor: palette.secondaryContainer, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: palette.onSecondaryContainer, fontWeight: '700', fontSize: 14 },
  skip: { color: palette.onSurfaceVariant, textAlign: 'center', fontWeight: '600' },
});
