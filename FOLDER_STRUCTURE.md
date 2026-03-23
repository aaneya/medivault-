# MediVault - Folder Structure Overview

## Current Structure (After Reorganization)

```
medivault-production/
│
├── 📋 DOCUMENTATION (11 files)
│   ├── README.md                      ← START HERE
│   ├── QUICK_START.md                 ← 5-min local setup
│   ├── SETUP_GUIDE.md                 ← Complete deployment
│   ├── SECURITY_CHECKLIST.md          ← Hospital deployment verification
│   ├── FILE_TREE.md                   ← Complete file listing
│   ├── COMPLETE_FILE_TREE.txt         ← ASCII tree format
│   ├── FOLDER_STRUCTURE.md            ← This file
│   ├── DEPLOYMENT_SUMMARY.md          ← Deployment status
│   ├── PROJECT_STRUCTURE.md           ← Architecture overview
│   ├── PROJECT_SUMMARY.md             ← Feature documentation
│   ├── MIGRATION_COMPLETE.md          ← Reorganization log
│   └── DOCS_INDEX.md                  ← Navigation guide
│
├── 🎨 NEXT.JS FRONTEND (Root Level - FOR VERCEL)
│   ├── package.json                   ← NPM dependencies
│   ├── next.config.js                 ← Next.js config
│   ├── tsconfig.json                  ← TypeScript config
│   ├── tailwind.config.ts             ← Design system
│   ├── postcss.config.js              ← CSS processing
│   ├── vercel.json                    ← Vercel deployment
│   ├── .eslintrc.json                 ← Linting rules
│   ├── .env.frontend.example          ← Environment template
│   ├── .env.example                   ← Full env variables
│   │
│   └── src/
│       │
│       ├── app/                       ← Next.js App Router
│       │   ├── layout.tsx             ← Root layout
│       │   ├── page.tsx               ← Home page
│       │   ├── login/
│       │   │   └── page.tsx           ← Login page
│       │   ├── register/
│       │   │   └── page.tsx           ← Register page
│       │   ├── patient/
│       │   │   └── dashboard/
│       │   │       └── page.tsx       ← Patient dashboard
│       │   ├── doctor/
│       │   │   └── dashboard/
│       │   │       └── page.tsx       ← Doctor dashboard
│       │   ├── admin/
│       │   │   └── dashboard/
│       │   │       └── page.tsx       ← Admin dashboard
│       │   └── onboarding/
│       │       ├── page.tsx           ← Onboarding wizard
│       │       └── pending/
│       │           └── page.tsx       ← Pending status
│       │
│       ├── components/
│       │   ├── Navbar.tsx             ← Navigation component
│       │   └── Toast.tsx              ← Notification component
│       │
│       ├── context/
│       │   └── AuthContext.tsx        ← Auth state management
│       │
│       ├── lib/
│       │   ├── firebase.ts            ← Firebase setup
│       │   └── api.ts                 ← API client
│       │
│       └── globals.css                ← Global styles
│
├── 🐍 FLASK BACKEND
│   └── backend/
│       ├── app/
│       │   ├── __init__.py            ← Flask app init
│       │   ├── routes.py              ← 55+ API endpoints
│       │   ├── extensions.py          ← Flask extensions
│       │   ├── schemas.py             ← Validation schemas
│       │   │
│       │   ├── services/              ← 7 business logic services
│       │   │   ├── otp.py             ← OTP generation & sending
│       │   │   ├── firestore.py       ← Database operations
│       │   │   ├── blockchain.py      ← Polygon integration
│       │   │   ├── hashing.py         ← SHA-256 hashing
│       │   │   ├── ipfs.py            ← IPFS pinning
│       │   │   ├── storage.py         ← GCS upload/download
│       │   │   └── notifications.py   ← Email/SMS sending
│       │   │
│       │   └── utils/                 ← Utilities
│       │       ├── auth.py            ← Token & decorators
│       │       ├── validators.py      ← Input validation
│       │       └── firestore_json.py  ← JSON serialization
│       │
│       ├── tests/
│       │   ├── conftest.py
│       │   ├── test_auth.py
│       │   ├── test_blockchain.py
│       │   └── test_tamper.py
│       │
│       ├── config.py                  ← Configuration
│       ├── run.py                     ← Dev server
│       ├── app.py                     ← WSGI entry
│       ├── manage.py                  ← CLI commands
│       ├── gunicorn.conf.py           ← Production config
│       ├── Dockerfile                 ← Container image
│       ├── requirements.txt           ← Python dependencies
│       ├── .env.example               ← Env template
│       └── README.md                  ← Backend docs
│
├── 🔐 FIREBASE & DATABASE
│   ├── firebase.json                  ← Firebase config
│   ├── firestore.rules                ← Security rules
│   └── firestore.indexes.json         ← Database indexes
│
├── ⛓️  BLOCKCHAIN & DOCS
│   ├── docs/
│   │   └── HashAnchor.sol             ← Smart contract
│   ├── api.yaml                       ← API spec
│   └── deployment.md                  ← Architecture guide
│
└── 📝 ROOT CONFIG FILES
    ├── .gitignore                     ← Git ignore
    ├── README.md                      ← Main readme
    └── [vercel.json, etc. at root]
```

