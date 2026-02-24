import { supabase } from './supabaseClient.js';
import { getAuthState } from './authService.js';

export async function getPublicReviews() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.rpc('get_public_reviews', {
    limit_count: 200
  });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function createReview({ title, content, rating }) {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') };
  }

  const authState = await getAuthState();
  if (!authState.user) {
    return { error: new Error('Please login to create a review') };
  }

  const { error } = await supabase.from('reviews').insert({
    user_id: authState.user.id,
    title,
    content,
    rating
  });

  return { error };
}

export async function updateReview(id, { title, content, rating }) {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') };
  }

  const { error } = await supabase
    .from('reviews')
    .update({ title, content, rating })
    .eq('id', id);

  return { error };
}

export async function deleteReview(id) {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') };
  }

  const { error } = await supabase.from('reviews').delete().eq('id', id);
  return { error };
}
