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
    try {
      // If email and password provided, use Supabase
      if (email && password) {
        const { user, profile } = await supabaseService.signIn(email, password);
        currentProfile = profile;
        session = {
          userId: user.id,
          role: profile.role,
          displayName: profile.display_name,
        };
      } else {
        // Fallback to mock for testing
        session = role === 'CLIENT'
          ? { userId: 'client-ana', role, displayName: 'Ana M.' }
          : { userId: 'executor-marcos', role, displayName: 'Marcos A.' };
      }
      return session;
    } catch (error) {
      throw error;
    }
  },

  async signUp(email: string, password: string, displayName: string, role: UserRole) {
    try {
      const { user, profile } = await supabaseService.signUp(email, password, displayName, role);
      currentProfile = profile;
      session = {
        userId: user.id,
        role: profile.role,
        displayName: profile.display_name,
      };
      return session;
    } catch (error) {
      throw error;
    }
  },

  async signOut() {
    try {
      if (session?.userId.startsWith('client-') || session?.userId.startsWith('executor-')) {
        // Mock session, just clear
        session = null;
        currentProfile = null;
      } else {
        // Real Supabase session
        await supabaseService.signOut();
        session = null;
        currentProfile = null;
      }
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
          displayName: profile.display_name,
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
      if (user?.profile) {
        const newSession: MockSession = {
          userId: user.id,
          role: user.profile.role,
          displayName: user.profile.display_name,
        };
        session = newSession;
        currentProfile = user.profile;
        callback(newSession);
      } else {
        session = null;
        currentProfile = null;
        callback(null);
      }
    });
  },
};
