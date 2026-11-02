import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

async function run() {
    const parentEmail = 'parent_final@example.com';
    const kidEmail = 'kid_final@example.com';
    const password = 'Password123!';

    const parentUsername = 'ParentFinal';
    const kidUsername = 'KidFinal';

    // 1. Sign in parent
    const parentClient = createClient(supabaseUrl, supabaseKey);
    const { data: pAuth, error: pAuthError } = await parentClient.auth.signInWithPassword({
        email: parentEmail,
        password: password
    });
    if (pAuthError) {
        console.error('Parent Sign In Error:', pAuthError.message);
        return;
    }
    const parentId = pAuth.user.id;

    // 2. Sign in kid
    const kidClient = createClient(supabaseUrl, supabaseKey);
    const { data: kAuth, error: kAuthError } = await kidClient.auth.signInWithPassword({
        email: kidEmail,
        password: password
    });
    if (kAuthError) {
        console.error('Kid Sign In Error:', kAuthError.message);
        return;
    }
    const kidId = kAuth.user.id;

    const upsertProfile = async (client, id, username, role) => {
        const profileData = {
            id,
            username,
            role: role.toLowerCase(),
            pp_tokens: 100,
            xp: 0,
            level: 1,
            inventory: [],
            badges: ['Newbie'],
            settings: { dailyGoalMinutes: 15, soundEnabled: true, musicEnabled: true, themeColor: 'green', themeMode: 'light' }
        };
        const { error } = await client.from('profiles').upsert(profileData, { onConflict: 'id' });
        if (error) {
            console.error(`Error upserting profile for ${username}:`, error.message);
        } else {
            console.log(`Profile upserted for ${username}`);
        }
    };

    await upsertProfile(parentClient, parentId, parentUsername, 'PARENT');

    await upsertProfile(kidClient, kidId, kidUsername, 'KID');

    // Kid updates their own profile to set parent_id
    const { error: linkError } = await kidClient
        .from('profiles')
        .update({ parent_id: parentId })
        .eq('id', kidId);

    if (linkError) console.error('Link error:', linkError.message);

    // Verify profile using Kid client
    const { data: verify } = await kidClient.from('profiles').select('username, parent_id, settings').in('username', [parentUsername, kidUsername]);
}

run();
