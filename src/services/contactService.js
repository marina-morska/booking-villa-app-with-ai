import { supabase } from './supabaseClient.js';
import { getAuthState } from './authService.js';

export async function createContactMessage(payload) {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') };
  }

  const authState = await getAuthState();
  const { error } = await supabase.from('contact_messages').insert({
    user_id: authState.user?.id ?? null,
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone || null,
    subject: payload.subject,
    message: payload.message
  });

  return { error };
}
