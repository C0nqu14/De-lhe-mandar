import { AppSession, UserRole } from '@/types/session';
import { supabaseService, SupabaseUser } from './supabaseService';

const VALID_ROLES = new Set<UserRole>(['CLIENT', 'EXECUTOR']);

let session: AppSession | null = null;
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

  async signIn(email?: string, password?: string) {
    if (!email || !password) {
      throw new Error('Informe o e-mail e a palavra-passe para entrar.');
    }

    const { user, profile } = await supabaseService.signIn(email, password);
    const resolvedRole = normalizeRole(profile.role);

    if (!resolvedRole) {
      throw new Error('Perfil inválido: papel de utilizador não reconhecido.');
    }

    currentProfile = profile;
    session = { userId: user.id, role: resolvedRole, displayName: profile.full_name };
    return session;
  },

  async signUp(email: string, password: string, displayName: string, role: UserRole) {
    const { user, profile } = await supabaseService.signUp(email, password, displayName, role);
    const resolvedRole = normalizeRole(profile.role);

    if (!resolvedRole) {
      throw new Error('Perfil inválido: papel de utilizador não reconhecido.');
    }

    currentProfile = profile;
    session = {
      userId: user.id,
      role: resolvedRole,
      displayName: profile.full_name,
    };
    return session;
  },

  async signOut() {
    await supabaseService.signOut();
    session = null;
    currentProfile = null;
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
        throw new Error('Papel de utilizador inválido para a sessão atual.');
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

  onAuthStateChange(callback: (session: AppSession | null) => void) {
    return supabaseService.onAuthStateChange((user) => {
      if (user) {
        const resolvedRole = normalizeRole(user.role);

        if (!resolvedRole) {
          callback(null);
          return;
        }

        const newSession: AppSession = {
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