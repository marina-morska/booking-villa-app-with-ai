import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const envFromFile = loadEnvFromDotEnv();
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || envFromFile.SUPABASE_URL || envFromFile.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envFromFile.SUPABASE_SERVICE_ROLE_KEY;

validateRequiredEnv();

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const SAMPLE_USERS = [
  { email: 'stefie@gmail.com', password: 'pass123', displayName: 'Stefie' },
  { email: 'teo@gmail.com', password: 'pass123', displayName: 'Teo' },
  { email: 'petkata@gmail.com', password: 'pass123', displayName: 'Petkata' }
];

async function run() {
  const users = [];

  for (const sampleUser of SAMPLE_USERS) {
    const authUser = await upsertAuthUser(sampleUser);
    users.push({ ...sampleUser, id: authUser.id });
    console.log(`✓ Auth user ready: ${sampleUser.email}`);
  }

  await upsertProfilesAndRoles(users);
  await reseedUserContent(users);

  console.log('Done. Sample users and demo data are seeded successfully.');
}

async function upsertAuthUser({ email, password, displayName }) {
  const existingUser = await findAuthUserByEmail(email);

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: {
        display_name: displayName,
        full_name: displayName,
        seeded: true
      }
    });

    if (error) {
      throw new Error(`Failed to update existing auth user ${email}: ${error.message}`);
    }

    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
      full_name: displayName,
      seeded: true
    }
  });

  if (error) {
    throw new Error(`Failed to create auth user ${email}: ${error.message}`);
  }

  return data.user;
}

async function findAuthUserByEmail(email) {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(`Failed to list auth users: ${error.message}`);
    }

    const foundUser = data.users.find((user) => String(user.email || '').toLowerCase() === email.toLowerCase());
    if (foundUser) {
      return foundUser;
    }

    if (!data.users.length || data.users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

async function upsertProfilesAndRoles(users) {
  const profilesPayload = users.map((user) => ({
    id: user.id,
    display_name: user.displayName
  }));

  const { error: profilesError } = await supabase
    .from('profiles')
    .upsert(profilesPayload, { onConflict: 'id' });

  if (profilesError) {
    throw new Error(`Failed to upsert profiles: ${profilesError.message}`);
  }

  const rolesPayload = users.map((user) => ({
    user_id: user.id,
    role: 'user'
  }));

  const { error: rolesError } = await supabase
    .from('user_roles')
    .upsert(rolesPayload, { onConflict: 'user_id' });

  if (rolesError) {
    throw new Error(`Failed to upsert user roles: ${rolesError.message}`);
  }
}

async function reseedUserContent(users) {
  const userIds = users.map((user) => user.id);

  const [{ error: deleteBookingsError }, { error: deleteReviewsError }, { error: deleteMessagesError }] = await Promise.all([
    supabase.from('bookings').delete().in('user_id', userIds),
    supabase.from('reviews').delete().in('user_id', userIds),
    supabase.from('contact_messages').delete().in('user_id', userIds)
  ]);

  if (deleteBookingsError) {
    throw new Error(`Failed to clear old bookings: ${deleteBookingsError.message}`);
  }
  if (deleteReviewsError) {
    throw new Error(`Failed to clear old reviews: ${deleteReviewsError.message}`);
  }
  if (deleteMessagesError) {
    throw new Error(`Failed to clear old contact messages: ${deleteMessagesError.message}`);
  }

  const today = new Date();
  const addDays = (offset) => {
    const value = new Date(today);
    value.setDate(value.getDate() + offset);
    return value.toISOString().slice(0, 10);
  };

  const bookingsPayload = [
    {
      user_id: users[0].id,
      check_in: addDays(14),
      check_out: addDays(18),
      guests: 2,
      status: 'confirmed',
      admin_note: 'Seeded booking'
    },
    {
      user_id: users[1].id,
      check_in: addDays(22),
      check_out: addDays(27),
      guests: 3,
      status: 'awaiting_confirmation',
      admin_note: 'Seeded booking'
    },
    {
      user_id: users[2].id,
      check_in: addDays(30),
      check_out: addDays(34),
      guests: 4,
      status: 'confirmed',
      admin_note: 'Seeded booking'
    }
  ];

  const { error: bookingsError } = await supabase.from('bookings').insert(bookingsPayload);
  if (bookingsError) {
    throw new Error(`Failed to insert sample bookings: ${bookingsError.message}`);
  }

  const reviewsPayload = [
    {
      user_id: users[0].id,
      rating: 5,
      title: 'Amazing stay',
      content: 'Everything was perfect, clean and comfortable.'
    },
    {
      user_id: users[1].id,
      rating: 4,
      title: 'Very good',
      content: 'Great location and amenities. We enjoyed our stay.'
    },
    {
      user_id: users[2].id,
      rating: 5,
      title: 'Highly recommended',
      content: 'Excellent villa and very responsive host.'
    }
  ];

  const { error: reviewsError } = await supabase.from('reviews').insert(reviewsPayload);
  if (reviewsError) {
    throw new Error(`Failed to insert sample reviews: ${reviewsError.message}`);
  }

  const messagesPayload = users.map((user) => ({
    user_id: user.id,
    full_name: user.displayName,
    email: user.email,
    phone: null,
    subject: 'booking',
    message: `Hello, this is a sample seeded message from ${user.displayName}.`,
    admin_reply: null
  }));

  const { error: messagesError } = await supabase.from('contact_messages').insert(messagesPayload);
  if (messagesError) {
    throw new Error(`Failed to insert sample contact messages: ${messagesError.message}`);
  }
}

run().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});

function validateRequiredEnv() {
  const missing = [];

  if (!SUPABASE_URL) {
    missing.push('SUPABASE_URL (or VITE_SUPABASE_URL)');
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY');
  }

  if (!missing.length) {
    return;
  }

  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  console.error('Set them in terminal or .env, then run: npm run seed:sample');
  process.exit(1);
}

function loadEnvFromDotEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const content = fs.readFileSync(envPath, 'utf8');
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .reduce((accumulator, line) => {
      const separatorIndex = line.indexOf('=');
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      accumulator[key] = value;
      return accumulator;
    }, {});
}
