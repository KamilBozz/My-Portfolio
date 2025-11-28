# Vercel Deployment Guide for Portfolio App

This guide will walk you through deploying your Next.js portfolio application to Vercel with Auth0 authentication and Neon database integration.

## Prerequisites

- GitHub account with your portfolio repository
- Vercel account (sign up at https://vercel.com)
- Auth0 account and application configured
- Neon database with connection string

---

## Step 1: Push Your Code to GitHub

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `my-portfolio`)
   - **Do NOT** initialize with README, .gitignore, or license

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Import Project to Vercel

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Click **"Add New Project"** or **"New Project"**

2. **Import from GitHub**:
   - Click **"Import Git Repository"**
   - Authorize Vercel to access your GitHub account if prompted
   - Select your portfolio repository
   - Click **"Import"**

3. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Click "Deploy"** (we'll add environment variables after)

---

## Step 3: Configure Environment Variables in Vercel

1. **Navigate to Project Settings**:
   - In your Vercel project dashboard, go to **Settings** → **Environment Variables**

2. **Add the following environment variables**:

   ### Database
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon database connection string
   - **Example**: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
   - **Environments**: Production, Preview, Development (check all)

   ### Auth0 Configuration
   - **Name**: `AUTH0_SECRET`
   - **Value**: Your Auth0 secret (generate one if needed: `openssl rand -hex 32`)
   - **Environments**: Production, Preview, Development

   - **Name**: `AUTH0_BASE_URL`
   - **Value**: `https://your-app-name.vercel.app` (replace with your actual Vercel domain)
   - **Environments**: Production, Preview
   - **Note**: For local development, use `http://localhost:3000`

   - **Name**: `AUTH0_ISSUER_BASE_URL`
   - **Value**: `https://YOUR_TENANT.us.auth0.com` (replace YOUR_TENANT with your Auth0 tenant)
   - **Environments**: Production, Preview, Development

   - **Name**: `AUTH0_CLIENT_ID`
   - **Value**: Your Auth0 application Client ID
   - **Environments**: Production, Preview, Development

   - **Name**: `AUTH0_CLIENT_SECRET`
   - **Value**: Your Auth0 application Client Secret
   - **Environments**: Production, Preview, Development

   ### Public Base URL (for API calls)
   - **Name**: `NEXT_PUBLIC_BASE_URL`
   - **Value**: `https://your-app-name.vercel.app` (same as AUTH0_BASE_URL for production)
   - **Environments**: Production, Preview
   - **Note**: For local development, use `http://localhost:3000`

   ### Optional: Resend Email (if using contact form)
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key
   - **Environments**: Production, Preview, Development

   - **Name**: `RESEND_FROM`
   - **Value**: Your sender email (e.g., `noreply@yourdomain.com`)
   - **Environments**: Production, Preview, Development

   - **Name**: `RESEND_TO`
   - **Value**: Your recipient email (e.g., `contact@yourdomain.com`)
   - **Environments**: Production, Preview, Development

3. **Save Environment Variables**:
   - Click **"Save"** after adding each variable
   - Make sure to select the appropriate environments for each variable

---

## Step 4: Update Auth0 Application Settings

1. **Go to Auth0 Dashboard**:
   - Visit https://manage.auth0.com
   - Navigate to **Applications** → Select your application

2. **Update Application URLs**:

   ### Allowed Callback URLs
   Add both localhost and Vercel URLs (comma-separated):
   ```
   https://your-app-name.vercel.app/api/auth/callback,http://localhost:3000/api/auth/callback
   ```

   ### Allowed Logout URLs
   Add both localhost and Vercel URLs:
   ```
   https://your-app-name.vercel.app,http://localhost:3000
   ```

   ### Allowed Web Origins
   Add both localhost and Vercel URLs:
   ```
   https://your-app-name.vercel.app,http://localhost:3000
   ```

   ### Allowed Login URLs (if required by your Auth0 setup)
   ```
   https://your-app-name.vercel.app/api/auth/login,http://localhost:3000/api/auth/login
   ```

3. **Save Changes**:
   - Click **"Save Changes"** at the bottom of the page

---

## Step 5: Redeploy on Vercel

1. **Trigger Redeployment**:
   - Go to your Vercel project dashboard
   - Click on **"Deployments"** tab
   - Click the **"..."** menu on the latest deployment
   - Select **"Redeploy"**
   - Or make a small commit and push to trigger automatic deployment

2. **Wait for Build**:
   - Monitor the build logs in the Vercel dashboard
   - Ensure the build completes successfully
   - Check for any errors in the build logs

---

## Step 6: Smoke Testing on Live URL

Test the following on your live Vercel URL (`https://your-app-name.vercel.app`):

### 1. Authentication Flow
- ✅ Visit `/api/auth/login` or click login button
- ✅ Should redirect to Auth0 login page
- ✅ After login, should redirect back to your app
- ✅ Should show user information when logged in

### 2. Dashboard Access
- ✅ Visit `/dashboard` while logged in
- ✅ Should display the dashboard with hero editor form
- ✅ Should show "Log in to update your portfolio content" when not logged in

### 3. Hero Section CRUD
- ✅ Edit hero section in dashboard
- ✅ Upload avatar image
- ✅ Update full name, short description, and long description
- ✅ Save changes
- ✅ Visit homepage (`/`)
- ✅ Verify hero section displays updated content from database

### 4. Homepage
- ✅ Homepage loads without errors
- ✅ Hero section displays database content
- ✅ Projects preview loads correctly
- ✅ Contact form is accessible

### 5. API Endpoints
- ✅ `/api/hero` GET returns hero data (public)
- ✅ `/api/hero` PUT updates hero (authenticated)
- ✅ `/api/projects` returns projects list

---

## Step 7: Local Development vs Production URLs

### Local Development Setup

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL=your_neon_database_connection_string

# Auth0 (Local)
AUTH0_SECRET=your_auth0_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://YOUR_TENANT.us.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# Public URL (Local)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional: Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=noreply@yourdomain.com
RESEND_TO=contact@yourdomain.com
```

### Production (Vercel)

All environment variables are configured in Vercel dashboard (Step 3).

**Important Notes**:
- `AUTH0_BASE_URL` in Vercel should be your Vercel domain
- `AUTH0_BASE_URL` locally should be `http://localhost:3000`
- Both localhost and production URLs must be in Auth0 settings
- This allows seamless switching between local and production development

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set correctly
- Ensure `package.json` has correct build scripts

### Authentication Not Working
- Verify Auth0 URLs are correctly configured in both Auth0 dashboard and Vercel
- Check that `AUTH0_BASE_URL` matches your Vercel domain
- Ensure callback URLs include both `/api/auth/callback` paths

### Database Connection Issues
- Verify `DATABASE_URL` is correct in Vercel environment variables
- Check that Neon database allows connections from Vercel IPs
- Ensure SSL mode is enabled in connection string

### API Calls Failing
- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Check browser console for CORS errors
- Ensure API routes are properly configured

---

## Quick Reference: Environment Variables Checklist

### Required for Production:
- [ ] `DATABASE_URL`
- [ ] `AUTH0_SECRET`
- [ ] `AUTH0_BASE_URL` (Vercel domain)
- [ ] `AUTH0_ISSUER_BASE_URL`
- [ ] `AUTH0_CLIENT_ID`
- [ ] `AUTH0_CLIENT_SECRET`
- [ ] `NEXT_PUBLIC_BASE_URL` (Vercel domain)

### Optional:
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM`
- [ ] `RESEND_TO`

---

## Next Steps After Deployment

1. **Set up Custom Domain** (optional):
   - Go to Vercel project → Settings → Domains
   - Add your custom domain
   - Update Auth0 URLs to include custom domain

2. **Enable Analytics** (optional):
   - Vercel Analytics provides insights into your app performance

3. **Set up Monitoring**:
   - Configure error tracking if needed
   - Set up uptime monitoring

---

## Support

If you encounter issues:
1. Check Vercel build logs
2. Review Auth0 application logs
3. Verify all environment variables are set
4. Check browser console for client-side errors
5. Review server logs in Vercel dashboard

---

**Congratulations!** Your portfolio app should now be live on Vercel! 🎉

