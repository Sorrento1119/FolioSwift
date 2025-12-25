import { createClient } from '@supabase/supabase-js';

// Accessing Vite environment variables safely
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials missing! Check your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);