---

## How Files Are Organized

### 🎨 Frontend Structure

**Frontend is now at ROOT level (not /frontend)**

```
Root Level:
- package.json
- next.config.js
- tsconfig.json
- tailwind.config.ts
- postcss.config.js
- vercel.json

src/ (Inside root):
- app/         ← All pages and routes
- components/  ← Reusable components
- context/     ← Global state
- lib/         ← Utilities (Firebase, API)
- globals.css  ← Design system
```

**Why?** Vercel expects Next.js at the root level. The `vercel.json` build config points to root.

### 🐍 Backend Structure

**Backend is in /backend (separate folder)**

```
backend/:
- app/         ← Flask application
  - services/  ← Business logic
  - utils/     ← Helpers
  - routes.py  ← All endpoints
- tests/       ← Test suite
- config.py    ← Configuration
- requirements.txt ← Dependencies
- Dockerfile   ← Container
```

**Why?** Monorepo structure allows frontend and backend to exist in one repo.

### 🔐 Shared Configuration

```
Root Level:
- firebase.json          ← Firebase project
- firestore.rules        ← Database security
- firestore.indexes.json ← Query optimization
- docs/HashAnchor.sol    ← Smart contract
```

**Why?** Shared configs that both frontend and backend need.

---

## Key File Locations

### Most Important Files

| Task | File |
|------|------|
| **Understand project** | README.md |
| **Set up locally** | QUICK_START.md |
| **Deploy to production** | SETUP_GUIDE.md |
| **Verify security** | SECURITY_CHECKLIST.md |
| **See all API endpoints** | backend/app/routes.py |
| **Understand design system** | src/globals.css, tailwind.config.ts |
| **Add new API endpoint** | backend/app/routes.py |
| **Add new page** | src/app/[page-name]/page.tsx |
| **Database security** | firestore.rules |
| **Database indexes** | firestore.indexes.json |
| **Smart contract** | docs/HashAnchor.sol |
| **Configure Vercel deploy** | vercel.json |
| **Backend dependencies** | backend/requirements.txt |
| **Frontend dependencies** | package.json (root) |

---

## File Organization by Purpose

### 📚 Documentation (Read These First)
- README.md
- QUICK_START.md
- SETUP_GUIDE.md
- SECURITY_CHECKLIST.md
- FOLDER_STRUCTURE.md (this file)

### 🔧 Configuration (Set These Up)
- .env.example (all variables with examples)
- .env.frontend.example
- backend/.env.example
- package.json (npm dependencies)
- backend/requirements.txt (python dependencies)
- next.config.js (Next.js build settings)
- tailwind.config.ts (design tokens)
- Dockerfile (backend container)
- vercel.json (Vercel deployment)

### 💻 Frontend Code
- src/app/ (all pages)
- src/components/ (UI components)
- src/context/ (state management)
- src/lib/ (utilities)
- src/globals.css (design system)

### 🐍 Backend Code
- backend/app/routes.py (API endpoints)
- backend/app/services/ (business logic)
- backend/app/utils/ (helpers)
- backend/config.py (settings)
- backend/run.py (dev server)
- backend/app.py (production server)

### 🔐 Security & Database
- firestore.rules (access control)
- firestore.indexes.json (performance)
- backend/app/utils/auth.py (authentication)

