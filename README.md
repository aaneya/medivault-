# MediVault - Blockchain-Secured Medical Records Platform

A comprehensive healthcare platform combining **Flask backend**, **Next.js frontend**, **Firebase authentication**, **Firestore database**, and **Polygon blockchain** for secure, tamper-proof medical records.

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python run.py  # Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev  # Runs on http://localhost:3000
```

## Architecture Overview

**Backend**: Flask + Firestore + Firebase Auth + Polygon Blockchain + GCS + IPFS + Email/SMS
- All API routes in `app/routes.py` (auth, onboarding, records, access, admin)
- Services: OTP (Twilio/SendGrid), Blockchain (Web3), Storage (GCS), IPFS
- Security: Role-based decorators, rate limiting, signed URLs, hash verification

**Frontend**: Next.js 14 + React + Tailwind + Firebase SDK
- Pages: Login, Register, Patient Dashboard, Doctor Dashboard, Admin Panel, Doctor Onboarding
- Design: Dark mode, mobile-first, DigiLocker-inspired (indigo brand color #4F46E5)
- Fonts: Sora (headings), DM Sans (body)

## Features

- **Patient**: Login with phone OTP, upload/manage records, control doctor access, verify records on blockchain
- **Doctor**: 4-step onboarding verification, request patient access, upload records, view audit trail
- **Admin**: Review pending doctor applications, approve/reject with reasons, view platform stats

## Tech Stack

**Backend**: Flask, Firebase Admin, Google Cloud Storage, Web3.py, Infura IPFS, SendGrid, Twilio, Flask-Limiter
**Frontend**: Next.js 14, Firebase SDK, Tailwind CSS, SWR, Axios, TypeScript
**Services**: Firebase (Auth/Firestore), Polygon Mumbai, GCS, Infura, SendGrid, Twilio

## Environment Setup

1. Create Firebase project (Auth, Firestore, Storage)
2. Get Polygon Mumbai testnet credentials
3. Setup SendGrid and Twilio
4. Fill in `.env` and `.env.local` files (see `.example` files)

## Key Files

- `backend/app/routes.py` - All 50+ endpoints
- `backend/app/services/` - OTP, blockchain, storage, IPFS, notifications
- `frontend/src/app/page.tsx` - Home
- `frontend/src/app/login/page.tsx` - Login with OTP
- `frontend/src/app/patient/dashboard/page.tsx` - Patient dashboard
- `frontend/src/app/doctor/dashboard/page.tsx` - Doctor dashboard
- `frontend/src/app/admin/dashboard/page.tsx` - Admin panel
- `frontend/src/app/onboarding/page.tsx` - 4-step doctor verification

## Deployment

**Backend**: Docker + Railway/Heroku/AWS (set all env vars)
**Frontend**: Vercel (connect GitHub, set env vars in dashboard)

See `vercel.json` for Vercel config.

## Security

- Firebase Auth + Custom claims for roles
- Firestore RLS policies per collection
- SHA-256 file hashing before upload
- GCS private bucket + 60-min signed URLs
- Blockchain hash anchoring for tamper detection
- Rate limiting: 5 OTP/hour, 3 wrong OTP → 15 min lockout
- Doctor onboarding gate (must be verified)
- Audit logs for all actions

## Status

✅ Backend: Complete (all routes, services, utils)
✅ Frontend: Complete (all pages, components, design system)
✅ Configs: Complete (.env examples, Dockerfile, gunicorn, Vercel, Firestore rules)

All 22 implementation steps completed including:
- Backend Foundation, OTP Service, Authentication, File Services, Blockchain
- Records API, Access Control, Hospital Routes, Admin Routes, Onboarding
- Frontend Foundation, Layout Components, Auth Pages, Dashboards
- Firestore Rules, Deployment Configs
