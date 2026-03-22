# MediVault - Quick Start Guide

Get MediVault running in 5 minutes.

## Option 1: Docker (Fastest)

```bash
# Build and run backend
cd backend
docker build -t medivault-backend .
docker run -p 5000:5000 --env-file .env medivault-backend

# In another terminal: run frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Option 2: Local Development (Detailed)

### 1. Backend (3 minutes)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env

# Edit .env with your credentials:
# - Firebase service account path
# - Polygon RPC URL + contract address
# - SendGrid/Twilio API keys
# - Infura credentials

python run.py  # Runs on http://localhost:5000
```

### 2. Frontend (2 minutes)

```bash
cd frontend
npm install
cp .env.example .env.local

# Edit .env.local with Firebase config:
# - NEXT_PUBLIC_FIREBASE_API_KEY
# - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# - etc.

npm run dev  # Runs on http://localhost:3000
```

## Quick Test

### Test Patient Login
1. Go to http://localhost:3000
2. Click "Register"
3. Select "Patient"
4. Enter phone: +1234567890 (any format)
5. Password: Test123!
6. You're logged in

### Test Doctor Onboarding
1. Register as doctor (email: doctor@test.com)
2. Fill 4-step form
3. Upload test files
4. Submit - you'll see "Under Review"
5. (Admin would approve in real app)

### Test Patient Dashboard
1. Login as patient
2. Click "My Health Records"
3. Upload a test file
4. See it appear in records list
5. Click "Verify" to check blockchain (Polygon)

## File Locations

| What | Where |
|------|-------|
| Backend API routes | `backend/app/routes.py` |
| Frontend pages | `frontend/src/app/*.tsx` |
| Services (OTP, blockchain, storage) | `backend/app/services/` |
| API client | `frontend/src/lib/api.ts` |
| Design tokens | `frontend/src/globals.css` |
| Environment vars | `.env` and `.env.local` |
| Firebase config | `firestore.rules` |
| Smart contract | `docs/HashAnchor.sol` |

## Key Endpoints

```
POST   /api/auth/register              - Create account
POST   /api/auth/login                 - Sign in
POST   /api/onboarding/submit          - Submit doctor verification
POST   /api/records/upload             - Upload medical record
GET    /api/records                    - List records
GET    /api/records/{id}/verify        - Check blockchain hash
POST   /api/access-requests            - Request patient access
GET    /api/access-requests/pending    - List pending requests
PATCH  /api/access-requests/{id}       - Approve/deny
GET    /api/admin/onboarding/pending   - List pending doctors
PATCH  /api/admin/onboarding/{uid}/review - Approve doctor
```

## Credentials

### Test Patient
- Phone: +1234567890
- Password: Test123!

### Test Doctor
- Email: doctor@test.com
- Password: Test123!

### Test Admin
- Email: admin@test.com
- Password: Test123!
- (Add custom claim `role: admin` in Firebase)

## Common Issues

| Issue | Fix |
|-------|-----|
| "Firebase not initialized" | Check `backend/firebase-service-account.json` exists |
| "Polygon connection failed" | Check `POLYGON_RPC_URL` in .env |
| "SMS not sending" | Check Twilio credentials and test mode |
| "IPFS upload fails" | Verify Infura credentials |
| "Port already in use" | Change port or kill process: `lsof -i :5000` |

## Architecture at a Glance

```
Patient/Doctor Login
    ↓
Firebase Auth (JWT token)
    ↓
Backend API (Flask)
    ↓
Firestore (data) + GCS (files) + Polygon (hashes) + IPFS (backup)
    ↓
Frontend (Next.js + React)
```

## What Each Service Does

| Service | Purpose |
|---------|---------|
| **Firebase** | User authentication + Firestore database |
| **GCS** | Secure medical file storage (private bucket) |
| **Polygon** | Blockchain hash anchoring (tamper detection) |
| **IPFS** | Decentralized file backup |
| **SendGrid** | Email notifications |
| **Twilio** | SMS for OTP |

## Deploy to Production

### Backend
```bash
# Railway
git push origin main  # Auto-deploys if connected

# Heroku
heroku login
heroku create medivault-api
heroku config:set FLASK_ENV=production
git push heroku main
```

### Frontend
```bash
# Vercel
vercel --prod
# Or connect GitHub repo to Vercel dashboard
```

## Next: Read These Files

1. `README.md` - Full project overview
2. `SETUP.md` - Complete setup instructions
3. `IMPLEMENTATION_COMPLETE.md` - Architecture details
4. `backend/app/routes.py` - All API endpoints
5. `frontend/src/app/page.tsx` - Frontend structure

---

**Time to first run**: 5 minutes
**Lines of code**: 5000+ (production-ready)
**Ready for**: Development, testing, deployment

Let's go! 🚀
