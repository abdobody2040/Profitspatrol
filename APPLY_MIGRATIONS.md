# Quick Migration Instructions

## Supabase CLI Not Installed

The Supabase CLI is not installed on your system. You have two options:

### Option 1: Install Supabase CLI
```bash
npm install -g supabase
```

Then run:
```bash
supabase db push
```

### Option 2: Apply Manually via Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor"
4. Run the SQL from these files:
   - `supabase/migrations/20260128_parental_gate.sql`
   - `supabase/migrations/20260128_account_deletion.sql`

See MIGRATION_GUIDE.md for detailed instructions.
