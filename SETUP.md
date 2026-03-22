# MediVault Setup Guide

Complete step-by-step guide to get MediVault running locally and deployed.

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git
- Docker (optional, for containerization)
- Firebase account
- Polygon Mumbai testnet access
- SendGrid account
- Twilio account
- Infura account

## Part 1: Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add project"
   - Enable Google Analytics (optional)

2. **Enable Authentication**
   - In Firebase Console → Authentication → Sign-in method
   - Enable: Email/Password, Phone Number

3. **Create Firestore Database**
   - Firestore → Create database
   - Start in **Production mode**
   - Select region (us-central1 recommended)
   - Deploy the rules from `firestore.rules`
   - Deploy indexes from `firestore.indexes.json`

4. **Setup Cloud Storage**
   - Storage → Create bucket
   - Set permissions to private (RLS only)
   - Name format: `{project-id}.appspot.com`

5. **Get Service Account Key**
   - Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `backend/firebase-service-account.json`

6. **Get Client Credentials**
   - Project Settings → General
   - Copy: API Key, Auth Domain, Project ID, Storage Bucket
   - These go in `frontend/.env.local`

## Part 2: Polygon Mumbai Setup

1. **Get Testnet ETH**
   - Go to [Polygon Faucet](https://faucet.polygon.technology/)
   - Connect MetaMask wallet
   - Request Mumbai MATIC (testnet)

2. **Deploy Smart Contract**
   - Use Remix IDE: https://remix.ethereum.org
   - Create new file `HashAnchor.sol`
   - Copy code from `docs/HashAnchor.sol`
   - Compile and deploy to Mumbai testnet
   - Copy contract address

3. **Get RPC URL**
   - Use Alchemy: https://www.alchemy.com/
   - Create app (Polygon Mumbai)
   - Copy HTTPS URL
   - Get API Key separately if needed

## Part 3: External Services

### SendGrid (Email)
1. Sign up at https://sendgrid.com
2. Create API key
3. Verify sender email

### Twilio (SMS)
1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Buy a phone number for sending SMS

### Infura (IPFS)
1. Sign up at https://infura.io
2. Create project
3. Get Project ID and Project Secret

## Part 4: Backend Setup

1. **Clone and Navigate**
```bash
cd backend
```

2. **Create Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Create .env File**
```bash
cp .env.example .env
```

5. **Fill in .env**
```
FLASK_ENV=development
SECRET_KEY=your-random-secret-key-here

FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR-KEY
ALCHEMY_KEY=YOUR-ALCHEMY-KEY
CONTRACT_ADDRESS=0xYourDeployedContractAddress
OWNER_PRIVATE_KEY=0xYourPrivateKey

INFURA_PROJECT_ID=your-project-id
INFURA_PROJECT_SECRET=your-project-secret

SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@medivault.com
ADMIN_NOTIFY_EMAIL=admin@medivault.com

TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

RATELIMIT_ENABLED=true
RATELIMIT_STORAGE_URI=memory://
TALISMAN_ENABLED=false  # Set true in production
```

6. **Place Firebase Service Account**
```bash
cp /path/to/firebase-service-account.json ./firebase-service-account.json
```

7. **Run Development Server**
```bash
python run.py
# Should see: Running on http://localhost:5000
```

## Part 5: Frontend Setup

1. **Navigate to Frontend**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create .env.local**
```bash
cp .env.example .env.local
```

4. **Fill in .env.local**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_ENV=development
```

5. **Run Development Server**
```bash
npm run dev
# Open http://localhost:3000
```

## Part 6: Testing

### Create Test User (Patient)

1. Go to http://localhost:3000
2. Click "Register"
3. Select "Patient"
4. Enter phone: +1234567890 (any number for testing)
5. Enter password: Test123!
6. Click "Register"

### Create Test User (Doctor)

1. Go to http://localhost:3000
2. Click "Register"
3. Select "Doctor"
4. Enter email: doctor@test.com
5. Enter password: Test123!
6. Click "Register"
7. You'll be redirected to onboarding

### Test Doctor Onboarding

1. Fill in all fields on the 4-step wizard
2. Upload dummy PDF files (or create small ones)
3. Submit application
4. You'll see "Application Under Review"

### Test Admin Approval

1. Create admin in Firebase Console
   - Go to Authentication → Users
   - Add custom claim: `role: admin`
2. Login as admin (use email + password)
3. Go to /admin/dashboard
4. Review and approve/reject pending doctors

### Test Patient Records

1. Login as patient
2. Go to Patient Dashboard
3. Upload a test file
4. You should see it in "Records" tab
5. Click "Verify" to check blockchain status

## Part 7: Deployment

### Backend Deployment (Railway Example)

1. Push code to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Select your repository
5. Set environment variables (all from .env)
6. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project from GitHub
4. Set environment variables (all from .env.local)
5. Deploy

## Troubleshooting

### "Firebase Admin SDK not initialized"
- Check FIREBASE_SERVICE_ACCOUNT_PATH
- Ensure firebase-service-account.json exists and is valid

### "Polygon connection failed"
- Check POLYGON_RPC_URL
- Ensure you have testnet MATIC
- Verify CONTRACT_ADDRESS

### "Email not sending"
- Check SENDGRID_API_KEY
- Verify SENDGRID_FROM_EMAIL is allowed
- Check API key is not expired

### "SMS not sending"
- Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
- Ensure TWILIO_PHONE_NUMBER is correct format
- Check account balance

### "IPFS upload failing"
- Check INFURA_PROJECT_ID and INFURA_PROJECT_SECRET
- Verify internet connection

### "OTP not received (SMS)"
- Check Twilio phone number is active
- In development, check backend logs
- Twilio may require phone verification for testing

## Production Checklist

- [ ] Set FLASK_ENV=production
- [ ] Set TALISMAN_ENABLED=true
- [ ] Use strong SECRET_KEY
- [ ] Enable RATELIMIT with Redis backend
- [ ] Deploy Firestore rules from firestore.rules
- [ ] Deploy Firestore indexes
- [ ] Setup error monitoring (Sentry, etc.)
- [ ] Setup logging (CloudLogging, etc.)
- [ ] Configure CORS_ORIGINS for frontend domain
- [ ] Enable HTTPS
- [ ] Setup backups for Firestore
- [ ] Monitor rate limits and adjust if needed

## Next Steps

1. Read `/docs` for smart contract details
2. Check `backend/app/routes.py` for all API endpoints
3. Check `frontend/src` for all components and pages
4. Review Firestore rules in `firestore.rules`
5. Test all user flows end-to-end

---

For additional help, check the main README.md or individual component documentation.
