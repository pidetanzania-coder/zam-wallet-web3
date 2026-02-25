# 🚀 Deploy Zam Wallet to Vercel (Step by Step)

## What is Vercel?
Vercel is a free platform that hosts Next.js apps perfectly. No server management needed!

---

## Step 1: Prepare Your Code

### 1.1 Update Environment Variables
Create a `.env.production` file in your project with real values:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_ALCHEMY_POLICY_ID=your_policy_id
NEXT_PUBLIC_APP_URL=https://web.zamwallet.xyz
```

### 1.2 Build Locally (Test First)
```bash
cd c:/Projects/Zam\ Wallet\ web3
npm install
npm run build
```

If build fails, fix any errors first.

---

## Step 2: Push Code to GitHub

### 2.1 Create GitHub Account
Go to: https://github.com

### 2.2 Create New Repository
1. Click **"+"** → **"New repository"**
2. Name: `zam-wallet-web3`
3. Make it **Public** (free)
4. Click **"Create repository"**

### 2.3 Upload Your Code

**Option A: Using Git (Recommended)**
```bash
# In your project folder
cd c:/Projects/Zam\ Wallet\ web3

git init
git add .
git commit -m "Initial commit"

# Add your GitHub repo (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/zam-wallet-web3.git
git push -u origin main
```

**Option B: Upload via Browser**
1. Go to your GitHub repo
2. Click **"uploading an existing file"**
3. Drag and drop all your files (except node_modules, .next)
4. Click **"Commit changes"**

---

## Step 3: Deploy to Vercel

### 3.1 Create Vercel Account
1. Go to: https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**

### 3.2 Deploy
1. Click **"Add New..."** → **"Project"**
2. Find your `zam-wallet-web3` repository
3. Click **"Import"**

### 3.3 Configure
1. **Framework Preset**: Next.js (should auto-detect)
2. **Build Command**: `npm run build` (or leave blank)
3. **Output Directory**: `.next` (or leave blank)

### 3.4 Environment Variables
Scroll down to **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| NEXT_PUBLIC_ALCHEMY_API_KEY | your_alchemy_key |
| NEXT_PUBLIC_ALCHEMY_POLICY_ID | your_policy_id |
| NEXT_PUBLIC_APP_URL | https://web.zamwallet.xyz |

Click **"Deploy"**!

---

## Step 4: Wait for Deployment

⏱️ Takes 1-2 minutes

You'll see:
- Building...
- Deploying...
- ✓ Ready! (unique-url.vercel.app)

---

## Step 5: Connect Your Domain

### 5.1 In Vercel
1. Go to your project → **"Settings"** → **"Domains"**
2. Enter: `web.zamwallet.xyz`
3. Click **"Add"**

### 5.2 Update DNS in cPanel
1. Go to cPanel → **"Zone Editor"**
2. Find `web.zamwallet.xyz`
3. Add/Edit CNAME record:
   - **Name**: `web`
   - **Value**: `cname.vercel-dns.com`
4. Save

---

## Step 6: Test Your Site

✅ Visit: **https://web.zamwallet.xyz**

---

## Quick Reference

| Task | Link |
|------|------|
| Vercel Dashboard | https://vercel.com/dashboard |
| Your Project | https://vercel.com/YOUR_USERNAME/zam-wallet-web3 |
| Domain Settings | Project → Settings → Domains |

---

## Troubleshooting

**"Build Failed"**
- Check the build log in Vercel
- Common issue: Missing environment variables

**"Page Not Found"**
- Check your _redirects file
- Make sure build completed successfully

**Domain Not Working**
- DNS can take 24-48 hours to propagate
- Check DNS settings in cPanel

---

## Important Notes

1. **Vercel is free** for personal projects
2. **Auto-deploys** when you push to GitHub
3. **No server management** - Vercel handles everything
4. **Custom domain** - Works with your web.zamwallet.xyz
