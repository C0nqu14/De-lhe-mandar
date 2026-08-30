import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { sessionService } from '@/services/sessionService';
import { AppSession } from '@/types/session';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [currentSession, setCurrentSession] = useState<AppSession | null>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Restaura a sessão ao iniciar a aplicação
    sessionService.restoreSession().then((sess) => {
      setCurrentSession(sess);
      setIsAuthInitialized(true);
    });

    // Escuta mudanças de estado da autenticação
    const { unsubscribe } = sessionService.onAuthStateChange((sess) => {
      setCurrentSession(sess);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthInitialized || !loaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inClientGroup = segments[0] === '(client)';
    const inExecutorGroup = segments[0] === '(executor)';

    if (!currentSession) {
      // Se não há sessão e o utilizador não está em auth, redireciona para login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else {
      // Se autenticado como CLIENT (Cota)
      if (currentSession.role === 'CLIENT') {
        if (!inClientGroup) {
          router.replace('/(client)/home');
        }
      } 
      // Se autenticado como EXECUTOR (Nengue)
      else if (currentSession.role === 'EXECUTOR') {
        if (!inExecutorGroup) {
          router.replace('/(executor)/dashboard');
        }
      }
    }

    void SplashScreen.hideAsync();
  }, [currentSession, isAuthInitialized, segments, loaded]);

  if (!loaded || !isAuthInitialized) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(client)" options={{ headerShown: false }} />
        <Stack.Screen name="(executor)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}