# Hostinger VPS Deployment Guide for KidCapHQ

This guide outlines the easiest and most robust way to deploy, host, and update the **KidCapHQ** React/Vite application on a Hostinger Linux VPS (Ubuntu 22.04 or similar).

## Prerequisites

1.  **A Hostinger VPS** running Ubuntu (20.04 or 22.04).
2.  **SSH Access** to your VPS.
3.  **A Domain Name** pointed to your VPS's IP Address (e.g., via A Record).
4.  **GitHub Account** with your KidCapHQ repository pushed to it.

---

## Part 1: Initial VPS Setup (One-Time)

Log in to your server via SSH:
```bash
ssh root@YOUR_VPS_IP
```

### 1. Install Node.js & Nginx
You need Node.js to build the app, and Nginx to serve the fast, compiled static files.
```bash
sudo apt update && sudo apt upgrade -y
# Install Nginx
sudo apt install nginx -y

# Install Node.js (Latest LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Clone Your Repository
We will place your app in the `/var/www/` directory.

```bash
cd /var/www
# Replace with your actual repo URL
git clone https://github.com/yourusername/kidcaphq.git
cd kidcaphq
```

### 3. Configure Environment Variables
Copy your local `.env` values to the server.
```bash
cp .env.example .env
nano .env
# Paste your Supabase URL, Anon Key, and other variables here, then save (Ctrl+O, Enter, Ctrl+X).
```

### 4. Install Dependencies & Build
```bash
npm ci
npm run build
```
*(This creates a `dist` folder containing your optimized production app).*

---

## Part 2: Configuring Nginx to Serve the App

We need to tell Nginx to serve the files from the `dist` folder and handle React Router's client-side routing.

1. Create a new Nginx configuration file:
   ```bash
   nano /etc/nginx/sites-available/kidcaphq
   ```

2. Paste the following configuration (replace `yourdomain.com` with your actual domain):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       # Point this to your Vite build output folder:
       root /var/www/kidcaphq/dist;
       index index.html;

       location / {
           # This handles React Router paths properly
           try_files $uri $uri/ /index.html;
       }

       # Optional: Cache static assets (images, css, js)
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
           expires 30d;
           add_header Cache-Control "public, max-age=2592000";
       }
   }
   ```

3. Enable the site and restart Nginx:
   ```bash
   ln -s /etc/nginx/sites-available/kidcaphq /etc/nginx/sites-enabled/
   # Remove the default Nginx page
   rm /etc/nginx/sites-enabled/default
   # Test config
   nginx -t
   # Restart Nginx
   systemctl restart nginx
   ```

### 5. Secure with Free SSL (HTTPS)
Install Certbot to get a free SSL certificate from Let's Encrypt.
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Your app is now live and secure!

---

## Part 3: Easiest Way to Update Your App (Routine Updates)

Whenever you make changes to your codebase locally, you should push them to GitHub. Then, run these simple commands on your VPS to instantly pull the new changes and rebuild the site.

### The "Update Command"
Connect via SSH and run:
```bash
cd /var/www/kidcaphq
git pull origin main
npm ci
npm run build
```
*(Because Nginx serves static files, you don't even need to restart Nginx! As soon as `npm run build` finishes replacing the `dist` folder, your users will see the new version upon refreshing).*

---

### Pro-Tip: Creating a 1-Click Update Script
To make updates even easier, create a bash script on your VPS:

1. `cd ~`
2. `nano update-app.sh`
3. Paste the following:
   ```bash
   #!/bin/bash
   echo "Starting Update Process..."
   cd /var/www/kidcaphq
   git pull origin main
   npm ci
   npm run build
   echo "App Successfully Updated!"
   ```
4. Make it executable: `chmod +x update-app.sh`

Now, whenever you want to update the live site, just SSH into your server and type:
```bash
./update-app.sh
```
