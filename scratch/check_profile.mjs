import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

async function run() {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'kid_test@profits.com',
        password: 'TestPass123!'
    });

    if (authError) {
        console.error('Auth Error:', authError.message);
        return;
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

    if (profileError) {
        console.error('Profile Error:', profileError.message);
        return;
    }

}

run();
