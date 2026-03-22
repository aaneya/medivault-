# MediVault

Blockchain-anchored medical record metadata with **Firebase** (Firestore, Cloud Storage, Auth), **Flask** middleware, optional **Polygon Mumbai** anchoring, **Infura IPFS**, and **SendGrid** notifications.

## Prerequisites

- Python 3.11+
- Firebase project with Firestore, Authentication, and Storage enabled
- Service account JSON with Firestore + Storage access (download from Firebase Console → Project settings → Service accounts)

## Setup

1. Copy `.env.example` to `.env` and set variables (especially `FIREBASE_SERVICE_ACCOUNT_PATH`, bucket, and API keys for the web client).

2. Place your Firebase service account file at the path in `FIREBASE_SERVICE_ACCOUNT_PATH`.

3. Install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

4. Deploy Firestore rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

See `docs/deployment.md` for Cloud Run / Gunicorn.

5. Run the API:

```bash
set FLASK_ENV=development
python run.py
```

Open `http://127.0.0.1:5000/login`. The UI uses the Firebase JS SDK; the Flask API expects `Authorization: Bearer <Firebase ID token>`.

## Auth flow

- **Register**: `POST /api/auth/register` (server creates Firebase user, sets custom claim `role`, writes Firestore `users` + profile).
- **Login**: Clients sign in with the Firebase SDK; Flask does **not** mint tokens—only verifies them.

## Access requests

Access grant documents use ID `doctorUid_patientUid` so Firestore rules and queries stay aligned. Approve or deny via `PATCH /api/access-requests/<req_id>`.

## Tests

```bash
set FLASK_ENV=testing
python -m pytest
```

Tests use `TestingConfig` (no real Firebase init).

## Layout

- `app/services/firestore.py` — all Firestore access (batch `get_all` for record batches).
- `app/services/storage.py` — private uploads and signed URLs.
- `app/utils/auth.py` — ID token verification and role checks.
- `docs/HashAnchor.sol` — minimal anchor contract for Polygon Mumbai.

See `docs/api.yaml` for HTTP surface and `docs/deployment.md` for Cloud Run / Firebase Hosting notes.
