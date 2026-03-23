# MediVault - Complete Setup Guide

Follow this guide step-by-step to set up MediVault from scratch. Total time: ~2-3 hours.

## Part 1: Firebase Project Setup (25 minutes)

### Step 1.1: Create Firebase Project

1. Go to **https://firebase.google.com**
2. Click **"Go to console"** (top right)
3. Click **"Create a project"**
   - **Project name:** MediVault-Production
   - **Analytics:** Enable it
   - Click **"Create project"**
4. Wait 2-3 minutes for setup to complete
5. You'll see the Firebase console dashboard

**Save these IDs** (click gear icon → Project settings):
- Project ID: `medivault-xxxxx`
- API Key: `AIzaSy...` (under "Web API key")

### Step 1.2: Enable Firestore Database

1. In Firebase console, click **"Firestore Database"** (left menu)
2. Click **"Create database"**
   - **Location:** us-central1 (or your region)
   - **Security rules:** Start in test mode
   - Click **"Create"**
3. Wait for database to initialize (1-2 minutes)

### Step 1.3: Enable Authentication

1. Click **"Authentication"** (left menu)
2. Click **"Get started"**
3. Enable **"Phone"** sign-in method:
   - Click **Phone** option
   - Click toggle to enable
   - Click **"Save"**
4. Enable **"Email/Password"** (for admin):
   - Click **Email/Password**
   - Click toggle to enable
   - Click **"Save"**

### Step 1.4: Create Storage Bucket

1. Click **"Storage"** (left menu)
2. Click **"Get started"**
   - **Location:** Same as Firestore (us-central1)
   - Click **"Done"**
3. Wait for bucket to initialize

### Step 1.5: Download Service Account Key

1. Click **⚙️ (Settings)** → **"Project settings"**
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"** button
4. A JSON file downloads: `medivault-xxxxx-firebase-adminsdk-xxxxx.json`
5. **Save this file securely!** (needed for backend)

### Step 1.6: Get Firebase Config

1. In Firebase console, click **"Project settings"** (⚙️)
2. Scroll down to **"Your apps"** section
3. If no web app yet, click **"Add app"** → **"Web"**
4. Name it: `MediVault Web`
5. You'll see **Firebase SDK config** (looks like):
```json
{
  "apiKey": "AIzaSy...",
  "authDomain": "medivault-xxxxx.firebaseapp.com",
  "projectId": "medivault-xxxxx",
  "storageBucket": "medivault-xxxxx.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abcdef..."
}
```
6. **Save all these values** (used in .env files)

---

## Part 2: Third-Party Services Setup (45 minutes)

### Step 2.1: Create Twilio Account (SMS OTP)

1. Go to **https://www.twilio.com/console**
2. Sign up or log in
3. **Get your credentials:**
   - Account SID: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Auth Token: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
4. **Get a phone number:**
   - Click **"Phone Numbers"** (left menu)
   - Click **"Get started"**
   - Click **"Get your first Twilio phone number"**
   - Click **"Choose this number"** for any number
   - Save this number (e.g., `+1201234567`)
5. **Add to .env:**
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER=+1201234567
   ```

### Step 2.2: Create SendGrid Account (Email OTP)

1. Go to **https://sendgrid.com**
2. Click **"Sign up"**
   - Email: your hospital email
   - Password: strong password
3. Verify email
4. **Get API key:**
   - Click **"Settings"** (⚙️)
   - Click **"API Keys"** (left menu)
   - Click **"Create API Key"** button
   - Name: `MediVault Backend`
   - Permissions: Check "Full Access"
   - Click **"Create & View"**
   - Copy the key (shown only once!)
5. **Verify sender:**
   - Click **"Sender Authentication"** (left menu)
   - Click **"Verify Single Sender"**
   - Use your hospital email: `noreply@yourhospital.com`
   - You'll get a verification email within 5 minutes
6. **Add to .env:**
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@yourhospital.com
   ```

### Step 2.3: Create Alchemy Account (Polygon Mumbai)

1. Go to **https://www.alchemy.com**
2. Click **"Sign Up"**
3. Create account and verify email
4. **Create an app:**
   - Click **"+ Create App"** button
   - **Name:** MediVault
   - **Blockchain:** Ethereum
   - **Network:** Polygon Mumbai
   - Click **"Create app"**
5. **Get API key:**
   - Click on your app
   - Click **"API Key"** button (top right)
   - Copy the HTTPS URL (looks like `https://polygon-mumbai.g.alchemy.com/v2/xxxxx`)
6. **Add to .env:**
   ```
   POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/xxxxx
   ```

### Step 2.4: Create Infura Account (IPFS)

