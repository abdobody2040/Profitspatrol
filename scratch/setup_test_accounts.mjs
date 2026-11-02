
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTestAccounts() {
    const password = 'Password123!';
    
    // 1. Register/Login Parent
    const parentEmail = 'parent_final@example.com';
    const parentUsername = 'ParentFinal';
    
    let { data: pAuth, error: pAuthError } = await supabase.auth.signUp({
        email: parentEmail,
        password: password,
        options: { data: { username: parentUsername, role: 'PARENT' } }
    });

    if (pAuthError) {
        console.error('Parent Reg Error:', pAuthError.message);
        if (pAuthError.message.includes('already registered')) {
            const { data: pSignIn, error: pSignInError } = await supabase.auth.signInWithPassword({
                email: parentEmail,
                password: password
            });
            pAuth = pSignIn;
            if (pSignInError) console.error('Sign in error:', pSignInError.message);
        }
    }

    const parentId = pAuth?.user?.id;
    if (!parentId) {
        console.error('No parent ID found');
        return;
    }

    // 2. Register/Login Kid
    const kidEmail = 'kid_final@example.com';
    const kidUsername = 'KidFinal';
    
    let { data: kAuth, error: kAuthError } = await supabase.auth.signUp({
        email: kidEmail,
        password: password,
        options: { data: { username: kidUsername, role: 'KID' } }
    });

    if (kAuthError) {
        console.error('Kid Reg Error:', kAuthError.message);
        if (kAuthError.message.includes('already registered')) {
            const { data: kSignIn, error: kSignInError } = await supabase.auth.signInWithPassword({
                email: kidEmail,
                password: password
            });
            kAuth = kSignIn;
            if (kSignInError) console.error('Sign in error:', kSignInError.message);
        }
    }

    const kidId = kAuth?.user?.id;
    if (!kidId) {
        console.error('No kid ID found');
        return;
    }

    // 3. Ensure profiles exist (Try to insert if not found)
    
    const insertProfile = async (id, username, role) => {
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
        const { error } = await supabase.from('profiles').upsert(profileData, { onConflict: 'id' });
        if (error) console.error(`Error upserting profile for ${username}:`, error.message);
    };

    await insertProfile(parentId, parentUsername, 'PARENT');
    await insertProfile(kidId, kidUsername, 'KID');

    // 4. Link them
    const { error: linkError } = await supabase
        .from('profiles')
        .update({ parent_id: parentId })
        .eq('id', kidId);

    if (linkError) console.error('Link error:', linkError.message);

    // 5. Verify
    const { data: verify } = await supabase.from('profiles').select('username, parent_id').in('username', [parentUsername, kidUsername]);
}

setupTestAccounts();
