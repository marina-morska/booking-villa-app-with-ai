import { supabase } from './supabaseClient.js';

export async function getMyBookings() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('id, check_in, check_out, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getMyReviews() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, title, content, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getMyMessages() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, subject, message, admin_reply, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}
