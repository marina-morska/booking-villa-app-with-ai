import { isSupabaseConfigured, supabase } from './supabaseClient.js';

export async function getAuthState() {
  if (!isSupabaseConfigured || !supabase) {
    return { user: null, role: 'guest', configured: false };
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return { user: null, role: 'guest', configured: true };
  }

  const role = await getUserRole(data.user.id);
  return { user: data.user, role, configured: true };
}

export async function signUp(email, password) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase is not configured') };
  }

  return supabase.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase is not configured') };
  }

  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  if (!supabase) {
    return { error: null };
  }

  return supabase.auth.signOut();
}

export async function getUserRole(userId) {
  if (!supabase || !userId) {
    return 'guest';
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data?.role) {
    return 'user';
  }

  return data.role;
}

