import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase integration
// Next.js standard: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
// Vite standard: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://demo-cpr-academy.supabase.co';

const supabaseAnonKey =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  'public-anon-key-placeholder';

export const isSupabaseConfigured =
  supabaseUrl !== 'https://demo-cpr-academy.supabase.co' &&
  supabaseAnonKey !== 'public-anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
