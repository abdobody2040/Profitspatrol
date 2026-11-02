
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listProfiles() {
    const { data, error } = await supabase
        .from('profiles')
        .select('username, role, id');

    if (error) {
        console.error(error);
        return;
    }

}

listProfiles();