1. Go to **https://infura.io**
2. Click **"Sign up"**
3. Create account and verify email
4. **Create project:**
   - Click **"Create New Project"**
   - Name: `MediVault`
   - Select **IPFS**
   - Click **"Create"**
5. **Get credentials:**
   - You'll see **Project ID** and **Project Secret**
   - Copy both
6. **Add to .env:**
   ```
   INFURA_IPFS_PROJECT_ID=xxxxx
   INFURA_IPFS_PROJECT_SECRET=xxxxxxxxxxxxx
   ```

### Step 2.5: Create Google Cloud Storage (Already included in Firebase)

Your Firebase storage bucket is ready! Just need to set permissions:

1. Go to **Firebase Console** → **Storage**
2. Click **"Rules"** tab
3. Paste the contents of `/backend/firestore.rules` (storage section)
4. Click **"Publish"**

---

## Part 3: Blockchain Setup (30 minutes)

### Step 3.1: Deploy HashAnchor Smart Contract

1. Go to **https://remix.ethereum.org** (Remix IDE - browser-based)
2. Create new file: `HashAnchor.sol`
3. Copy-paste from `/docs/HashAnchor.sol`
4. **Compile:**
   - Click **"Solidity Compiler"** (left sidebar)
   - Click **"Compile HashAnchor.sol"**
   - Should say "Compilation successful"
5. **Deploy to Polygon Mumbai:**
   - Click **"Deploy & Run Transactions"** (left sidebar)
   - **Environment:** Select "Injected Web3" (installs MetaMask)
   - **MetaMask setup:**
     - Install MetaMask extension (if not already installed)
     - Create account
     - Add Polygon Mumbai network:
       - Network name: `Polygon Mumbai`
       - RPC URL: `https://rpc-mumbai.maticvigil.com`
       - Chain ID: `80001`
       - Currency: `MATIC`
     - Click **"Switch to Polygon Mumbai"** in MetaMask
   - **Get test MATIC:** Go to **https://faucet.polygon.technology**
     - Paste your wallet address
     - Claim MATIC (free testnet tokens)
   - Back to Remix:
     - Click **"Deploy"** button
     - MetaMask will ask to confirm transaction
     - Click **"Confirm"**
     - Wait 30 seconds for deployment
6. **Get contract address:**
   - After deployment, click on the contract in left panel
   - Copy the address (looks like `0x...`)
7. **Add to .env:**
   ```
   POLYGON_CONTRACT_ADDRESS=0x...
   ```

---

## Part 4: GitHub Setup (15 minutes)

### Step 4.1: Create GitHub Repository

1. Go to **https://github.com**
2. Sign in or create account
3. Click **"+"** (top right) → **"New repository"**
   - **Name:** `medivault-production`
   - **Description:** `Blockchain-secured medical records platform`
   - **Public:** Choose based on hospital policy
   - Click **"Create repository"**

### Step 4.2: Push MediVault Code

1. In your terminal, go to the medivault folder:
   ```bash
   cd /path/to/medivault-production
   ```
2. Initialize Git:
   ```bash
   git init
   git add .
   git commit -m "Initial MediVault commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/medivault-production.git
   git push -u origin main
   ```

---

## Part 5: Backend Deployment (Railway) (30 minutes)

### Step 5.1: Create Railway Account

1. Go to **https://railway.app**
2. Click **"Login"** or **"Sign up"**
3. Connect with GitHub (recommended)
4. Authorize Railway to access your GitHub account

### Step 5.2: Deploy Backend

1. In Railway dashboard, click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Select your `medivault-production` repository
4. Select the `backend` directory (if asked)
5. Click **"Deploy"**
6. Wait 2-3 minutes for deployment

### Step 5.3: Add Environment Variables

1. In Railway dashboard, click on your project
2. Click **"Variables"** tab
3. Add all variables from `.env.example` (see Part 6 below):
   ```
   FLASK_ENV=production
   FIREBASE_CREDENTIALS_JSON={paste entire JSON from Step 1.5}
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=...
   SENDGRID_API_KEY=...
   SENDGRID_FROM_EMAIL=...
   POLYGON_RPC_URL=...
   POLYGON_CONTRACT_ADDRESS=...
   INFURA_IPFS_PROJECT_ID=...
   INFURA_IPFS_PROJECT_SECRET=...
   ... (see full list in .env.example)
   ```
4. Railway automatically redeploys after environment variables are saved

### Step 5.4: Get Backend URL

1. In Railway project, click **"Deployments"** tab
2. You'll see a URL like `https://medivault-backend-production-xxxxx.railway.app`
3. **Save this URL!** (used in frontend .env)

---

## Part 6: Frontend Deployment (Vercel) (30 minutes)

