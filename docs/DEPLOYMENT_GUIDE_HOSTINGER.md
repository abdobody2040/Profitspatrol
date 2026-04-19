# Deploying Profits Patrol to Hostinger

This guide covers how to build your application and deploy it to Hostinger Shared Hosting.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your computer.
- A Hostinger account with a hosting plan (Shared Hosting, Cloud Hosting, or similar).
- Access to your Hostinger Control Panel (hPanel).

## Step 1: Prepare Environment Variables

Hostinger serves static files, so your environment variables (like Supabase keys) must be "baked in" during the build process.

1. Create a file named `.env.production` in your project root (same level as `package.json`).
2. Add your production keys. these should match your `.env` but for your production database if different:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_public_anon_key
    VITE_AI_PROVIDER=gemini
    ```

## Step 2: Build the Application

Open your terminal in the project folder and run:

```bash
npm install
npm run build
```

**What this does:**

- `npm install` ensures all dependencies are ready.
- `npm run build` compiles your code into the `dist` folder. It optimizes debugging console logs, minifies code, and bundles everything for ensuring fast loading.

> **Note:** If you see type errors during build, fix them or try `npm run build` again. The build command relies on `tsc` (TypeScript Compiler) to check for errors first.

## Step 3: Locate the Build Output

After the build completes successfully, you will see a `dist` folder in your project directory. This folder contains everything you need to upload.

**Contents of `dist`:**

- `index.html` (The entry point)
- `assets/` (JavaScript, CSS, and images)
- `.htaccess` (Created automatically for routing)
- Other static files from your `public` folder.

## Step 4: Upload to Hostinger

1. **Log in to Hostinger hPanel**.
2. Go to **Websites** and click **Manage** on your domain.
3. Click on **File Manager**.
4. Navigate to the **public_html** folder.
    - *Note: If you are deploying to a subdomain, navigate to that subdomain's folder instead.*
5. **Delete default files:** If `public_html` contains a `default.php` or empty `index.php` provided by Hostinger, allow you to delete it (unless you have other stuff running there).
6. **Upload Files:**
    - Open your local `dist` folder.
    - Select **ALL** files and folders inside `dist` (including `assets`, `index.html`, and `.htaccess`).
    - Drag and drop them into the Hostinger File Manager window inside `public_html`.
    - **Alternatively:** Zip the contents of `dist` into `upload.zip`, upload that, and then right-click -> "Extract" in File Manager.

## Step 5: Verify Routing (.htaccess)

Since this is a Single Page Application (SPA), we need to tell the server to always load `index.html` regardless of the URL path (e.g., `/dashboard` or `/login`).

We have already added a `.htaccess` file to your `public` folder, which should have been copied to `dist`. Ensure this file exists in your `public_html` on Hostinger.

**Content of .htaccess:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Step 6: Test Your Site

Visit your domain (e.g., `www.your-domain.com`).

- The app should load.
- Try refreshing the page while on a sub-page (like `/dashboard`). If it loads `index.html` and the app renders, your `.htaccess` is working correctly.
- If you get a 404 error on refresh, check that `.htaccess` is present and properly uploaded.

## Troubleshooting

- **White Screen / App Not Loading:** Check the browser console (F12 -> Console). static file 404s mean you might have uploaded the *folder* `dist` instead of the *contents* of `dist`. Ensure `index.html` is directly inside `public_html`.
- **Environment Variables Missing:** If API calls fail, ensure you created `.env.production` **before** running `npm run build`. The build process replaces the variables with the actual values.
