
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ✅ SECURITY: supabaseAdmin (service_role key) is intentionally NOT available on the client.
// Admin operations must go through server-side Supabase RPC functions (SECURITY DEFINER).
// The service_role key lives exclusively in Edge Function environment variables.

// Helper to check if Supabase is connected
export const isSupabaseConfigured = () => !!supabase;
