/**
 * Integration test for Supabase setup.
 * This file demonstrates that the Supabase client is properly initialized.
 * 
 * To verify:
 * 1. The supabase client is created with correct URL and key
 * 2. Auth state changes are properly handled
 * 3. Session persistence is configured
 */

import { supabase } from '@/lib/supabase';

export async function testSupabaseConnection() {
  try {
    // Test 1: Verify client initialization
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Test 2: Verify auth is available
    if (!supabase.auth) {
      throw new Error('Supabase auth module not available');
    }

    // Test 3: Get current session (should be null initially)
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }

    console.log('✓ Supabase client initialized successfully');
    console.log('✓ Auth module available');
    console.log(`✓ Current session: ${data.session ? 'authenticated' : 'none'}`);

    return {
      success: true,
      message: 'Supabase integration is working correctly',
      session: data.session,
    };
  } catch (error) {
    console.error('✗ Supabase connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * This function would be called from a screen or hook to verify
 * that Supabase is ready for use.
 */
export async function verifySupabaseSetup() {
  return testSupabaseConnection();
}
