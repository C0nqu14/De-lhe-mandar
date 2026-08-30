import { MockSession, UserRole } from '@/types/session';
import { supabaseService, SupabaseUser } from './supabaseService';

const VALID_ROLES = new Set<UserRole>(['CLIENT', 'EXECUTOR']);

let session: MockSession | null = null;
let currentProfile: SupabaseUser | null = null;

function normalizeRole(role: string | null | undefined): UserRole | null {
  if (!role || !VALID_ROLES.has(role as UserRole)) {
    return null;
  }

  return role as UserRole;
}

export const sessionService = {
  get() {
    return session;
  },

  getProfile() {
    return currentProfile;
  },

  async signIn(_role: UserRole, email?: string, password?: string) {
    if (!email || !password) {
      throw new Error('Informe email e palavra-passe para entrar.');
    }

    const { user, profile } = await supabaseService.signIn(email, password);
    const resolvedRole = normalizeRole(profile.role);

    if (!resolvedRole) {
      throw new Error('Perfil inválido: role não reconhecido.');
    }

    currentProfile = profile;
    session = { userId: user.id, role: resolvedRole, displayName: profile.full_name };
    console.log('[AUTH] redirecting', resolvedRole);
    return session;
  },

  async signUp(email: string, password: string, displayName: string, role: UserRole) {
    try {
      const { user, profile } = await supabaseService.signUp(email, password, displayName, role);
      const resolvedRole = normalizeRole(profile.role);

      if (!resolvedRole) {
        throw new Error('Perfil inválido: role não reconhecido.');
      }

      currentProfile = profile;
      session = {
        userId: user.id,
        role: resolvedRole,
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
      if (!currentUser) {
        session = null;
        currentProfile = null;
        return null;
      }

      const profile = await supabaseService.getProfile(currentUser.id);
      const resolvedRole = normalizeRole(profile.role);

      if (!resolvedRole) {
        throw new Error('Role inválida para a sessão atual.');
      }

      currentProfile = profile;
      session = {
        userId: currentUser.id,
        role: resolvedRole,
        displayName: profile.full_name,
      };
      return session;
    } catch (error) {
      session = null;
      currentProfile = null;
      return null;
    }
  },

  onAuthStateChange(callback: (session: MockSession | null) => void) {
    return supabaseService.onAuthStateChange((user) => {
      if (user) {
        const resolvedRole = normalizeRole(user.role);

        if (!resolvedRole) {
          callback(null);
          return;
        }

        const newSession: MockSession = {
          userId: user.id,
          role: resolvedRole,
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