import { supabase } from './supabaseClient.js';
import { getAuthState } from './authService.js';

export async function createBookingRequest({ checkIn, checkOut, guests }) {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') };
  }

  const authState = await getAuthState();
  if (!authState.user) {
    return { error: new Error('Please login to create a booking') };
  }

  const { error } = await supabase.from('bookings').insert({
    user_id: authState.user.id,
    check_in: checkIn,
    check_out: checkOut,
    guests,
    status: 'awaiting_confirmation'
  });

  return { error };
}
