# Backend - MediVault

This folder contains the Flask-based backend application for MediVault, a healthcare records management system with blockchain security.

## Structure

```
backend/
├── app/                      # Main application package
│   ├── __init__.py          # Flask app initialization
│   ├── extensions.py        # Flask extensions (DB, auth, etc.)
│   ├── routes.py            # API routes and views
│   ├── schemas.py           # Data validation schemas
│   ├── services/            # Business logic services
│   │   ├── blockchain.py    # Blockchain operations
│   │   ├── firestore.py     # Firestore database operations
│   │   ├── hashing.py       # Cryptographic hashing
│   │   ├── ipfs.py          # IPFS integration
│   │   ├── notifications.py # Notification services
│   │   └── storage.py       # File storage operations
│   └── utils/               # Utility functions
│       ├── auth.py          # Authentication utilities
│       ├── validators.py    # Input validation
│       └── firestore_json.py # Firestore JSON utilities
├── templates/               # Jinja2 HTML templates (served by Flask)
├── config.py                # Configuration settings
├── run.py                   # Application entry point
├── app.py                   # Alternative app file
├── manage.py                # Database/management commands
├── gunicorn.conf.py         # Gunicorn production configuration
├── tests/                   # Unit and integration tests
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
└── README.md               # This file
```

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables (see `.env.example`)

3. Run the development server:
   ```bash
   python run.py
   ```

## Running Tests

```bash
pytest tests/
```

## Deployment

See production deployment configuration in `gunicorn.conf.py` and root-level Firebase configuration.

## API Documentation

See `docs/api.yaml` in the root docs folder.
