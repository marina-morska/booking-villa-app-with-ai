import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://xegrbbfeiudzeubdbcsb.supabase.co';
const fallbackSupabasePublishableKey = 'sb_publishable_q0GYXNSWBSLVLY0BNukoGg_BbTca4ZR';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackSupabaseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackSupabasePublishableKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