### ⛓️ Blockchain
- docs/HashAnchor.sol (smart contract)

---

## Files to Edit for Common Tasks

### Add a New Page
1. Create folder: `src/app/[page-name]/`
2. Add file: `page.tsx`
3. Use existing pages as template

### Add an API Endpoint
1. Edit: `backend/app/routes.py`
2. Add function with `@app.route()` decorator
3. Use existing endpoints as template

### Change Design/Colors
1. Edit: `tailwind.config.ts` (update color tokens)
2. Edit: `src/globals.css` (CSS variables)
3. Run: `npm run build` to test

### Add a Dependency
**Frontend:**
```bash
npm install package-name
```

**Backend:**
```bash
pip install package-name
# Edit backend/requirements.txt
pip freeze > backend/requirements.txt
```

### Change Environment Variables
1. Edit: `.env.example` (template)
2. Copy to: `.env` (local)
3. Copy to: Vercel dashboard (production)
4. Copy to: Railway dashboard (backend)

### Deploy to Production
1. Push code to GitHub: `git push`
2. Vercel auto-deploys frontend
3. Railway auto-deploys backend
4. Update Firestore rules: `firebase deploy --only firestore:rules`

---

## Total File Count

| Category | Count |
|----------|-------|
| Documentation | 12 |
| Frontend pages | 8 |
| Frontend components | 2+ |
| Frontend config | 8 |
| Backend routes | 1 |
| Backend services | 7 |
| Backend utils | 3 |
| Backend tests | 4 |
| Backend config | 7 |
| Firebase config | 2 |
| Blockchain | 1 |
| Root config | 5+ |
| **Total** | **~100** |

---

## Memory & Download Size

| Component | Size |
|-----------|------|
| Documentation | ~100 KB |
| Frontend (with node_modules) | ~500 MB* |
| Backend (with venv) | ~300 MB* |
| Source code only | ~500 KB |
| **Without dependencies** | ~600 KB |

*Don't commit node_modules or venv to Git. They're generated from package.json/requirements.txt.

---

## Typical Development Workflow

```
1. Clone from GitHub
   git clone https://github.com/you/medivault-production

2. Install dependencies
   npm install
   cd backend && pip install -r requirements.txt

3. Set up .env files
   cp .env.example .env
   cp .env.frontend.example .env.local
   # Fill in values from Firebase, Twilio, etc.

4. Run locally
   # Terminal 1:
   cd backend && python run.py
   
   # Terminal 2:
   npm run dev

5. Open browser
   http://localhost:3000

6. Make changes to code
   # Frontend changes auto-reload
   # Backend changes auto-reload

7. Test before pushing
   cd backend && python -m pytest
   npm run build

8. Push to GitHub
   git add .
   git commit -m "My changes"
   git push

9. Vercel & Railway auto-deploy!
```

---

## Need to Find Something?

**By Purpose:**
- Architecture → PROJECT_STRUCTURE.md
- Deployment → SETUP_GUIDE.md
- Security → SECURITY_CHECKLIST.md
- Files → COMPLETE_FILE_TREE.txt

**By Component:**
- Frontend pages → src/app/
- API endpoints → backend/app/routes.py
- Business logic → backend/app/services/
- Database → firestore.rules

**By Task:**
- Add page → FOLDER_STRUCTURE.md (this file) → "Add a New Page"
- Debug → backend logs or browser console
- Deploy → SETUP_GUIDE.md → Part 5-6

---

## Deployment Checklist

Before deploying:

- [ ] All files organized as shown in this structure
- [ ] No hardcoded secrets in any file (use .env only)
- [ ] Dependencies installed (npm, pip)
- [ ] Tests pass locally
- [ ] .env files configured with real values
- [ ] Firebase project created
- [ ] Twilio, SendGrid, Alchemy, Infura accounts created
- [ ] Smart contract deployed
- [ ] Firestore rules deployed
- [ ] Code pushed to GitHub
- [ ] Vercel connected to GitHub
- [ ] Railway connected to GitHub
- [ ] Environment variables set in Vercel
- [ ] Environment variables set in Railway

✅ Then deploy and celebrate!

---

**Questions?** Check DOCS_INDEX.md for navigation to specific topics.
