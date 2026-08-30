import { palette, radius } from '@/constants/Theme';
import { sessionService } from '@/services/sessionService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'EXECUTOR'>('CLIENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const register = async () => {
    try {
      setLoading(true);
      setError('');
      const session = await sessionService.signUp(email.trim(), password, name.trim(), role);
      const destination = session.role === 'CLIENT' ? '/(client)/home' : '/(executor)/dashboard';
      router.replace(destination);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.appbar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={palette.primary} />
        </Pressable>
        <Text style={styles.appbarTitle}>De Lhe Mandar</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.h1}>Crie a sua conta</Text>
          <Text style={styles.sub}>Escolha como quer usar o De Lhe Mandar.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputWrap}>
              <TextInput value={name} onChangeText={setName} placeholder="Seu nome" placeholderTextColor={palette.outline} style={styles.input} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="seu@email.com" placeholderTextColor={palette.outline} style={styles.input} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Palavra-passe</Text>
            <View style={styles.inputWrap}>
              <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Crie uma palavra-passe" placeholderTextColor={palette.outline} style={styles.input} />
            </View>
          </View>

          {/* Código convite opcional - hidden but kept layout */}
          <View style={styles.field}>
            <Text style={styles.label}>Código de convite (opcional)</Text>
            <View style={styles.inputWrap}>
              <TextInput placeholder="Ex: CONVITE123" placeholderTextColor={palette.outline} style={styles.input} />
            </View>
          </View>

          <View style={styles.roles}>
            <Pressable onPress={() => setRole('CLIENT')} style={[styles.role, role === 'CLIENT' && styles.roleActive]}>
              <Ionicons name="person-outline" size={18} color={role === 'CLIENT' ? palette.onPrimary : palette.onSurfaceVariant} />
              <Text style={[styles.roleText, role === 'CLIENT' && styles.roleTextActive]}>Cota</Text>
            </Pressable>
            <Pressable onPress={() => setRole('EXECUTOR')} style={[styles.role, role === 'EXECUTOR' && styles.roleActive]}>
              <Ionicons name="bicycle-outline" size={18} color={role === 'EXECUTOR' ? palette.onPrimary : palette.onSurfaceVariant} />
              <Text style={[styles.roleText, role === 'EXECUTOR' && styles.roleTextActive]}>Nengue</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => setAccepted((v) => !v)} style={styles.checkRow}>
            <View style={[styles.checkbox, accepted && styles.checkboxActive]}>
              {accepted ? <Ionicons name="checkmark" size={14} color={palette.onPrimary} /> : null}
            </View>
            <Text style={styles.checkText}>Aceito os <Text style={styles.link}>Termos e Condições</Text> e a Política de Privacidade</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable onPress={() => void register()} disabled={loading} style={({ pressed }) => [styles.primaryBtn, pressed && { transform: [{ scale: 0.98 }] }, loading && { opacity: 0.7 }]}>
            {loading ? <ActivityIndicator color={palette.onPrimary} /> : <Text style={styles.primaryText}>Criar Conta</Text>}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>
              Já tem conta? <Text style={{ color: palette.primary, fontWeight: '700' }}>Entrar</Text>
            </Text>
          </Pressable>

          <View style={styles.trust}>
            <View style={styles.trustPill}>
              <Ionicons name="shield-checkmark-outline" size={14} color={palette.primary} />
              <Text style={styles.trustText}>Dados protegidos</Text>
            </View>
            <View style={styles.trustPill}>
              <Ionicons name="checkmark-circle-outline" size={14} color={palette.primary} />
              <Text style={styles.trustText}>Verificado</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  appbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: palette.surface, borderBottomWidth: 1, borderBottomColor: 'rgba(195,198,213,0.3)' },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  appbarTitle: { color: palette.primary, fontSize: 20, fontWeight: '700' },
  content: { padding: 16 },
  card: { backgroundColor: palette.surfaceContainerLowest, borderRadius: 24, padding: 16, borderWidth: 1, borderColor: 'rgba(195,198,213,0.3)' },
  h1: { color: palette.onSurface, fontSize: 28, fontWeight: '700', lineHeight: 34 },
  sub: { color: palette.onSurfaceVariant, fontSize: 14, marginTop: 6, marginBottom: 20 },
  field: { gap: 8, marginBottom: 14 },
  label: { color: palette.onSurfaceVariant, fontSize: 14, fontWeight: '500' },
  inputWrap: { height: 56, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: radius.xl, backgroundColor: palette.surfaceContainerLowest, justifyContent: 'center' },
  input: { flex: 1, paddingHorizontal: 16, color: palette.onSurface, fontSize: 16 },
  roles: { flexDirection: 'row', gap: 10, marginTop: 4 },
  role: { flex: 1, height: 48, borderRadius: radius.xl, borderWidth: 1, borderColor: palette.outlineVariant, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: palette.surfaceContainerLowest },
  roleActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  roleText: { color: palette.onSurfaceVariant, fontWeight: '700' },
  roleTextActive: { color: palette.onPrimary },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1, borderColor: palette.outlineVariant, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.surfaceContainerLowest },
  checkboxActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  checkText: { flex: 1, color: palette.onSurfaceVariant, fontSize: 12, lineHeight: 16 },
  link: { color: palette.primary, fontWeight: '600' },
  error: { color: palette.error, marginTop: 12, fontSize: 13 },
  primaryBtn: { height: 56, backgroundColor: palette.primary, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  primaryText: { color: palette.onPrimary, fontWeight: '700', fontSize: 14 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(195,198,213,0.4)' },
  dividerText: { color: palette.outline, fontSize: 12, fontWeight: '600' },
  loginLink: { textAlign: 'center', color: palette.onSurfaceVariant, fontSize: 14 },
  trust: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 16 },
  trustPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: palette.surfaceContainerLow, borderRadius: 9999 },
  trustText: { color: palette.onSurfaceVariant, fontSize: 11, fontWeight: '600' },
});
