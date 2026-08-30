import { Database } from './supabase';

export type UserRole = Database['public']['Tables']['profiles']['Row']['role'];

export interface AppSession {
  userId: string;
  role: UserRole;
  displayName: string;
}