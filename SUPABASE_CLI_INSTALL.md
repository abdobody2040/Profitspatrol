# Supabase CLI Installation Guide for Windows

## ❌ Issue
`npm install -g supabase` is not supported.

---

## ✅ Recommended Installation Methods for Windows

### Option 1: Scoop (Recommended for Windows)

**Step 1: Install Scoop (if not already installed)**
```powershell
# Run in PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

**Step 2: Install Supabase CLI**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Step 3: Verify Installation**
```powershell
supabase --version
```

---

### Option 2: Direct Binary Download

**Step 1: Download**
1. Go to https://github.com/supabase/cli/releases
2. Download the latest Windows binary (e.g., `supabase_windows_amd64.zip`)
3. Extract the ZIP file

**Step 2: Add to PATH**
1. Move `supabase.exe` to a permanent location (e.g., `C:\Program Files\Supabase\`)
2. Add that folder to your system PATH:
   - Search "Environment Variables" in Windows
   - Edit "Path" under System Variables
   - Add the folder path
   - Click OK

**Step 3: Verify**
```powershell
supabase --version
```

---

### Option 3: Use npx (No Installation Required)

You can run Supabase CLI commands without installing using `npx`:

```bash
npx supabase@latest db push
```

**Note:** This downloads the CLI temporarily each time, so it's slower.

---

## 🚀 After Installation

Once installed, run these commands:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

---

## 🔧 Alternative: Manual Migration (No CLI Required)

If you prefer not to install the CLI, you can apply migrations manually via Supabase Dashboard:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor"
4. Copy SQL from `supabase/migrations/20260128_parental_gate.sql`
5. Paste and click "Run"
6. Repeat for `supabase/migrations/20260128_account_deletion.sql`

See `MIGRATION_GUIDE.md` for detailed SQL.

---

## 📋 Which Option Should You Choose?

- **Fastest:** Option 3 (npx) - No installation, works immediately
- **Best for long-term:** Option 1 (Scoop) - Easy updates, proper installation
- **No CLI needed:** Manual migration via Dashboard - Simple, no tools required

**Recommendation:** Use **npx** for now, then install via Scoop later if you need the CLI frequently.
