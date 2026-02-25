# Zam Wallet - Deployment Guide for cPanel (Beginner)

## Prerequisites
- cPanel hosting with Node.js support
- Domain name pointed to your hosting
- Git (optional but recommended)

---

## Step 1: Prepare Your .env.production File

Create a file named `.env.production` in the project root with your production API keys:

```env
# Alchemy Configuration - GET THESE FROM ALCHEMY DASHBOARD
NEXT_PUBLIC_ALCHEMY_API_KEY=your_production_api_key_here
NEXT_PUBLIC_ALCHEMY_POLICY_ID=your_production_policy_id_here

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Important:** Get your API keys from [Alchemy Dashboard](https://dashboard.alchemy.com):
1. Create a new app in Alchemy
2. Copy the API Key (HTTP)
3. Copy the Policy ID from Account Kit settings

---

## Step 2: Build the Application

Open your terminal in the project folder and run:

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

---

## Step 3: Upload to cPanel

### Option A: Using File Manager (Easiest)

1. **Log into cPanel** → Go to **File Manager**
2. Navigate to your domain's root folder (usually `public_html`)
3. **Delete existing files** (except `.htaccess` if you have one)
4. Click **Upload** → Upload these folders/files from your computer:
   - `.next/` (entire folder)
   - `public/` 
   - `src/`
   - `.env.production`
   - `package.json`
   - `package-lock.json`
   - `next.config.mjs`
   - `tailwind.config.ts`
   - `tsconfig.json`
   - `eslint.config.mjs`
   - `postcss.config.mjs`

### Option B: Using FTP/SFTP

Use FileZilla or similar to upload all files to `public_html/`.

---

## Step 4: Install Dependencies on Server

In cPanel, go to **Setup Node.js App**:

1. Click **Create Application**
2. Configure:
   - Node.js version: **20.x** or **18.x**
   - Application mode: **Production**
   - Application root: `public_html` (or your domain folder)
   - Application startup file: `npm start`
3. Click **Create**
4. Click **Run NPM Install** in the appear modal

---

## Step 5: Set Environment Variables

In cPanel **Setup Node.js App**:

1. Click your app
2. Scroll to **Environment Variables**
3. Add:
   - `NEXT_PUBLIC_ALCHEMY_API_KEY` = your production key
   - `NEXT_PUBLIC_ALCHEMY_POLICY_ID` = your policy ID
   - `NEXT_PUBLIC_APP_URL` = https://your-domain.com
4. Click **Save**
5. Restart the app

---

## Step 6: Configure .htaccess (Important!)

Create `.htaccess` in `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
 + RewriteRule ^(.)$ /_next/static/$1 [L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Step 7: Start the Application

In cPanel **Setup Node.js App**:

1. Click **Start App**
2. Wait 30 seconds
3. Click the URL to test

---

## Troubleshooting

### "502 Bad Gateway" Error
- Check Node.js app logs in cPanel
- Make sure npm install completed
- Verify environment variables are set

### "Module Not Found" Errors
- Run `npm install` again on the server
- Make sure all files uploaded correctly

### Styles Not Loading
- Check that `.next/static/css/` folder exists
- Verify the .htaccess rules

### API Not Working
- Verify Alchemy API keys are correct
- Check the Policy ID is for production

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Need Help?

Check your app logs in cPanel under **Setup Node.js App** → **Logs**
