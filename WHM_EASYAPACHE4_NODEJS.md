# Enable Node.js via EasyApache 4 in WHM (AlmaLinux)

## Step-by-Step Guide

### Step 1: Login to WHM
```
URL: https://your-server-ip:2087
Username: root
Password: your_root_password
```

### Step 2: Navigate to EasyApache 4
In WHM search bar, type: **"EasyApache 4"**

Or go to:
**Software** → **EasyApache 4**

### Step 3: Click "Customize"
You'll see currently installed Apache/PHP profile. Click **"Customize"** button.

### Step 4: Find Node.js in Apache Packages
In EasyApache 4, look for these sections:

1. **Apache Packages** - Search for "node"
2. **PHP Packages** - Search for "node"
3. **System Packages** - Search for "node"

### Step 5: Enable Node.js

Look for and check/select these packages:
- **"ea-apache24-mod_passenger"** (includes Node.js support)
- **"nodejs20"** or **"nodejs18"**
- **"npm"** (Node Package Manager)

### Step 6: Save and Provision
1. Click **"Save"** or **"Save Package"**
2. Click **"Provision"** to install the selected packages
3. Wait for installation to complete (may take 5-10 minutes)

---

## Alternative: Check Available Node.js Packages

If you don't see Node.js in EasyApache 4:

### Option A: Check Available Packages
In EasyApache 4:
1. Click **"Available Packages"** tab
2. Search for "node"
3. Install any Node.js related packages

### Option B: Install via Command Line (Root SSH)

If EasyApache doesn't have Node.js, install it manually:

```bash
# SSH as root
ssh root@your-server-ip

# Install Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -

dnf install nodejs -y

# Verify
node --version
npm --version
```

---

## After Node.js is Installed

### Check in cPanel
1. Login to **cPanel** (not WHM): `https://your-domain.com/cpanel`
2. Look for **"Setup Node.js App"** or **"Node.js Application"**

### If Still Not Available in cPanel

The Node.js might be installed system-wide but not visible in cPanel. In that case:

1. In cPanel → **"Setup Node.js App"**
2. If you see it, create your app there
3. If not, you need to enable it at the cPanel account level

### Contact Your Host (If you can't do this yourself)

Send this to your hosting provider:

> "Hi, I need Node.js enabled on my AlmaLinux server with WHM. I've tried EasyApache 4 but can't find the Node.js package. Can you either:
> 1. Install Node.js via EasyApache 4 (ea-apache24-mod_passenger or nodejs20 package), OR
> 2. Install Node.js 20.x via DNF at the system level
> 
> I need this to run a Next.js web application on my cPanel account.
> 
> Thank you!"

---

## Once Node.js Works in cPanel - Deployment Steps

### Step 1: Build Your Project Locally
```bash
# In your project folder
npm install
npm run build
```

### Step 2: Upload to cPanel
Upload these to `public_html/`:
- `.next/` folder
- `public/` folder
- `.env.production`
- `package.json`
- `package-lock.json`
- `next.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`
- `postcss.config.mjs`

### Step 3: Create Node.js App in cPanel
1. Go to **"Setup Node.js App"** in cPanel
2. Click **"Create Application"**
3. Configure:
   - Node.js version: **20.x**
   - Application mode: **Production**
   - Application root: `public_html`
   - Application startup file: leave blank or `npm start`
4. Click **Create**

### Step 4: Run NPM Install
1. Click **"Run NPM Install"** on your app
2. Wait for completion

### Step 5: Set Environment Variables
1. In your Node.js app settings
2. Add:
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY = your_alchemy_key
   NEXT_PUBLIC_ALCHEMY_POLICY_ID = your_policy_id
   NEXT_PUBLIC_APP_URL = https://your-domain.com
   ```

### Step 6: Start the App
1. Click **"Start"** or **"Restart"**
2. Wait 30-60 seconds
3. Visit your domain

---

## Troubleshooting

### "Command not found" after installation
- Log out of SSH and log back in
- Or run: `source /etc/profile`

### Node.js still not showing in cPanel
- The system administrator (you or your host) needs to enable it at account level
- Check WHM → **"Feature Manager"** → ensure Node.js is enabled for your account

### Port already in use
- Change the port in Node.js app settings to a different port (like 3001)

---

## Summary

1. **WHMs** → **Software** → **EasyApache 4** → **Customize** → Find & install Node.js packages
2. **OR** SSH as root → `curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -` → `dnf install nodejs -y`
3. **Then in cPanel** → Setup Node.js App → Create app → Deploy

Let me know once you've installed Node.js and I'll help you with the deployment steps!
