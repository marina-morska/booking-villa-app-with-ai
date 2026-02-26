import { supabase } from './supabaseClient.js';

export async function createContactMessage(payload) {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') };
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData?.session?.user?.id ?? null;

    const basePayload = {
      full_name: (payload.fullName || '').trim(),
      email: (payload.email || '').trim(),
      phone: (payload.phone || '').trim() || null,
      subject: (payload.subject || '').trim(),
      message: (payload.message || '').trim()
    };

    let { error } = await supabase.from('contact_messages').insert({
      ...basePayload,
      user_id: currentUserId
    });

    const shouldRetryAsGuest =
      Boolean(error) &&
      currentUserId &&
      /row-level security|violates row-level security policy/i.test(error.message || '');

    if (shouldRetryAsGuest) {
      const retryResult = await supabase.from('contact_messages').insert(basePayload);
      error = retryResult.error;
    }

    return { error: error ?? null };
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Failed to send message') };
  }
}
