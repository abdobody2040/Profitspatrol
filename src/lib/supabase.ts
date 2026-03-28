
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Admin client — only created if the service role key is provided.
// WARNING: Never expose this key to end users. It bypasses Row Level Security.
// It is only used server-side equivalent operations within the admin console.
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    })
    : null;

// Helper to check if Supabase is connected
export const isSupabaseConfigured = () => !!supabase;
export const isAdminClientConfigured = () => !!supabaseAdmin;
