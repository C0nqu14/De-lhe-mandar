import { MockSession, UserRole } from '@/types/session';

let session: MockSession | null = null;
export const sessionService = {
  get() { return session; },
  signIn(role: UserRole) { session = role === 'CLIENT' ? { userId: 'client-ana', role, displayName: 'Ana M.' } : { userId: 'executor-marcos', role, displayName: 'Marcos A.' }; return session; },
  signOut() { session = null; },
};