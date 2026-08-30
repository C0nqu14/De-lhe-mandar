import { sessionService } from '@/services/sessionService';
import { Redirect, type Href } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [redirectTo, setRedirectTo] = useState<Href | null>(null);

  useEffect(() => {
    void sessionService.restoreSession().then((current) => {
      const nextRoute: Href =
        current?.role === 'CLIENT'
          ? '/(client)/home'
          : current?.role === 'EXECUTOR'
            ? '/(executor)/dashboard'
            : '/(auth)/login';

      setRedirectTo(nextRoute);
      setReady(true);
    });
  }, []);

  if (!ready) return null;
  if (!redirectTo) return null;

  return <Redirect href={redirectTo} />;
}
