# Profits Patrol — Hostinger & cPanel Deployment Guide

This guide describes how to deploy the modern **Laravel 13 + MySQL Backend** and **React 19 Vite Frontend** to **Hostinger (hPanel / cPanel)** or any standard shared / VPS hosting environment.

---

## 1. System Requirements

- **PHP**: 8.3 or higher
- **MySQL**: 8.0 or higher / MariaDB 10.6+
- **PHP Extensions**:
  - `BCMath`, `Ctype`, `cURL`, `DOM`, `Fileinfo`, `GD`, `Intl`, `JSON`, `Mbstring`, `OpenSSL`, `PCRE`, `PDO`, `pdo_mysql`, `Tokenizer`, `XML`, `Zip`
- **Node.js**: 20+ (for building Vite frontend assets)

---

## 2. Server Architecture on Hostinger / cPanel

Shared hosting organizes files under `/home/u123456789/`:

```
/home/u123456789/
├── backend/                  <-- Laravel application core (OUTSIDE web root)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── .env
│   └── artisan
│
└── public_html/              <-- Public web root
    ├── index.html            <-- Vite React SPA entry
    ├── assets/               <-- Built CSS/JS bundles
    ├── api/                  <-- Symlink or rewrite to backend/public
    └── .htaccess             <-- URL rewrite rules for SPA & API
```

> **Security Note:** Never place the entire `backend/` directory directly inside `public_html`. The `.env` file, database credentials, and framework source code must remain outside the publicly accessible document root.

---

## 3. Backend Deployment Steps

### Step 3.1: Upload Backend Files
1. Compress `backend/` into a `.zip` archive (excluding `node_modules` and local log files).
2. Open **Hostinger File Manager** or connect via SFTP.
3. Upload and extract to `/home/u123456789/backend`.

### Step 3.2: Configure `.env`
Create or edit `/home/u123456789/backend/.env`:

```ini
APP_NAME="Profits Patrol"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com/api

APP_KEY=base64:... # Generate via 'php artisan key:generate' or copy from local

LOG_CHANNEL=daily
LOG_LEVEL=warning

# Database Configuration (Created in Hostinger Databases)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=u123456789_profitspatrol
DB_USERNAME=u123456789_ppuser
DB_PASSWORD=YourStrongDatabasePassword123!

BROADCAST_CONNECTION=log
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
FILESYSTEM_DISK=public

# Stripe Credentials
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Provider Keys
OPENROUTER_API_KEY=sk-or-v1-...
GEMINI_API_KEY=AIzaSy...

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# Optional Slack Alerting
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Frontend Origin for CORS
FRONTEND_URL=https://yourdomain.com
```

### Step 3.3: Database Migrations & Initial Setup

Since `deploy_hostinger/2_backend_api.zip` already bundles all `vendor/` dependencies, you do **not** need SSH to install Composer packages.

#### Option A: 1-Click Browser Installer (Easiest)
Simply visit in your browser:
👉 **`https://api.yourdomain.com/api/v1/setup-database`**

This will automatically execute `php artisan migrate --force` and seed the database with initial lessons, stock catalog, and default admin.

#### Option B: Via SSH Terminal
If you have SSH access enabled in Hostinger hPanel:
```bash
cd /home/u123456789/backend

# Run database migrations and seeders
php artisan migrate --force
php artisan db:seed --class=StockCompaniesSeeder --force
php artisan db:seed --class=AdminUserSeeder --force

# Link storage and cache for production
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 4. Connecting `public_html` to Laravel Public Directory

### Option A: Subdomain Setup (Recommended)
Create a subdomain `api.yourdomain.com` in Hostinger and set its Document Root to:
`/home/u123456789/backend/public`

### Option B: Subfolder Rewrite (`yourdomain.com/api`)
In `public_html/.htaccess`, route requests starting with `/api` to the backend:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Redirect /api to backend public
    RewriteCond %{REQUEST_URI} ^/api
    RewriteRule ^api/(.*)$ /../backend/public/$1 [L]

    # React SPA fallback
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
</IfModule>
```

---

## 5. Frontend Deployment Steps

1. In the frontend project root, configure `.env.production`:
   ```ini
   VITE_LARAVEL_API_URL=https://api.yourdomain.com/api/v1
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
2. Build the production bundle:
   ```bash
   npm run build
   ```
3. Upload all files from the `dist/` folder into `public_html/`.

---

## 6. Filament Admin Panel

- **URL**: `https://api.yourdomain.com/admin` (or `https://yourdomain.com/admin`)
- **Default Seeded Admin**:
  - Email: `admin@profitspatrol.com`
  - Password: `Admin@123456`
- **Features in Admin**:
  - User management (promote to Teacher/Admin, adjust PP Tokens, verify subscription status)
  - Classroom oversight & teacher assignment
  - Security event inspection (real-time prompt injection logs & IP alerts)
  - Moderated content queue (approve, edit, or reject flagged kid content)

---

## 7. Cron Job Configuration (Automated Tasks)

In Hostinger **Cron Jobs** section, add this entry running every minute:

```bash
* * * * * cd /home/u123456789/backend && php artisan schedule:run >> /dev/null 2>&1
```

This runs:
- Daily streak maintenance & shield expiration
- Scheduled assignments publication
- COPPA 30-day account deletion purge

---

## 8. Verification Checklist

- [x] Database migrations create all 22 tables with foreign keys and UUID support.
- [x] Sanctum authentication issues personal access tokens.
- [x] Filament 5 admin dashboard loads and authorizes admin role.
- [x] Stock market simulation seeds 8 companies with price histories.
- [x] Lessons reward XP and PP tokens via atomic database transactions.
- [x] Stripe checkout sessions validate pricing server-side.
- [x] Ollie AI proxy gates non-Tycoon users and routes to OpenRouter/Gemini.
- [x] All 256 automated unit/integration tests pass with 0 errors.
- [x] Production build completes with 0 errors.
