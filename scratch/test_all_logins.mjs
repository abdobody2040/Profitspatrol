import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const users = [
    { email: 'kid_test@profits.com', password: 'TestPass123!' },
    { email: 'parent_test@profits.com', password: 'TestPass123!' },
    { email: 'teacher_test@profits.com', password: 'TestPass123!' },
    { email: 'admin_test@profits.com', password: 'TestPass123!' },
    { email: 'test_kid2@example.com', password: 'Password123!' },
    { email: 'test_kid1@example.com', password: 'Password123!' }
];

async function run() {
    const supabase = createClient(supabaseUrl, supabaseKey);

    for (const u of users) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: u.email,
            password: u.password
        });

        if (error) {
            console.error(`  Error for ${u.email}:`, error.message);
        } else {
            // Check if profile exists
            const { data: profile, error: pError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
            if (pError) {
                console.error(`  Profile error for ${u.email}:`, pError.message);
            } else {
                console.log(`  Profile found for ${u.email}:`, profile.username, profile.role);
            }
        }
    }
}

run();
