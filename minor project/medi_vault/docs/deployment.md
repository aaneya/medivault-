# Deployment notes

## Firebase

1. Enable **Firestore**, **Authentication** (Email/Password), and **Storage**.
2. Deploy security rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

(`firebase.json` points `firestore.rules` and `firestore.indexes.json` at the project root.)

3. If the console prompts for missing composite indexes, deploy `firestore.indexes.json` and wait until indexes finish building.

## Cloud Storage paths

- Medical records: `medical-files/{patientUid}/{recordId}/{filename}`
- Onboarding: `onboarding/{uid}/license.{ext}`, `id.{ext}`, `selfie.jpg`

Service accounts used for signed URLs must have permission to sign blobs (typically the default Firebase Admin service account).

## Gunicorn (Docker / Cloud Run)

The `Dockerfile` runs:

```bash
gunicorn -c gunicorn.conf.py run:app
```

Tune `gunicorn.conf.py` for CPU/memory. `timeout` is set to **120s** to cover IPFS/blockchain work.

## Cloud Run (example)

Build and push an image, then deploy (adjust project/region):

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/medivault

gcloud run deploy medivault \
  --image gcr.io/PROJECT_ID/medivault \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-secrets="FIREBASE_CREDENTIALS=firebase-sa:latest" \
  --min-instances=1 \
  --memory=512Mi \
  --port=8080
```

Set environment variables (including `SECRET_KEY`, Firebase web config, `RATELIMIT_STORAGE_URI` pointing at **Redis** if using Flask-Limiter with Redis in production).

## Flask session + HTTPS

`POST /api/auth/session` sets a Flask session after verifying a Firebase ID token (used by `/dashboard` HTML routing). Use **HTTPS** in production (`Flask-Talisman` is enabled in `ProductionConfig`).

## Frontend

- Static Jinja pages can be served by Flask during development.
- For production, you can host static assets on **Firebase Hosting** and point API calls to the Cloud Run URL.

## Contract

Deploy `docs/HashAnchor.sol` to Polygon Mumbai, set `CONTRACT_ADDRESS` and `OWNER_PRIVATE_KEY` (fund the owner with test MATIC). Without a deployed contract, verification skips on-chain checks when `CONTRACT_ADDRESS` is empty.
