import { palette, radius } from '@/constants/Theme';
import { sessionService } from '@/services/sessionService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'EXECUTOR'>('CLIENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const enter = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('[AUTH] signIn started from login screen');
      const currentSession = await sessionService.signIn(role, email.trim(), password);
      const destination = currentSession.role === 'CLIENT' ? '/(client)/home' : '/(executor)/dashboard';
      console.log('[AUTH] redirecting to', destination);
      router.replace(destination);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Não foi possível entrar.';
      setError(message);
      console.log('[AUTH] login error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top AppBar - Transacional */}
      <View style={styles.appbar}>
        <Pressable onPress={() => router.canGoBack() && router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={palette.primary} />
        </Pressable>
        <Text style={styles.appbarTitle}>De Lhe Mandar</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.h1}>Bem-vindo de volta</Text>
          <Text style={styles.sub}>Inicie sessão para gerir as suas missões e tarefas em Angola.</Text>
        </View>

        {/* Role selector - pills */}
        <View style={styles.roles}>
          <Pressable onPress={() => setRole('CLIENT')} style={[styles.role, role === 'CLIENT' && styles.roleActive]}>
            <Text style={[styles.roleText, role === 'CLIENT' && styles.roleTextActive]}>Cota</Text>
          </Pressable>
          <Pressable onPress={() => setRole('EXECUTOR')} style={[styles.role, role === 'EXECUTOR' && styles.roleActive]}>
            <Text style={[styles.roleText, role === 'EXECUTOR' && styles.roleTextActive]}>Nengue</Text>
          </Pressable>
        </View>

        {/* Email - styled as Phone field in HTML */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={palette.onSurfaceVariant} style={{ marginLeft: 14 }} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="seu@email.com"
              placeholderTextColor={palette.outline}
              style={styles.input}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Palavra-passe</Text>
            <Pressable><Text style={styles.forgot}>Esqueceu a palavra-passe?</Text></Pressable>
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              placeholder="Sua palavra-passe"
              placeholderTextColor={palette.outline}
              style={styles.input}
            />
            <Pressable onPress={() => setShowPass((v) => !v)} hitSlop={8} style={{ paddingHorizontal: 14 }}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={palette.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={() => void enter()} disabled={loading} style={({ pressed }) => [styles.primaryBtn, pressed && { transform: [{ scale: 0.98 }] }, loading && { opacity: 0.7 }]}>
          {loading ? <ActivityIndicator color={palette.onPrimary} /> : <Text style={styles.primaryText}>Entrar</Text>}
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>ou continuar com</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn}>
            <Ionicons name="logo-google" size={18} color={palette.onSurface} />
            <Text style={styles.socialText}>Google</Text>
          </Pressable>
          <Pressable style={styles.socialBtn}>
            <Ionicons name="logo-apple" size={18} color={palette.onSurface} />
            <Text style={styles.socialText}>Apple</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem conta? </Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.footerLink}>Criar conta</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.gradient} pointerEvents="none" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  appbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: palette.surface, borderBottomWidth: 1, borderBottomColor: 'rgba(195,198,213,0.3)' },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  appbarTitle: { color: palette.primary, fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32 },
  header: { marginBottom: 24 },
  h1: { color: palette.onSurface, fontSize: 28, fontWeight: '700', lineHeight: 34, letterSpacing: -0.28 },
  sub: { color: palette.onSurfaceVariant, fontSize: 16, lineHeight: 24, marginTop: 8 },
  roles: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  role: { flex: 1, height: 44, borderRadius: 9999, borderWidth: 1, borderColor: palette.outlineVariant, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.surfaceContainerLowest },
  roleActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  roleText: { color: palette.onSurfaceVariant, fontWeight: '600', fontSize: 14 },
  roleTextActive: { color: palette.onPrimary },
  field: { gap: 8, marginBottom: 16 },
  label: { color: palette.onSurfaceVariant, fontSize: 14, fontWeight: '500', letterSpacing: 0.14 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgot: { color: palette.primary, fontSize: 12, fontWeight: '600' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 56, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: radius.xl, backgroundColor: palette.surfaceContainerLowest },
  input: { flex: 1, paddingHorizontal: 12, color: palette.onSurface, fontSize: 16 },
  error: { color: palette.error, marginBottom: 12, fontSize: 13 },
  primaryBtn: { height: 56, backgroundColor: palette.primary, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginTop: 8, flexDirection: 'row' },
  primaryText: { color: palette.onPrimary, fontSize: 14, fontWeight: '700', letterSpacing: 0.1 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(195,198,213,0.5)' },
  dividerText: { color: palette.outline, fontSize: 12, fontWeight: '600' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { flex: 1, height: 56, borderWidth: 1, borderColor: palette.outlineVariant, borderRadius: radius.xl, backgroundColor: palette.surfaceContainerLowest, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  socialText: { color: palette.onSurface, fontSize: 14, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, paddingVertical: 8 },
  footerText: { color: palette.onSurfaceVariant, fontSize: 16 },
  footerLink: { color: palette.primary, fontWeight: '700', fontSize: 16 },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, backgroundColor: 'rgba(0,68,163,0.04)' },
});
