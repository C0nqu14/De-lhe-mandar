import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/types/session';
import type { Database } from '@/types/supabase';

export type SupabaseUser = Database['public']['Tables']['profiles']['Row'];

async function withAuthTimeout<T>(label: string, operation: Promise<T> | PromiseLike<T>, timeoutMs = 15000): Promise<T> {
  return await Promise.race([
    Promise.resolve(operation),
    new Promise<T>((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`${label}: excedeu o tempo limite.`));
      }, timeoutMs);

      Promise.resolve(operation).finally(() => clearTimeout(timer));
    }),
  ]);
}

function metadataProfile(user: { id: string; user_metadata: Record<string, unknown> }) {
  const fullName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.display_name === 'string'
        ? user.user_metadata.display_name
        : '';
  const role = user.user_metadata?.role === 'EXECUTOR' ? 'EXECUTOR' : 'CLIENT';
  return { id: user.id, full_name: fullName, role } as const;
}

export const supabaseService = {
  async signUp(email: string, password: string, displayName: string, role: UserRole) {
    try {
      // 1. Criar a conta na Autenticação do Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
            role,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Não foi possível criar o utilizador.');

      // Se exigir confirmação de email e não houver sessão ativa imediata
      if (!authData.session) {
        throw new Error('Conta criada. Confirme o seu email antes de entrar.');
      }

      // 2. Garantir que a sessão JWT está injetada no cliente HTTP do Supabase
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      });
      if (sessionError) throw sessionError;

      // 3. Inserir/Atualizar o perfil na tabela public.profiles
      // Usamos .maybeSingle() para evitar erro 406 caso a RLS demore a propagar o token
      const profilePayload = {
        id: authData.user.id,
        full_name: displayName || metadataProfile(authData.user).full_name,
        role: role,
      };

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (profileError) throw profileError;

      // Se a RLS impediu a leitura de retorno do select, monta o objeto local de fallback
      const resolvedProfile: SupabaseUser = profile ?? {
        id: authData.user.id,
        full_name: displayName,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return { user: authData.user, profile: resolvedProfile };
    } catch (error) {
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      console.log('[AUTH] signIn started');

      const { data: signInData, error: signInError } = await withAuthTimeout(
        '[AUTH] signInWithPassword',
        supabase.auth.signInWithPassword({ email, password })
      );

      if (signInError) {
        throw signInError;
      }

      if (!signInData?.user) {
        throw new Error('Utilizador inexistente após login.');
      }

      console.log('[AUTH] signIn success');
      console.log('[AUTH] user:', signInData.user.id);
      console.log('[AUTH] session exists:', Boolean(signInData.session));
      console.log('[AUTH] access token exists:', Boolean(signInData.session?.access_token));

      if (!signInData.session) {
        throw new Error('Sessão inexistente após login.');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .single();

      if (profileError) {
        throw new Error(`Erro ao consultar profile: ${profileError.message}`);
      }

      console.log('[AUTH] profile exists:', Boolean(profile));

      if (!profile) {
        throw new Error('Perfil não encontrado para esta sessão.');
      }

      if (profile.role !== 'CLIENT' && profile.role !== 'EXECUTOR') {
        throw new Error('Role inválida para esta conta.');
      }

      console.log('[AUTH] profile loaded');
  console.log('[AUTH] role:', profile.role);

      return { user: signInData.user, profile };
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
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Perfil não encontrado.');

      return profile;
    } catch (error) {
      throw error;
    }
  },

  async createProfileFromMetadata(user: { id: string; user_metadata: Record<string, unknown> }) {
    const payload = metadataProfile(user);
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) throw error;

    return (
      data ?? {
        id: user.id,
        full_name: payload.full_name,
        role: payload.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    );
  },

  async updateProfile(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  onAuthStateChange(callback: (user: (SupabaseUser & { id: string }) | null) => void) {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) throw profileError;
          const resolvedProfile = profile ?? (await this.createProfileFromMetadata(session.user));
          callback({ ...resolvedProfile, id: session.user.id });
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    });

    return () => {
      data?.subscription.unsubscribe();
    };
  },
};