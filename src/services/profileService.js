import { supabase } from './supabaseClient.js';

function ensureUserId(userId) {
  if (!userId) {
    return null;
  }

  return userId;
}

export async function getMyBookings(userId) {
  const currentUserId = ensureUserId(userId);
  if (!supabase || !currentUserId) {
    return [];
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('id, check_in, check_out, status, created_at')
    .eq('user_id', currentUserId)
    .limit(5)
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getMyReviews(userId) {
  const currentUserId = ensureUserId(userId);
  if (!supabase || !currentUserId) {
    return [];
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, title, content, created_at')
    .eq('user_id', currentUserId)
    .limit(5)
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getMyMessages(userId) {
  const currentUserId = ensureUserId(userId);
  if (!supabase || !currentUserId) {
    return [];
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, subject, message, admin_reply, created_at')
    .eq('user_id', currentUserId)
    .limit(5)
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}
