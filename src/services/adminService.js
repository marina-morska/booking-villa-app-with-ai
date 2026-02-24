import { supabase } from './supabaseClient.js';

const GALLERY_BUCKET = 'villa-photos';

export async function getAllBookings() {
  if (!supabase) {
    return { data: [], error: new Error('Supabase is not configured') };
  }

  return supabase
    .from('bookings')
    .select('id, user_id, check_in, check_out, guests, status, created_at')
    .order('created_at', { ascending: false });
}

export async function updateBookingStatus(bookingId, status, adminNote = null) {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') };
  }

  return supabase
    .from('bookings')
    .update({ status, admin_note: adminNote, updated_at: new Date().toISOString() })
    .eq('id', bookingId);
}

export async function deleteBooking(bookingId) {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') };
  }

  return supabase.from('bookings').delete().eq('id', bookingId);
}

export async function getAllMessages() {
  if (!supabase) {
    return { data: [], error: new Error('Supabase is not configured') };
  }

  return supabase
    .from('contact_messages')
    .select('id, full_name, email, subject, message, admin_reply, replied_at, created_at')
    .order('created_at', { ascending: false });
}

export async function replyToMessage(messageId, adminReply, recipient = null) {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') };
  }

  const { error } = await supabase
    .from('contact_messages')
    .update({ admin_reply: adminReply, replied_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', messageId);

  if (error) {
    return { error };
  }

  if (!recipient?.email) {
    return { error: null, emailError: null };
  }

  const { error: functionError } = await supabase.functions.invoke('send-admin-reply-email', {
    body: {
      toEmail: recipient.email,
      guestName: recipient.fullName || 'Guest',
      subject: recipient.subject || 'Your message to Villa Paradise',
      adminReply
    }
  });

  return { error: null, emailError: functionError ?? null };
}

export async function getAllPhotos() {
  if (!supabase) {
    return { data: [], error: new Error('Supabase is not configured') };
  }

  return supabase
    .from('photos')
    .select('id, title, storage_path, created_at')
    .order('created_at', { ascending: false });
}

export async function uploadPhoto(file, title = '') {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(fileName, file, { upsert: false });

  if (uploadError) {
    return { error: uploadError };
  }

  const { error: insertError } = await supabase.from('photos').insert({
    title,
    storage_path: fileName
  });

  if (insertError) {
    return { error: insertError };
  }

  return { error: null };
}

export async function deletePhoto(photoId, storagePath) {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') };
  }

  const { error: storageError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .remove([storagePath]);

  if (storageError) {
    return { error: storageError };
  }

  const { error: deleteError } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId);

  return { error: deleteError };
}
