import { sessionService } from '@/services/sessionService';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
export default function Index() { const [ready, setReady] = useState(false); const [role, setRole] = useState<'CLIENT' | 'EXECUTOR' | null>(null); useEffect(() => { void sessionService.restoreSession().then((current) => { setRole(current?.role ?? null); setReady(true); }); }, []); if (!ready) return null; return <Redirect href={role === 'CLIENT' ? '/(client)/home' : role === 'EXECUTOR' ? '/(executor)/dashboard' : '/(auth)/login'} />; }