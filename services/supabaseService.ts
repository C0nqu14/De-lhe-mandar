import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/types/session';
import type { Database } from '@/types/supabase';

export type SupabaseUser = Database['public']['Tables']['profiles']['Row'];

export const supabaseService = {
  async signUp(email: string, password: string, displayName: string, role: UserRole) {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          display_name: displayName,
          role,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      return { user: authData.user, profile };
    } catch (error) {
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return { user: data.user, profile };
    } catch (error) {
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      throw error;
    }
  },

  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateProfile(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  onAuthStateChange(callback: (user: any) => void) {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getProfile(session.user.id);
        callback({ ...session.user, profile });
      } else {
        callback(null);
      }
    });

    return () => {
      data?.subscription.unsubscribe();
    };
  },
};
