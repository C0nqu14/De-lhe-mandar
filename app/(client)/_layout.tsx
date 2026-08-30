import { sessionService } from '@/services/sessionService';
import { Redirect, Stack, type Href } from 'expo-router';
import { useEffect, useState } from 'react';

export default function ClientLayout() {
  const [redirectTo, setRedirectTo] = useState<Href | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      try {
        const current = await sessionService.restoreSession();

        if (!isMounted) return;

        if (!current) {
          setRedirectTo('/(auth)/login' as Href);
          setReady(true);
          return;
        }

        if (current.role !== 'CLIENT') {
          setRedirectTo((current.role === 'EXECUTOR' ? '/(executor)/dashboard' : '/(auth)/login') as Href);
          setReady(true);
          return;
        }

        setRedirectTo(null);
        setReady(true);
      } catch {
        if (isMounted) {
          setRedirectTo('/(auth)/login' as Href);
          setReady(true);
        }
      }
    };

    void verifyAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!ready) return null;
  if (redirectTo) return <Redirect href={redirectTo} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}