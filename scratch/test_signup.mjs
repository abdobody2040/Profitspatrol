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

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

    if (signUpError) {
        console.error('Sign Up Error:', signUpError.message, signUpError);
        return;
    }

}

run();
