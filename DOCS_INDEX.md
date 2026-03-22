# MediVault Documentation Index

Complete guide to all documentation files.

## Start Here

### 1. **QUICK_START.md** (5 minutes)
Get MediVault running in 5 minutes with minimal setup.
- Docker commands
- Local development quick setup
- Quick test instructions
- Common issues table
- **Best for**: Getting something running immediately

### 2. **README.md** (10 minutes)
High-level project overview and architecture.
- Project description
- Feature list (patient, doctor, admin)
- Tech stack overview
- File structure
- API endpoints summary
- **Best for**: Understanding what MediVault is

### 3. **PROJECT_SUMMARY.md** (15 minutes)
Detailed summary of what was built.
- Project statistics
- What works (complete feature list)
- How to run
- Security features
- Deployment instructions
- **Best for**: Complete overview of implementation

## Detailed Guides

### 4. **SETUP.md** (1 hour)
Complete step-by-step setup guide for production.
- Part 1: Firebase setup (users, auth, firestore, storage, service account)
- Part 2: Polygon Mumbai testnet (get ETH, deploy contract)
- Part 3: External services (SendGrid, Twilio, Infura)
- Part 4: Backend setup (venv, dependencies, .env, run)
- Part 5: Frontend setup (npm, .env.local, run)
- Part 6: Testing (create users, test flows)
- Part 7: Deployment (backend, frontend, production checklist)
- Troubleshooting section
- **Best for**: Complete setup from scratch

### 5. **IMPLEMENTATION_COMPLETE.md** (20 minutes)
Deep dive into architecture and implementation details.
- All 22 implementation steps completed
- Backend implementation details (routes, services, utilities)
- Frontend implementation details (pages, components, utilities)
- Design system (colors, typography, layout)
- Security implementation (auth, authorization, encryption, auditing)
- Database schema (collections, indexes, fields)
- Environment variables (all required)
- Deployment configuration (Docker, Vercel)
- Complete file tree
- API summary
- Technology stack details
- **Best for**: Understanding the complete system

## Code Documentation

