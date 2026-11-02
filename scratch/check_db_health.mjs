import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
if (!process.env.VITE_SUPABASE_URL) {
  dotenv.config({ path: '.env' });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('='.repeat(60));
console.log('🔍 PROFITSPATROL DATABASE HEALTH & INTEGRITY SCAN');
console.log('='.repeat(60));
console.log(`URL: ${supabaseUrl}`);
console.log(`Anon Key configured: ${!!anonKey}`);
console.log(`Service Role Key configured: ${!!serviceKey}\n`);

if (!supabaseUrl || !anonKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

const anonClient = createClient(supabaseUrl, anonKey);
const adminClient = serviceKey ? createClient(supabaseUrl, serviceKey) : anonClient;

const TABLES = [
  'profiles',
  'classrooms',
  'classroom_members',
  'assignments',
  'submissions',
  'games',
  'books',
  'cms_content',
  'stock_portfolio',
  'corporation_members',
  'security_audit_logs'
];

async function scanTables() {
  console.log('--- 1. TABLE EXISTENCE & RECORD COUNTS (ADMIN CLIENT) ---');
  for (const table of TABLES) {
    try {
      const { count, error } = await adminClient
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ Table [${table}]: ERROR - ${error.message} (${error.code || 'no-code'})`);
      } else {
        console.log(`✅ Table [${table}]: OK (${count ?? 0} records)`);
      }
    } catch (e) {
      console.log(`❌ Table [${table}]: EXCEPTION - ${e.message}`);
    }
  }
}

async function testAuthAndRLS() {
  console.log('\n--- 2. AUTHENTICATION & PROFILES TEST ---');
  const testUsers = [
    { email: 'kid_test@profits.com', pass: 'TestPass123!', expectedRole: 'kid' },
    { email: 'parent_test@profits.com', pass: 'TestPass123!', expectedRole: 'parent' },
    { email: 'teacher_test@profits.com', pass: 'TestPass123!', expectedRole: 'teacher' },
    { email: 'admin_test@profits.com', pass: 'TestPass123!', expectedRole: 'admin' },
  ];

  for (const tu of testUsers) {
    try {
      const { data, error } = await anonClient.auth.signInWithPassword({
        email: tu.email,
        password: tu.pass
      });

      if (error) {
        console.log(`⚠️ User login [${tu.email}]: ${error.message}`);
      } else {
        const userId = data.user.id;
        const userClient = createClient(supabaseUrl, anonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`
            }
          }
        });

        // Test reading their own profile with RLS
        const { data: profile, error: pErr } = await userClient
          .from('profiles')
          .select('id, username, role, xp, pp_tokens, level, subscription_tier')
          .eq('id', userId)
          .single();

        if (pErr) {
          console.log(`❌ User profile [${tu.email}]: RLS Read Failed - ${pErr.message}`);
        } else {
          console.log(`✅ User login & profile [${tu.email}]: OK -> username="${profile.username}", role="${profile.role}", XP=${profile.xp}, Tier="${profile.subscription_tier}"`);
        }
      }
    } catch (e) {
      console.log(`❌ User test [${tu.email}]: EXCEPTION - ${e.message}`);
    }
  }
}

async function testProfilesSchema() {
  console.log('\n--- 3. PROFILES TABLE COLUMN INTEGRITY ---');
  const { data: sample, error } = await adminClient
    .from('profiles')
    .select('*')
    .limit(1);

  if (error || !sample || sample.length === 0) {
    console.log('⚠️ Could not fetch sample profile row to verify columns:', error?.message);
    return;
  }

  const row = sample[0];
  const expectedCols = [
    'id', 'username', 'role', 'xp', 'level', 'pp_tokens',
    'subscription_tier', 'subscription_status', 'billing_cycle',
    'energy', 'streak', 'hq_level'
  ];

  const present = [];
  const missing = [];
  for (const col of expectedCols) {
    if (col in row) {
      present.push(col);
    } else {
      missing.push(col);
    }
  }

  console.log(`✅ Columns Verified (${present.length}/${expectedCols.length}):`, present.join(', '));
  if (missing.length > 0) {
    console.log(`⚠️ Missing / Unmigrated Columns:`, missing.join(', '));
  }
}

async function run() {
  await scanTables();
  await testProfilesSchema();
  await testAuthAndRLS();
  console.log('\n' + '='.repeat(60));
  console.log('🏁 SCAN FINISHED');
  console.log('='.repeat(60));
}

run();
