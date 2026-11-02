import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

async function run() {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const passwords = ['Password123!', 'TestPass123!', 'Test123456!', 'password123'];
    const email = 'admobabdo@gmail.com';

    for (const pwd of passwords) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: pwd
        });
        if (!error) {
            return;
        } else {
            console.error(`Failed: ${error.message}`);
        }
    }
}

run();
