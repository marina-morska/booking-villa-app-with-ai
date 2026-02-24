import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.SUPABASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.SUPABASE_ADMIN_PASSWORD;
const BUCKET = process.env.SUPABASE_GALLERY_BUCKET || 'villa-photos';
const IMAGES_DIR = path.resolve(process.cwd(), 'images');
const CLEAN_BUCKET_FIRST = String(process.env.CLEAN_GALLERY_BUCKET || '').toLowerCase() === 'true';

if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL (or VITE_SUPABASE_URL) environment variable.');
}

const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
if (!supabaseKey) {
  throw new Error('Missing key. Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY).');
}

const supabase = createClient(SUPABASE_URL, supabaseKey, {
  auth: { persistSession: false }
});

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif'
};

async function run() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('When SUPABASE_SERVICE_ROLE_KEY is missing, set SUPABASE_ADMIN_EMAIL and SUPABASE_ADMIN_PASSWORD for admin login.');
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    if (signInError) {
      throw new Error(`Admin sign-in failed: ${signInError.message}`);
    }
  }

  const allEntries = await fs.readdir(IMAGES_DIR, { withFileTypes: true });
  const files = allEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => MIME_BY_EXT[path.extname(name).toLowerCase()])
    .sort((left, right) => compareByGalleryIndex(left, right));

  if (!files.length) {
    console.log('No supported image files found in images/');
    return;
  }

  if (CLEAN_BUCKET_FIRST) {
    await clearBucketObjects();
  }

  console.log(`Found ${files.length} image(s). Uploading to bucket "${BUCKET}" in gallery index order...`);

  let uploadedCount = 0;
  for (let index = 0; index < files.length; index += 1) {
    const fileName = files[index];
    const galleryIndex = index + 1;
    const filePath = path.join(IMAGES_DIR, fileName);
    const fileBuffer = await fs.readFile(filePath);
    const extension = path.extname(fileName).toLowerCase();
    const contentType = MIME_BY_EXT[extension] || 'application/octet-stream';

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error(`✗ [${galleryIndex}] Upload failed for ${fileName}: ${uploadError.message}`);
      continue;
    }

    const title = formatTitle(fileName);
    const { error: upsertError } = await supabase
      .from('photos')
      .upsert(
        { title, storage_path: fileName },
        { onConflict: 'storage_path', ignoreDuplicates: false }
      );

    if (upsertError) {
      console.error(`✗ [${galleryIndex}] Metadata upsert failed for ${fileName}: ${upsertError.message}`);
      continue;
    }

    uploadedCount += 1;
    console.log(`✓ [${galleryIndex}] Uploaded ${fileName}`);
  }

  console.log(`Done. ${uploadedCount}/${files.length} image(s) uploaded and synced.`);

  const { error: cleanupError } = await supabase
    .from('photos')
    .delete()
    .not('storage_path', 'in', `(${files.map((name) => `"${name}"`).join(',')})`);

  if (cleanupError) {
    console.error(`! Could not remove stale photo metadata: ${cleanupError.message}`);
  }
}

function formatTitle(fileName) {
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  const cleaned = withoutExt
    .replace(/^[0-9]+[_-]?/, '')
    .replace(/[._-]+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'Villa Photo';
  }

  return cleaned.replace(/\b\w/g, (character) => character.toUpperCase());
}

run().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});

function compareByGalleryIndex(left, right) {
  const leftIndex = extractLeadingNumber(left);
  const rightIndex = extractLeadingNumber(right);

  if (leftIndex !== rightIndex) {
    return leftIndex - rightIndex;
  }

  return left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
}

function extractLeadingNumber(fileName) {
  const match = String(fileName).match(/^(\d+)/);
  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Number(match[1]);
}

async function clearBucketObjects() {
  console.log(`Cleaning bucket "${BUCKET}" before upload...`);

  while (true) {
    const { data: objects, error: listError } = await supabase.storage
      .from(BUCKET)
      .list('', { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } });

    if (listError) {
      throw new Error(`Failed to list bucket objects: ${listError.message}`);
    }

    const names = (objects ?? [])
      .map((item) => item.name)
      .filter((name) => name && !name.endsWith('/'));

    if (!names.length) {
      break;
    }

    const { error: removeError } = await supabase.storage
      .from(BUCKET)
      .remove(names);

    if (removeError) {
      throw new Error(`Failed to clean bucket objects: ${removeError.message}`);
    }
  }
}
