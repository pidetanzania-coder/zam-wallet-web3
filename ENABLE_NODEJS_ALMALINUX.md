# How to Enable Node.js in WHM on AlmaLinux

## Method 1: Using CloudLinux Selector (If CloudLinux is installed)

If your server uses CloudLinux (common with AlmaLinux), Node.js selector should be available:

### Step 1: Login to WHM as Root
```
https://your-server-ip:2087 or https://your-domain.com:2087
```

### Step 2: Find Node.js Selector
1. In WHM search bar, type: **"Node.js"**
2. Look for one of these:
   - **"CloudLinux Node.js Selector"**
   - **"Node.js Selectors"**
   - **"Module Installers"** → Then find Node.js

### Step 3: Enable Node.js
If you see Node.js Selector:
1. Click on it
2. Enable/install Node.js
3. Select version **20.x** or **18.x**

---

## Method 2: Install via Terminal (SSH)

If Node.js selector is not available, install it manually:

### Step 1: Connect via SSH
```bash
ssh root@your-server-ip
```

### Step 2: Install Node.js on AlmaLinux
```bash
# Update system
dnf update -y

# Install Node.js 20.x
dnf module enable nodejs:20 -y
dnf install nodejs -y

# Verify installation
node --version
npm --version
```

### Step 3: Install npm (if not included)
```bash
dnf install npm -y
```

---

## Method 3: Using alt-php (PHP Node.js) - For cPanel accounts

### Step 1: In WHM, go to:
**"MultiPHP Manager"** or **"Software"** → **"EasyApache 4"**

### Step 2: Check for Node.js in:
- **"System PHP Extensions"**
- Search for "node"

---

## Method 4: Ask Your Hosting Provider

Since you have a VPS/dedicated server, contact them:

**Send this message to your host:**
> "Hi, I need Node.js enabled on my AlmaLinux server with WHM. Can you either:
> 1. Enable the CloudLinux Node.js Selector, OR
> 2. Install Node.js 20.x via DNF
> 
> This is needed to run a Next.js web application. Thank you!"

---

## After Node.js is Installed - Verify in cPanel

Once Node.js is enabled at the server level:

### Step 1: Login to cPanel (not WHM)
```
https://your-domain.com/cpanel
```

### Step 2: Look for Node.js
Search for **"Node.js"** in cPanel - you should now see:
- **"Setup Node.js App"**
- **"Node.js Application"**

---

## If All Methods Fail - Use Vercel (Free Alternative)

If you cannot enable Node.js on your server, use [Vercel](https://vercel.com):

1. Go to [vercel.com](https://vercel.com) - Sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Add environment variables:
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY = your_key
   NEXT_PUBLIC_ALCHEMY_POLICY_ID = your_policy_id
   NEXT_PUBLIC_APP_URL = https://your-project.vercel.app
   ```
5. Click **Deploy**

This is free, takes 10 minutes, and works perfectly with Next.js!
