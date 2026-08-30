import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppHeader } from '@/components/AppHeader';
import { ProgressBar } from '@/components/ui/ProgressDots';
import { palette, radius } from '@/constants/Theme';
import { missionDraft } from '@/services/missionDraft';

const chips = ['Compras', 'Fila', 'Gás', 'Documentos', 'Entregas', 'Outros'];

export default function StepOne() {
  const [title, setTitle] = useState(missionDraft.title || '');
  const [description, setDescription] = useState(missionDraft.description || '');
  const [category, setCategory] = useState(missionDraft.category || 'Compras');

  const next = () => {
    if (!title.trim()) {
      alert('Por favor, informe o título da missão.');
      return;
    }

    missionDraft.title = title.trim();
    missionDraft.description = description.trim();
    missionDraft.category = category;

    router.push('/(client)/create-mission/step-two');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppHeader title="Criar Missão" onBack={() => router.back()} />
      
      <View style={styles.progressWrap}>
        <Text style={styles.progressLabel}>Passo 1 de 6 • O que precisa?</Text>
        <ProgressBar current={1} total={6} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        keyboardShouldPersistTaps="handled" 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>O que precisa que façamos?</Text>
        <Text style={styles.sub}>Descreva com clareza para atrair o Nengue ideal.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Título da missão</Text>
          <View style={styles.inputWrap}>
            <TextInput 
              value={title} 
              onChangeText={setTitle} 
              placeholder="Ex: Fila no banco BIC" 
              placeholderTextColor={palette.outline} 
              style={styles.input} 
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Detalhes</Text>
          <View style={[styles.inputWrap, styles.textareaWrap]}>
            <TextInput 
              value={description} 
              onChangeText={setDescription} 
              multiline 
              placeholder="Acrescente todos os detalhes importantes" 
              placeholderTextColor={palette.outline} 
              style={[styles.input, styles.textarea]} 
              textAlignVertical="top" 
            />
          </View>
        </View>

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.chips}>
          {chips.map((c) => (
            <Pressable 
              key={c} 
              onPress={() => setCategory(c)} 
              style={[styles.chip, category === c && styles.chipActive]}
            >
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.tip}>
          <View style={styles.tipIcon}>
            <Ionicons name="bulb-outline" size={16} color={palette.primary} />
          </View>
          <Text style={styles.tipText}>
            Dica: quanto mais detalhes, mais rápido o Nengue aceita. Inclua tamanho, peso ou urgência.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          onPress={next} 
          style={({ pressed }) => [styles.btn, pressed && { transform: [{ scale: 0.98 }] }]}
        >
          <Text style={styles.btnText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={18} color={palette.onSecondaryContainer} />
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
  h1: { color: palette.onSurface, fontSize: 28, fontWeight: '700', lineHeight: 34 },
  sub: { color: palette.onSurfaceVariant, marginTop: 6, marginBottom: 20, fontSize: 14 },
  field: { gap: 8, marginBottom: 16 },
  label: { color: palette.onSurfaceVariant, fontSize: 14, fontWeight: '500' },
  inputWrap: { borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: radius.xl, backgroundColor: palette.surfaceContainerLowest, minHeight: 56, justifyContent: 'center' },
  textareaWrap: { minHeight: 130, paddingTop: 12 },
  input: { paddingHorizontal: 16, color: palette.onSurface, fontSize: 16, flex: 1 },
  textarea: { minHeight: 100 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9999, borderWidth: 1, borderColor: palette.outlineVariant, backgroundColor: palette.surfaceContainerLow },
  chipActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  chipText: { color: palette.onSurfaceVariant, fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: palette.onPrimary, fontWeight: '700' },
  tip: { flexDirection: 'row', gap: 10, backgroundColor: 'rgba(0,68,163,0.06)', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: 'rgba(0,68,163,0.08)' },
  tipIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,68,163,0.1)', alignItems: 'center', justifyContent: 'center' },
  tipText: { flex: 1, color: palette.onSurfaceVariant, fontSize: 12, lineHeight: 16 },
  footer: { padding: 16, backgroundColor: palette.surface, borderTopWidth: 1, borderTopColor: 'rgba(195,198,213,0.2)' },
  btn: { height: 56, backgroundColor: palette.secondaryContainer, borderRadius: 9999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { color: palette.onSecondaryContainer, fontWeight: '700', fontSize: 14 },
});