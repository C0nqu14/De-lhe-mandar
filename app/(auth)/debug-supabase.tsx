import { Colors } from '@/constants/Colors';
import { sessionService } from '@/services/sessionService';
import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function DebugSupabaseScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [role, setRole] = useState<'CLIENT' | 'EXECUTOR'>('CLIENT');

  const handleSignUp = async () => {
    if (!email || !password || !displayName) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      const session = await sessionService.signUp(email, password, displayName, role);
      setResult(`✓ Sign Up OK\nUserID: ${session?.userId}\nRole: ${session?.role}\nName: ${session?.displayName}`);
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (error) {
      setResult(`✗ Sign Up Erro:\n${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e password');
      return;
    }
    setLoading(true);
    try {
      const session = await sessionService.signIn(role, email, password);
      setResult(`✓ Sign In OK\nUserID: ${session?.userId}\nRole: ${session?.role}\nName: ${session?.displayName}`);
      setEmail('');
      setPassword('');
    } catch (error) {
      setResult(`✗ Sign In Erro:\n${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const currentSession = sessionService.get();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>🔐 Debug Supabase Auth</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Role:</Text>
          <View style={styles.roleButtons}>
            <Pressable
              style={[styles.roleBtn, role === 'CLIENT' && styles.roleBtnActive]}
              onPress={() => setRole('CLIENT')}
            >
              <Text style={styles.roleBtnText}>CLIENT (Cota)</Text>
            </Pressable>
            <Pressable
              style={[styles.roleBtn, role === 'EXECUTOR' && styles.roleBtnActive]}
              onPress={() => setRole('EXECUTOR')}
            >
              <Text style={styles.roleBtnText}>EXECUTOR (Nengue)</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Testar Sign Up (Supabase Real)</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            editable={!loading}
          />
          <Pressable
            style={[styles.button, styles.buttonPrimary, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? '⏳ Carregando...' : '✓ Sign Up'}</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔑 Testar Sign In (Supabase Real)</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          <Pressable
            style={[styles.button, styles.buttonSuccess, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? '⏳ Carregando...' : '✓ Sign In (Real)'}</Text>
          </Pressable>
        </View>

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}

        {currentSession && (
          <View style={styles.sessionBox}>
            <Text style={styles.sessionTitle}>📌 Sessão Atual:</Text>
            <Text style={styles.sessionText}>UserID: {currentSession.userId}</Text>
            <Text style={styles.sessionText}>Role: {currentSession.role}</Text>
            <Text style={styles.sessionText}>Name: {currentSession.displayName}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FCF9F8' },
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.light.tint, marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.light.text, marginBottom: 8 },
  roleButtons: { flexDirection: 'row', gap: 8 },
  roleBtn: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#EEE', alignItems: 'center' },
  roleBtnActive: { backgroundColor: Colors.light.tint },
  roleBtnText: { fontSize: 12, fontWeight: '600', color: '#000' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 10, fontSize: 14 },
  button: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonPrimary: { backgroundColor: Colors.light.tint },
  buttonSuccess: { backgroundColor: '#4CAF50' },
  buttonSecondary: { backgroundColor: Colors.light.secondary },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  resultBox: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 8, marginTop: 16, borderLeftWidth: 4, borderLeftColor: Colors.light.tint },
  resultText: { fontSize: 13, color: '#333', fontFamily: 'monospace', lineHeight: 20 },
  sessionBox: { backgroundColor: '#E8F5E9', padding: 12, borderRadius: 8, marginTop: 16, borderLeftWidth: 4, borderLeftColor: '#4CAF50' },
  sessionTitle: { fontSize: 14, fontWeight: '700', color: '#2E7D32', marginBottom: 8 },
  sessionText: { fontSize: 12, color: '#2E7D32', marginBottom: 4, fontFamily: 'monospace' },
});
