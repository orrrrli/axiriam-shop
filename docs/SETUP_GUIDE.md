# Complete Setup Guide

This guide walks you through setting up Bean Haven Café for local development and production deployment.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [MongoDB Configuration](#mongodb-configuration)
3. [Stripe Integration](#stripe-integration)
4. [Email Service Setup](#email-service-setup)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Step 1: Clone and Install

```bash
# Clone repository
git clone https://github.com/yourusername/bean-haven-cafe.git
cd bean-haven-cafe

# Install dependencies
npm install --legacy-peer-deps

# Copy environment file
cp .env.example .env.local
```

### Step 2: Run in Demo Mode (Fastest Way)

Demo mode requires NO external services:

```bash
# Ensure demo mode is enabled in .env.local
DEMO_MODE=true
NEXT_PUBLIC_DEMO_MODE=true

# Start server
npm run dev
```

Visit `http://localhost:3000` and sign in with:
- **Admin**: `admin@beanhavencafe.com` / `admin123`
- **User**: `demo@beanhavencafe.com` / `demo123`

---

## MongoDB Configuration

### Option A: MongoDB Atlas (Cloud - Recommended)

**Pros**: No local installation, free tier, automatic backups, scalable

1. **Create Account**
   - Visit [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up (free, no credit card required)

2. **Create Cluster**
   - Choose M0 Free tier
   - Select region closest to you
   - Click "Create Cluster"

3. **Configure Access**
   - Database Access → Add new user
     - Username: `beanhaven-admin`
     - Password: Generate secure password
     - Role: `Read and write to any database`
   - Network Access → Add IP Address
     - For development: `0.0.0.0/0` (Allow from anywhere)
     - For production: Add your server IP

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your user password
   - Update `.env.local`:
     ```env
     MONGODB_URI=mongodb+srv://beanhaven-admin:<password>@cluster0.xxxxx.mongodb.net/bean-haven?retryWrites=true&w=majority
     ```

5. **Seed Database**
   ```bash
   npm run seed
   ```

### Option B: Local MongoDB

**Pros**: No internet required, full control, faster for development

**Windows:**
```bash
# Install via Chocolatey
choco install mongodb

# Or download installer from mongodb.com
# Then start MongoDB:
mongod --dbpath="C:\data\db"
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Linux:**
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Update .env.local:**
```env
MONGODB_URI=mongodb://localhost:27017/bean-haven
```

**Seed Database:**
```bash
npm run seed
```

---

## Stripe Integration

### Step 1: Create Stripe Account

1. Visit [stripe.com](https://stripe.com)
2. Sign up for free account
3. Activate test mode (toggle in dashboard)

### Step 2: Get API Keys

1. Go to **Developers** → **API keys**
2. Copy keys:
   - **Publishable key**: Starts with `pk_test_`
   - **Secret key**: Starts with `sk_test_`

### Step 3: Configure Environment

Update `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Abc...
STRIPE_SECRET_KEY=sk_test_51Abc...
```

### Step 4: Test Payment

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Auth required**: `4000 0025 0000 3155`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

### For Production

1. Complete Stripe account verification
2. Switch to live mode
3. Update `.env.local` with live keys (`pk_live_`, `sk_live_`)
4. Set up webhook endpoints
5. Test with small transactions first

---

## Email Service Setup

### Option A: Gmail (Development)

1. **Enable 2FA**
   - Google Account → Security → 2-Step Verification

2. **Generate App Password**
   - Google Account → Security → App passwords
   - Select app: Mail
   - Select device: Other (Custom name)
   - Copy 16-character password

3. **Configure .env.local**
   ```env
   EMAIL_SERVER=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   EMAIL_FROM=Bean Haven Cafe <noreply@beanhavencafe.com>
   ```

**Limitations**: Gmail limits to 500 emails/day

### Option B: SendGrid (Production Recommended)

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Verify sender identity
3. Create API key
4. Update `.env.local`:
   ```env
   EMAIL_SERVER=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   ```

**Benefits**: 100 emails/day free, better deliverability, analytics

---

## Production Deployment

### Deploy to Vercel

**Step 1: Prepare Repository**
```bash
# Ensure all changes are committed
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

**Step 2: Deploy**

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

**Step 3: Environment Variables**

Add in Vercel dashboard → Settings → Environment Variables:

```env
DEMO_MODE=false
NEXT_PUBLIC_DEMO_MODE=false
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=production-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
# ... add all other variables
```

**Step 4: Deploy**
- Click "Deploy"
- Wait for build to complete
- Visit your live URL!

### Custom Domain (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` to your domain

---

## Troubleshooting

### Common Issues

**Issue**: "Module not found" errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**Issue**: MongoDB connection failed
```bash
# Solution: Check connection string
# Ensure MongoDB is running (if local)
# Verify IP whitelist (if Atlas)
# Check username/password
```

**Issue**: Styles not loading
```bash
# Solution: Clear Next.js cache
rm -rf .next
npm run dev
```

**Issue**: Port 3000 already in use
```bash
# Solution: Kill process or use different port
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill
# Or: PORT=3001 npm run dev
```

**Issue**: Environment variables not loading
```bash
# Solution: Restart dev server after changing .env.local
# Ensure no spaces around = in .env.local
# Verify file is named exactly .env.local
```

### Getting Help

- Check [GitHub Issues](https://github.com/yourusername/bean-haven-cafe/issues)
- Review Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- MongoDB docs: [mongodb.com/docs](https://www.mongodb.com/docs/)
- Stripe docs: [stripe.com/docs](https://stripe.com/docs)

---

## Performance Tips

1. **Enable caching** in production
2. **Use CDN** for static assets (Vercel does this automatically)
3. **Optimize images** - use WebP format when possible
4. **Monitor bundle size** - keep JavaScript under 200KB
5. **Enable gzip/brotli** compression (automatic on Vercel)

---

## Development Tips

```bash
# Run production build locally
npm run build
npm run start

# Check for TypeScript errors
npx tsc --noEmit

# Format code (if Prettier is added)
npx prettier --write .

# Check bundle analyzer (if added)
ANALYZE=true npm run build
```

---

**Need more help?** Open an issue on GitHub!