### Step 6.1: Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your GitHub account

### Step 6.2: Deploy Frontend

1. In Vercel dashboard, click **"New Project"**
2. Select your `medivault-production` GitHub repo
3. **Important:** Set "Root Directory" to `.` (root, not frontend/)
4. Click **"Deploy"**
5. Wait 2-3 minutes for deployment

### Step 6.3: Add Environment Variables

1. Click on your deployed project in Vercel
2. Go to **"Settings"** → **"Environment Variables"**
3. Add variables from Firebase config (Step 1.6):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=medivault-xxxxx.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=medivault-xxxxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=medivault-xxxxx.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef...
   NEXT_PUBLIC_BACKEND_URL=https://medivault-backend-production-xxxxx.railway.app
   ```
4. Vercel automatically redeploys

### Step 6.4: Get Frontend URL

1. In Vercel dashboard, you'll see your domain:
   - Default: `https://medivault-production-xxxxx.vercel.app`
   - Custom domain: Configure in "Settings" → "Domains"

---

## Part 7: Firestore Setup (Finalize) (15 minutes)

### Step 7.1: Deploy Security Rules

1. Go to **Firebase Console** → **Firestore Database**
2. Click **"Rules"** tab
3. Replace all content with `/firestore.rules`
4. Click **"Publish"**

### Step 7.2: Deploy Indexes

1. Go to **Firebase Console** → **Firestore Database**
2. Click **"Indexes"** tab
3. Import `/firestore.indexes.json`:
   - You can manually create indexes or use Firebase CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   firebase deploy --only firestore:indexes
   ```

### Step 7.3: Test Firestore Access

1. In Firebase console, click **"Firestore Database"** → **"Data"**
2. Click **"Start collection"**
3. Create test collection: `test_users`
4. Add a test document
5. If successful, Firestore is working!

---

## Part 8: Local Testing (Before Hospital Deployment) (30 minutes)

### Step 8.1: Run Backend Locally

1. Clone your GitHub repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/medivault-production.git
   cd medivault-production/backend
   ```

2. Create `.env` file (copy from `.env.example` and fill in values):
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run server:
   ```bash
   python run.py
   ```
   - Should say: `Running on http://localhost:5000`

### Step 8.2: Run Frontend Locally

1. In another terminal:
   ```bash
   cd medivault-production
   ```

2. Create `.env.local`:
   ```bash
   cp .env.frontend.example .env.local
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run dev server:
   ```bash
   npm run dev
   ```
   - Should say: `Ready in X seconds`

5. Open **http://localhost:3000** in browser
6. Test login flow

### Step 8.3: Test Key Features

- [ ] Patient registration with phone OTP
- [ ] Doctor 4-step onboarding
- [ ] Upload medical record
- [ ] Grant/revoke doctor access
- [ ] Verify record on blockchain
- [ ] Admin approve/reject doctors

---

## Part 9: Hospital Deployment Checklist

Before going live with a hospital:

- [ ] All environment variables set (Firebase, Twilio, SendGrid, Polygon, Infura)
- [ ] Backend deployed and running on Railway
- [ ] Frontend deployed on Vercel
- [ ] All features tested locally
- [ ] Firestore rules and indexes deployed
- [ ] Smart contract deployed on Polygon Mumbai
- [ ] Backup & disaster recovery plan documented
- [ ] Support contact info provided to hospital
- [ ] Training completed for hospital staff
- [ ] Patient consent forms signed
- [ ] Go-live monitoring setup (alerts configured)

---

## Troubleshooting

### Firebase Issues
- **"Permission denied" error:** Check Firestore rules, ensure user is authenticated
- **Storage file not uploading:** Check GCS bucket permissions, ensure signed URL generation works

### Backend Issues
- **"Connection refused" error:** Is backend running? Check Railway logs
- **"OTP not sending":** Check Twilio credentials, phone number format
- **"Hash mismatch":** Ensure file wasn't modified, check SHA-256 function

### Frontend Issues
- **"Blank page after login":** Check Firebase config in .env, open browser console for errors
- **"Can't reach backend":** Ensure NEXT_PUBLIC_BACKEND_URL is correct

### Blockchain Issues
- **"Contract not found":** Ensure contract address is correct, check on Mumbai testnet explorer
- **"Insufficient gas":** Need more MATIC tokens, claim from faucet

---

## Support

For issues:
1. Check logs: Railway for backend, Vercel for frontend
2. Check browser console (F12) for frontend errors
3. Check backend logs: `docker logs [container-id]` if using Docker
4. Contact MediVault support with logs attached

---

**Estimated Total Time: 2-3 hours**
**Next Step:** Follow QUICK_START.md for local development
