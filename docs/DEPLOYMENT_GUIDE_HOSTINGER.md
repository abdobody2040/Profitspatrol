# Profits Patrol — Hostinger Deployment Guide (hPanel)

This guide covers how to deploy and run **Profits Patrol** (React 19 Frontend + Laravel 11 REST API + MySQL Database) on **Hostinger Web or Cloud Hosting via hPanel** without requiring complex command-line operations.

---

## 📦 Ready-to-Upload Deployment Packages

Pre-built and packaged archives are generated in the `deploy_hostinger/` folder:

1. **`1_frontend_public_html.zip`**: Complete React single-page application (SPA), pre-compressed assets (Brotli & Gzip), fonts, icons, characters, and `.htaccess` rewrite configuration.
2. **`2_backend_api.zip`**: Complete Laravel 11 API engine including pre-installed `vendor/` dependencies, database migrations, seeders, and the automated setup route.

To regenerate these files at any time:
```powershell
npm run build
powershell -ExecutionPolicy Bypass -File scripts/package-hostinger.ps1
```

---

## 🚀 4-Step Deployment Walkthrough

### Step 1: Upload the Frontend (Web App)
1. Log in to your Hostinger **hPanel**.
2. Navigate to **Websites** ➔ **Manage** ➔ **File Manager**.
3. Open the **`public_html`** folder.
   *(Note: If `public_html` has old default placeholder files, delete them for a clean install).*
4. Click **Upload** and upload:
   ```text
   deploy_hostinger/1_frontend_public_html.zip
   ```
5. Right-click the uploaded `.zip` file and select **Extract** (extract directly into `public_html`).
6. Delete the `.zip` archive to save disk space.

> ✅ **Result**: Your frontend is immediately accessible at `https://profitspatrol.com`.

---

### Step 2: Upload the Backend (Laravel API)
1. In File Manager, navigate one level up (outside the `public_html` folder).
2. Click **New Folder** and name it:
   ```text
   api_backend
   ```
3. Open `api_backend/` and upload:
   ```text
   deploy_hostinger/2_backend_api.zip
   ```
4. Right-click the `.zip` file, select **Extract**, and delete the `.zip` archive.

#### Configure Subdomain in hPanel:
1. In hPanel, go to **Domains** ➔ **Subdomains**.
2. Enter Subdomain name: `api`
3. Check the box **Custom folder for subdomain**.
4. In the folder path field, enter:
   ```text
   api_backend/public
   ```
5. Click **Create**.

> ✅ **Result**: Your API backend will now resolve securely at `https://api.profitspatrol.com`.

---

### Step 3: MySQL Database Setup & Configuration
1. In hPanel, go to **Databases** ➔ **MySQL Databases**.
2. Create a new MySQL database:
   - Database name (e.g., `u123456789_profitspatrol`)
   - Database username (e.g., `u123456789_ppuser`)
   - Strong database password
3. Return to File Manager ➔ Open `api_backend/`.
4. Open the `.env` file (enable *Show Hidden Files* in File Manager settings if hidden):
   ```env
   APP_NAME=ProfitsPatrol
   APP_ENV=production
   APP_KEY=base64:9vo5dSK6thXyz25zUqY/knTEfp7x9crFxi5EJWYJTN4=
   APP_DEBUG=false
   APP_URL=https://api.profitspatrol.com

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_database_username
   DB_PASSWORD=your_database_password

   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
5. Save changes.

---

### Step 4: 1-Click Database Migration & Seeding
No SSH terminal access required! Run the automated installer directly from your web browser:

👉 **`https://api.profitspatrol.com/api/v1/setup-database`**

You will receive a JSON confirmation:
```json
{
  "success": true,
  "message": "Database tables and initial seeds created successfully!"
}
```

> ✅ **Result**: All 22 relational tables, default curriculum, seed companies, and default administrator (`admin@profitspatrol.com` / `Admin@123456`) are initialized.

---

## 🔑 Google OAuth Sign-In Setup

To enable Google Single Sign-On (SSO):

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project ➔ **APIs & Services** ➔ **Credentials**.
3. Create **OAuth 2.0 Client ID** (Web Application):
   - **Authorized JavaScript Origins:**
     - `https://profitspatrol.com`
     - `https://www.profitspatrol.com`
   - **Authorized Redirect URIs:**
     - `https://api.profitspatrol.com/api/v1/auth/google/callback`
4. Copy the **Client ID** and **Client Secret**:
   - In `api_backend/.env`:
     ```env
     GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your_client_secret
     ```
   - In frontend `.env.production` (rebuild frontend if updated):
     ```env
     VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
     ```

---

## 🔄 Routine Updates Workflow

Whenever you modify code locally:

```powershell
# 1. Compile fresh production bundle
npm run build

# 2. Package archives
powershell -ExecutionPolicy Bypass -File scripts/package-hostinger.ps1
```

- If you updated frontend only: Upload and extract `deploy_hostinger/1_frontend_public_html.zip` in `public_html/`.
- If you updated backend only: Upload and extract `deploy_hostinger/2_backend_api.zip` in `api_backend/`.
