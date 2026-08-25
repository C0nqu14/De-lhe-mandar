import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and publishable key are required');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: {
      getItem: async (key: string) => {
        try {
          const value = await SecureStore.getItemAsync(key);
          return value;
        } catch {
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          await SecureStore.setItemAsync(key, value);
        } catch {
          // Silent fail for storage write
        }
      },
      removeItem: async (key: string) => {
        try {
          await SecureStore.deleteItemAsync(key);
        } catch {
          // Silent fail for storage delete
        }
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