### Backend Code
- **backend/README.md** - Backend-specific documentation
- **backend/app/routes.py** - All API endpoints with docstrings
- **backend/app/services/** - Individual service documentation:
  - otp.py - OTP generation, SMS, email, rate limiting
  - firestore.py - Database operations
  - blockchain.py - Polygon integration
  - ipfs.py - IPFS storage
  - storage.py - GCS operations
  - notifications.py - Email notifications
- **backend/app/utils/auth.py** - Authentication decorators and utilities
- **backend/app/utils/validators.py** - File validation

### Frontend Code
- **frontend/README.md** - Frontend-specific documentation
- **frontend/src/app/page.tsx** - Home page
- **frontend/src/app/login/page.tsx** - Login page (2-step OTP)
- **frontend/src/app/register/page.tsx** - Registration page
- **frontend/src/app/patient/dashboard/page.tsx** - Patient portal
- **frontend/src/app/doctor/dashboard/page.tsx** - Doctor portal
- **frontend/src/app/admin/dashboard/page.tsx** - Admin panel
- **frontend/src/app/onboarding/page.tsx** - Doctor onboarding wizard
- **frontend/src/lib/api.ts** - API client with all endpoints

## Configuration Files

### Environment Variables
- **backend/.env.example** - Backend environment template
  - Flask config, Firebase, Polygon, IPFS, SendGrid, Twilio, rate limiting
- **frontend/.env.example** - Frontend environment template
  - Firebase config, backend URL

### Deployment
- **Dockerfile** - Backend containerization
- **gunicorn.conf.py** - Production server config
- **vercel.json** - Vercel deployment config
- **next.config.js** - Next.js configuration
- **tailwind.config.ts** - Tailwind CSS configuration
- **tsconfig.json** - TypeScript configuration

### Database
- **firestore.rules** - Firestore security rules and RLS policies
- **firestore.indexes.json** - Firestore composite indexes

## Guides by User Type

### For Developers (Getting Started)

1. Read: **QUICK_START.md** (5 min)
2. Read: **README.md** (10 min)
3. Do: Setup from SETUP.md Part 4-5 (30 min)
4. Read: Relevant code files (backend/app/routes.py or frontend/src/app/*.tsx)
5. Read: **IMPLEMENTATION_COMPLETE.md** for architecture (20 min)

### For DevOps/Deployment

1. Read: **SETUP.md** Part 7 (Deployment) (15 min)
2. Read: Docker and gunicorn configs (5 min)
3. Read: vercel.json config (5 min)
4. Read: **PROJECT_SUMMARY.md** - Scalability Notes (5 min)
5. Execute deployment steps

### For System Architects

1. Read: **PROJECT_SUMMARY.md** (15 min)
2. Read: **IMPLEMENTATION_COMPLETE.md** (20 min)
3. Review: firestore.rules and firestore.indexes.json (10 min)
4. Review: backend/app/routes.py (20 min)
5. Review: frontend/src/lib/api.ts (10 min)

### For QA/Testing

1. Read: **QUICK_START.md** (5 min)
2. Read: **SETUP.md** Part 6 (Testing) (15 min)
3. Read: **PROJECT_SUMMARY.md** - Testing Checklist (10 min)
4. Execute: Full test flow (30 min)
5. Read: backend/app/routes.py for endpoint details (20 min)

### For Security Review

1. Read: **IMPLEMENTATION_COMPLETE.md** - Security Implementation section (10 min)
2. Review: **firestore.rules** (5 min)
3. Review: backend/app/utils/auth.py (5 min)
4. Review: backend/app/routes.py - auth decorators (10 min)
5. Read: **SETUP.md** - Production Checklist (5 min)

## Quick Reference Tables

### All Endpoints (50+)

**Auth**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/session

**Onboarding**
- POST /api/onboarding/upload-doc
- POST /api/onboarding/submit
- GET /api/onboarding/status

**Records**
- POST /api/records/upload
- GET /api/records
- GET /api/records/{id}
- GET /api/records/{id}/signed-url
- GET /api/records/{id}/verify
- DELETE /api/records/{id}

**Access Control**
- POST /api/access-requests
- GET /api/access/requests/mine
- GET /api/access-requests/pending
- PATCH /api/access-requests/{id}

**Admin**
- GET /api/admin/onboarding/pending
- PATCH /api/admin/onboarding/{uid}/review

**Audit**
- GET /api/audit/mine

**Health**
- GET /health

**Pages (Flask)**
- GET / (home)
- GET /login
- GET /patient/dashboard
- etc.

### Database Collections

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| users | User accounts | uid, email, role, created |
| patients | Patient profiles | uid, name, phone, DOB |
| doctors | Doctor profiles | uid, license, specialty, verified |
| records | Medical records | id, patientId, title, fileType, hash |
| accessRequests | Doctor access | id, doctorId, patientId, status |
| onboardingSubmissions | Doctor verification | uid, status, documents, review |
| auditLogs | Activity logs | id, actorId, action, timestamp |
| otpSessions | OTP verification | id, identifier, hash, attempts |

### Firestore Rules

- Users: read own, none write
- Patients: read self + approved doctors
- Records: read self + approved doctors + admins
- Access Requests: read both parties
- Audit Logs: read own + admins
- Onboarding: read own + admins

## Technology Quick Reference

### Backend Stack
- Framework: Flask 3.0
- Language: Python 3.11
- Database: Firestore
- Auth: Firebase
- Storage: Google Cloud Storage
- Blockchain: Web3.py + Polygon
- IPFS: Infura
- Email: SendGrid
- SMS: Twilio

### Frontend Stack
- Framework: Next.js 14
- Language: TypeScript
- UI: React 18
- Styling: Tailwind CSS 3
- Auth: Firebase SDK
- HTTP: Axios
- Data: SWR

## Key Features by Category

### Authentication
- Firebase JWT
- Custom claims
- Role-based decorators
- Token verification

### File Handling
- Upload validation
- SHA-256 hashing
- GCS storage
- IPFS pinning
- Signed URLs

### Blockchain
- Hash anchoring
- Tamper detection
- Polygon Mumbai
- Web3 integration

### Security
- RLS policies
- Rate limiting
- Audit logging
- Signed URLs
- Private bucket

### User Experience
- Dark mode
- Responsive design
- Toast notifications
- Intuitive dashboards
- 4-step wizard

## Common Tasks

### How to Add a New Endpoint

1. Define schema in backend/app/schemas.py
2. Add route in backend/app/routes.py
3. Add service method if needed
4. Add to API client in frontend/src/lib/api.ts
5. Use in component with useSWR hook

### How to Add a New Page

1. Create file in frontend/src/app/[route]/page.tsx
2. Import Navbar component
3. Use useAuth() for user data
4. Use useSWR() for API calls
5. Style with Tailwind classes

### How to Change Colors

1. Edit frontend/tailwind.config.ts (color values)
2. Edit frontend/src/globals.css (design tokens)
3. Update color references in components

### How to Deploy

1. Backend: Build Docker image, push to registry, deploy with env vars
2. Frontend: Connect GitHub to Vercel, set env vars, deploy on push

## Support Resources

### Documentation Files
- README.md - Overview
- QUICK_START.md - Quick setup
- SETUP.md - Detailed setup
- IMPLEMENTATION_COMPLETE.md - Architecture
- PROJECT_SUMMARY.md - What was built

### Code Files
- backend/app/routes.py - All endpoints
- backend/app/services/ - All services
- frontend/src/app - All pages
- firestore.rules - Security policies

### Configuration
- .env.example files - Environment variables
- Dockerfile - Containerization
- Vercel.json - Deployment

---

## Navigation Quick Links

| I Want to... | Read This |
|---|---|
| Get it running in 5 minutes | QUICK_START.md |
| Understand the project | README.md |
| Setup from scratch | SETUP.md |
| See what was built | PROJECT_SUMMARY.md |
| Understand architecture | IMPLEMENTATION_COMPLETE.md |
| Deploy to production | SETUP.md Part 7 |
| Find specific endpoint | backend/app/routes.py |
| Understand security | IMPLEMENTATION_COMPLETE.md (Security section) |
| Change colors/design | frontend/tailwind.config.ts |
| Add new feature | IMPLEMENTATION_COMPLETE.md (Architecture) |

---

**Total Documentation**: 6 main documents + code comments
**Setup Time**: 5 minutes (quick) to 1 hour (complete)
**Learning Time**: 15 minutes (overview) to 2 hours (deep dive)

Everything you need to understand, setup, customize, and deploy MediVault is included.

Start with QUICK_START.md. Questions? Check the relevant section in this index.
