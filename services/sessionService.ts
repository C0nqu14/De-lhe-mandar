import { MockSession, UserRole } from '@/types/session';
import { supabaseService, SupabaseUser } from './supabaseService';

let session: MockSession | null = null;
let currentProfile: SupabaseUser | null = null;

export const sessionService = {
  get() {
    return session;
  },

  getProfile() {
    return currentProfile;
  },

  async signIn(role: UserRole, email?: string, password?: string) {
    if (!email || !password) throw new Error(`Informe email e palavra-passe para entrar como ${role === 'CLIENT' ? 'Cota' : 'Nengue'}.`);
    const { user, profile } = await supabaseService.signIn(email, password);
    if (profile.role !== role) throw new Error('Esta conta pertence ao outro perfil.');
    currentProfile = profile;
    session = { userId: user.id, role: profile.role, displayName: profile.full_name };
    return session;
  },

  async signUp(email: string, password: string, displayName: string, role: UserRole) {
    try {
      const { user, profile } = await supabaseService.signUp(email, password, displayName, role);
      currentProfile = profile;
      session = {
        userId: user.id,
        role: profile.role,
        displayName: profile.full_name,
      };
      return session;
    } catch (error) {
      throw error;
    }
  },

  async signOut() {
    try {
      await supabaseService.signOut();
      session = null;
      currentProfile = null;
    } catch (error) {
      throw error;
    }
  },

  async restoreSession() {
    try {
      const currentUser = await supabaseService.getCurrentUser();
      if (currentUser) {
        const profile = await supabaseService.getProfile(currentUser.id);
        currentProfile = profile;
        session = {
          userId: currentUser.id,
          role: profile.role,
          displayName: profile.full_name,
        };
        return session;
      }
      return null;
    } catch (error) {
      // Silent fail - session not found
      return null;
    }
  },

  onAuthStateChange(callback: (session: MockSession | null) => void) {
    return supabaseService.onAuthStateChange((user) => {
      if (user) {
        const newSession: MockSession = {
          userId: user.id,
          role: user.role,
          displayName: user.full_name,
        };
        session = newSession;
        currentProfile = user;
        callback(newSession);
      } else {
        session = null;
        currentProfile = null;
        callback(null);
      }
    });
  },
};
