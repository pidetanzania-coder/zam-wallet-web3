# 🚀 Zam Wallet - cPanel Deployment Guide (No Node.js)

## ⚠️ Important: Node.js Required

**Your cPanel doesn't have Node.js support**, which is required for Next.js applications. You have these options:

---

## OPTION 1: Enable Node.js on Your Server (Recommended)

Contact your hosting provider or use WHM to enable Node.js:

### Step 1.1: Check in WHM (If you have root access)
1. Login to **WHM** as root
2. Search for **"Node.js"** in the search bar
3. Enable **"Node.js Selectors"** or **"CloudLinux Node.js Selector"**
4. Select Node.js version (20.x or 18.x)
5. Save changes

### Step 1.2: If Using Regular cPanel (No root access)
1. Contact your hosting provider and ask: **"Please enable Node.js selector for my account"**
2. Many hosts offer this for free
3. Once enabled, you can proceed with the steps below

### Step 1.3: After Node.js is Enabled - Deploy

Once Node.js is working, follow these steps:

#### Step 1: Build the Project Locally

```bash
# Open terminal in project folder
cd c:/Projects/Zam\ Wallet\ web3

# Install dependencies
npm install

# Create production environment file
# Edit .env.production with your production Alchemy keys

# Build for production
npm run build
```

#### Step 2: Upload to cPanel

1. **Login to cPanel** → Go to **File Manager**
2. Navigate to `public_html` (or your domain folder)
3. Upload these files/folders:
   - `.next/` (entire folder - this is the largest, ~200MB)
   - `public/`
   - `src/` (or you can skip this - only needed if using API routes)
   - `.env.production`
   - `package.json`
   - `package-lock.json`
   - `next.config.mjs`
   - `tailwind.config.ts`
   - `tsconfig.json`
   - `postcss.config.mjs`
   - `eslint.config.mjs`

#### Step 3: Create Node.js Application in cPanel

1. In cPanel, find **"Setup Node.js App"** or **"Node.js Application"**
2. Click **Create Application**
3. Configure:
   - **Node.js Version**: `20.x` or `18.x`
   - **Application Mode**: Production
   - **Application Root**: `public_html` (or your domain folder)
   - **Application URL**: Your domain
   - **Application Startup File**: `npm start` or leave blank
4. Click **Create**

#### Step 4: Install Dependencies

1. After creating the app, click **Run NPM Install**
2. Wait for completion (may take 1-2 minutes)

#### Step 5: Set Environment Variables

1. Click on your Node.js app
2. Find **Environment Variables** section
3. Add these variables:
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY = your_alchemy_api_key
   NEXT_PUBLIC_ALCHEMY_POLICY_ID = your_policy_id
   NEXT_PUBLIC_APP_URL = https://your-domain.com
   ```
4. Click **Save**
5. **Restart the app**

#### Step 6: Configure .htaccess

Create/edit `.htaccess` in `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
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

#### Step 7: Start the App

1. In cPanel Node.js app, click **Start**
2. Wait 30-60 seconds
3. Visit your domain to test

---

## OPTION 2: Use Free Node.js Hosting (Easier!)

Deploy to free Node.js hosting and use cPanel only for your domain:

### Recommended Free Options:

| Service | Free Tier | URL |
|---------|-----------|-----|
| **Vercel** | Unlimited | vercel.com |
| **Render** | 750 hours/month | render.com |
| **Railway** | $5 credit/month | railway.app |
| **Fly.io** | 3 apps free | fly.io |

### Deploy to Vercel (Easiest - Free & No Credit Card):

1. **Push your code to GitHub**
   - Create a GitHub repository
   - Upload all your project files

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New..."** → **"Project"**
   - Import your GitHub repository
   - In **Environment Variables**, add:
     ```
     NEXT_PUBLIC_ALCHEMY_API_KEY = your_alchemy_key
     NEXT_PUBLIC_ALCHEMY_POLICY_ID = your_policy_id
     NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
     ```
   - Click **Deploy**

3. **Connect Domain in Vercel**
   - Go to your project → Settings → Domains
   - Add your domain (e.g., web.zamwallet.xyz)
   - Update your domain's DNS as instructed

### Update cPanel for Custom Domain:

1. In cPanel → **Zone Editor** → **Manage**
2. Create these records for your subdomain:
   ```
   Type: CNAME
   Name: web.zamwallet.xyz
   Value: cname.vercel-dns.com
   ```
3. Or use **"Add Record"** in your domain registrar

---

## OPTION 3: Static Export (Limited Features)

If you can't get Node.js, you can export as static HTML, BUT:
- ❌ API routes won't work (price fetching)
- ❌ Dynamic features limited
- ⚠️ App may not function fully

### To Enable Static Export:

1. Edit `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Add this line
  reactStrictMode: true,
  // Remove assetPrefix for static export
  images: {
    unoptimized: true,  // Required for static export
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      os: false,
      path: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
    };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
```

2. Build:
```bash
npm run build
```

3. Upload the `out/` folder to `public_html/`

---

## 📋 Quick Checklist

- [ ] Contact host to enable Node.js OR
- [ ] Use Vercel/Render for Node.js hosting
- [ ] Get Alchemy API keys for production
- [ ] Build locally with `npm run build`
- [ ] Upload to server
- [ ] Configure Node.js app in cPanel
- [ ] Set environment variables
- [ ] Test your domain

---

## 🔧 Getting Alchemy Keys

1. Go to [alchemy.com](https://dashboard.alchemy.com)
2. Create new app:
   - Chain: Ethereum, Polygon, Arbitrum, etc.
   - Network: Mainnet
   - Name: Zam Wallet Production
3. Copy **API Key** (HTTP)
4. For Policy ID: Account Settings → Copy

---

## ❓ Need Help?

1. **What error are you seeing?** - Check cPanel logs
2. **Can your host enable Node.js?** - Ask them
3. **Try Vercel** - It's free and works with Next.js perfectly

---

**Recommended**: Use **Option 2 (Vercel)** - It's free, specifically designed for Next.js, and takes 10 minutes to set up!
