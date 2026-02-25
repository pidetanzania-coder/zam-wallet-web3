# Deploy Zam Wallet on cPanel with Application Manager

## Prerequisites

✅ Node.js installed on server (via EasyApache4 or DNF)
✅ Application Manager in cPanel
✅ cPanel Terminal access

---

## Step 1: Build Your Project Locally

### 1.1 Prepare Environment Variables
Create or edit `.env.production` in your project:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_ALCHEMY_POLICY_ID=your_policy_id_here
NEXT_PUBLIC_APP_URL=https://web.zamwallet.xyz
```

### 1.2 Build the Project
```bash
# In your project folder
npm install
npm run build
```

This creates a `.next` folder with the production build.

---

## Step 2: Upload Files to cPanel

### 2.1 Login to cPanel
Go to: `https://your-domain.com/cpanel`

### 2.2 Go to File Manager
1. Click **"File Manager"**
2. Navigate to `public_html` (or your domain folder)
3. Upload these files/folders:

**Required Files:**
- `.next/` (the entire build folder - may be large ~200MB)
- `public/` (static assets)
- `.env.production` (your environment variables)
- `package.json`
- `package-lock.json`
- `next.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`
- `postcss.config.mjs`
- `eslint.config.mjs`

### 2.3 Upload Method
- **Option A:** Click "Upload" button in File Manager
- **Option B:** Use FTP/SFTP (faster for large files)
- **Option C:** Use Git in cPanel Terminal

---

## Step 3: Install Dependencies via Terminal

### 3.1 Open cPanel Terminal
1. In cPanel, search for **"Terminal"**
2. Click **"Terminal"** (or **"Advanced"** → **"Terminal"**)
3. Click **"I understand and want to proceed"**

### 3.2 Navigate to Your Folder
```bash
# Go to public_html (or your domain folder)
cd public_html
```

### 3.3 Install Dependencies
```bash
npm install
```

This installs all packages from `package.json`.

---

## Step 4: Create Application in Application Manager

### 4.1 Open Application Manager
In cPanel, search for **"Application Manager"** and click it.

### 4.2 Create New Application
1. Click **"Deploy"** or **"Add Application"**
2. Configure:

| Setting | Value |
|---------|-------|
| **Application Name** | zamwallet |
| **Domain** | Select your domain (web.zamwallet.xyz) |
| **Base Domain** | your-domain.com |
| **Application Path** | /public_html (or / if on main domain) |
| **Deploy Type** | Node.js |
| **Node.js Version** | 20.x or 18.x |
| **Application Mode** | Production |
| **Startup File** | npm start |

### 4.3 Save the Application
Click **"Deploy"** or **"Save"**.

---

## Step 5: Configure Environment Variables

### 5.1 In Application Manager
1. Find your deployed application
2. Click on it or **"Edit"**
3. Look for **"Environment Variables"** section

### 5.2 Add These Variables
```
NEXT_PUBLIC_ALCHEMY_API_KEY = your_actual_alchemy_key
NEXT_PUBLIC_ALCHEMY_POLICY_ID = your_actual_policy_id
NEXT_PUBLIC_APP_URL = https://web.zamwallet.xyz
NODE_ENV = production
```

### 5.3 Save
Click **"Save"** or **"Update"**.

---

## Step 6: Start the Application

### 6.1 In Application Manager
1. Find your application
2. Click **"Start"** or **"Restart"**
3. Wait 30-60 seconds

### 6.2 Check Status
- The status should show **"Running"**
- Click the domain URL to test

---

## Step 7: Configure .htaccess

Create/edit `.htaccess` in `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Handle root
  RewriteCond %{REQUEST_URI} ^/$
  RewriteRule ^ /login [L,R=302]
  
  # Pass all requests to Node.js
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/_next
  RewriteCond %{REQUEST_URI} !^/api
  RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [L,P]
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

## Step 8: Test Your Application

Visit: `https://web.zamwallet.xyz`

You should see the Zam Wallet login page!

---

## Troubleshooting

### 502 Bad Gateway Error
- Check Application Manager logs
- Make sure Node.js app is running
- Verify environment variables are set

### Module Not Found Errors
Run in Terminal:
```bash
cd public_html
npm install
```

### Port Already in Use
In Application Manager, change the port (e.g., from 3000 to 3001)

### Static Files Not Loading
Check that `.next/static` folder was uploaded correctly

### API Not Working
- Verify Alchemy API keys are correct
- Make sure `NEXT_PUBLIC_ALCHEMY_API_KEY` is set

---

## Quick Commands Reference

In cPanel Terminal:

```bash
# Navigate to app folder
cd public_html

# Install dependencies
npm install

# Start the app
npm start

# Check if running
curl localhost:3000

# View running processes
ps aux | grep node

# Kill node process (if needed)
pkill -f node
```

---

## Summary

1. ✅ Build locally: `npm run build`
2. ✅ Upload files to `public_html/`
3. ✅ Terminal: `npm install`
4. ✅ Application Manager: Create app, set env variables, start
5. ✅ Create `.htaccess`
6. ✅ Test your domain

Good luck! 🚀
