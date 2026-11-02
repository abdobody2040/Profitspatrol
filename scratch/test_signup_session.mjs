import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

async function run() {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const email = `test_${Math.floor(Math.random() * 1000000)}@example.com`;
    const username = `test_${Math.floor(Math.random() * 1000000)}`;
    const password = 'Password123!';

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username,
                role: 'kid',
                full_name: 'Test Kid'
            }
        }
    });

    if (error) {
        console.error('Sign Up Error:', error.message);
        return;
    }

    if (data.session) {
        console.log('Access token:', data.session.access_token ? 'yes' : 'no');
    }

    // Attempt to select from profiles table using the same client (which should have the session)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (profileError) {
        console.error('Profile Error:', profileError.message);
    } else {
        console.log('Profile Data exists and fetched successfully:', !!profile);
        console.log('Profile:', JSON.stringify(profile, null, 2));
    }
}

run();
