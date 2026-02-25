import { supabase } from './supabaseClient.js';

const GALLERY_BUCKET = 'villa-photos';
const GALLERY_CACHE_TTL_MS = 5 * 60 * 1000;
let galleryPhotosCache = {
  expiresAt: 0,
  data: []
};

export async function getAllBookings() {
  if (!supabase) {
    return { data: [], error: new Error('Supabase is not configured') };
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, user_id, check_in, check_out, guests, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: [], error };
  }

  const userIds = [...new Set((bookings ?? []).map((booking) => booking.user_id).filter(Boolean))];
  if (!userIds.length) {
    return { data: bookings ?? [], error: null };
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', userIds);

  if (profilesError) {
    return { data: bookings ?? [], error: null };
  }

  const displayNameByUserId = new Map((profiles ?? []).map((profile) => [profile.id, profile.display_name]));
  const enrichedBookings = (bookings ?? []).map((booking) => ({
    ...booking,
    guest_name: displayNameByUserId.get(booking.user_id) || null
  }));

  return { data: enrichedBookings, error: null };
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
      subject: recipient.subject || 'Your message to Villa Blue Summer',
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

  const fileName = sanitizeStorageFileName(file.name);

  const { error: uploadError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(fileName, file, { upsert: true });

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

export async function getPublicGalleryPhotos(forceRefresh = false) {
  if (!supabase) {
    return { data: [], error: new Error('Supabase is not configured') };
  }

  const now = Date.now();
  if (!forceRefresh && galleryPhotosCache.expiresAt > now && galleryPhotosCache.data.length) {
    return { data: galleryPhotosCache.data, error: null };
  }

  const { data: photosTableRows } = await supabase
    .from('photos')
    .select('title, storage_path, created_at')
    .order('created_at', { ascending: false });

  const titleByPath = new Map((photosTableRows ?? [])
    .filter((row) => row?.storage_path)
    .map((row) => [row.storage_path, row.title || '']));

  const { data: storageObjects, error: storageError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .list('', { limit: 500, offset: 0, sortBy: { column: 'name', order: 'asc' } });

  const photosFromStorageList = (storageObjects ?? [])
    .filter((object) => object.name && !object.name.endsWith('/'))
    .map((object) => {
      const thumbnailUrl = buildPublicUrl(object.name, {
        width: 900,
        quality: 70,
        resize: 'contain'
      });
      const lightboxUrl = buildPublicUrl(object.name, {
        width: 2200,
        quality: 82,
        resize: 'contain'
      });

      return {
        id: `storage-${object.id || object.name}`,
        title: titleByPath.get(object.name) || formatTitleFromPath(object.name),
        src: thumbnailUrl,
        lightboxSrc: lightboxUrl,
        storagePath: object.name
      };
    })
    .filter((photo) => photo.src)
    .sort((left, right) => compareByGalleryIndex(left.storagePath, right.storagePath));

  const photosFromTable = (photosTableRows ?? [])
    .filter((row) => row?.storage_path)
    .map((row) => {
      const thumbnailUrl = buildPublicUrl(row.storage_path, {
        width: 900,
        quality: 70,
        resize: 'contain'
      });
      const lightboxUrl = buildPublicUrl(row.storage_path, {
        width: 2200,
        quality: 82,
        resize: 'contain'
      });

      return {
        id: `table-${row.storage_path}`,
        title: row.title || formatTitleFromPath(row.storage_path),
        src: thumbnailUrl,
        lightboxSrc: lightboxUrl,
        storagePath: row.storage_path,
        createdAt: row.created_at || null
      };
    })
    .filter((photo) => photo.src)
    .sort((left, right) => compareByGalleryIndex(left.storagePath, right.storagePath));

  const photos = photosFromStorageList.length ? photosFromStorageList : photosFromTable;

  if (!photos.length && storageError) {
    return { data: [], error: storageError };
  }

  galleryPhotosCache = {
    data: photos,
    expiresAt: now + GALLERY_CACHE_TTL_MS
  };

  return { data: photos, error: null };
}

function formatTitleFromPath(path = '') {
  const name = path.split('/').pop() || path;
  const nameWithoutExt = name.replace(/\.[^/.]+$/, '');
  const cleaned = nameWithoutExt
    .replace(/^[0-9]+[_-]?/, '')
    .replace(/[._-]+/g, ' ')
    .trim();

  return cleaned
    ? cleaned.replace(/\b\w/g, (character) => character.toUpperCase())
    : 'Villa Photo';
}

function sanitizeStorageFileName(fileName = '') {
  const normalized = String(fileName)
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (!normalized) {
    return `${Date.now()}_photo.jpg`;
  }

  return normalized;
}

function compareByGalleryIndex(leftPath = '', rightPath = '') {
  const leftIndex = extractLeadingNumber(leftPath);
  const rightIndex = extractLeadingNumber(rightPath);

  if (leftIndex !== rightIndex) {
    return leftIndex - rightIndex;
  }

  return String(leftPath).localeCompare(String(rightPath), undefined, {
    numeric: true,
    sensitivity: 'base'
  });
}

function extractLeadingNumber(filePath = '') {
  const fileName = String(filePath).split('/').pop() || '';
  const match = fileName.match(/^(\d+)/);
  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Number(match[1]);
}

function buildPublicUrl(storagePath, transform) {
  const { data: publicUrlData } = supabase.storage
    .from(GALLERY_BUCKET)
    .getPublicUrl(storagePath, { transform });

  return publicUrlData?.publicUrl || '';
}
