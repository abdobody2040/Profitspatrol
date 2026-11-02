
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function linkAccounts() {
    const { data: parent, error: pError } = await supabase
        .from('profiles')
        .select('id, invite_code')
        .eq('username', 'ParentFinal')
        .single();

    if (pError || !parent) {
        console.error('Parent not found', pError);
        return;
    }

    const { data: kid, error: kError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', 'KidFinal')
        .single();

    if (kError || !kid) {
        console.error('Kid not found', kError);
        return;
    }

    const { error: uError } = await supabase
        .from('profiles')
        .update({ parent_id: parent.id })
        .eq('id', kid.id);

    if (uError) {
        console.error('Failed to link', uError);
    } else {
        console.log('SUCCESS: Accounts linked!');
    }
}

linkAccounts();
