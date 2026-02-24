import { supabase } from './supabaseClient.js';
import { getAuthState } from './authService.js';

export async function getPublicReviews() {
  if (!supabase) {
    console.warn('Supabase not initialized');
    return [];
  }

  try {
    // Fetch all reviews with all columns
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    console.log('Fetched reviews:', reviews);

    // Then fetch profiles separately
    if (reviews && reviews.length > 0) {
      const userIds = [...new Set(reviews.map(r => r.user_id))];
      console.log('Fetching profiles for user IDs:', userIds);

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds);

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
      }

      const profileMap = {};
      if (profiles) {
        profiles.forEach(p => {
          profileMap[p.id] = p;
        });
      }

      console.log('Profile map:', profileMap);
      console.log('Profile map entries:', Object.entries(profileMap));

      // Merge profiles into reviews
      const merged = reviews.map(review => {
        const profile = profileMap[review.user_id];
        console.log(`Review ${review.id} - user_id: ${review.user_id}, profile found:`, profile);
        
        return {
          ...review,
          profiles: profile || null
        };
      });

      console.log('Final merged reviews:', merged);
      return merged;
    }

    return [];
  } catch (err) {
    console.error('Exception in getPublicReviews:', err);
    return [];
  }
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
