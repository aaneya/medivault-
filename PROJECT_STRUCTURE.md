# MediVault - Project Structure

This document describes the reorganized folder structure for the MediVault application.

## Overview

The project has been reorganized into separate backend and frontend folders for better maintainability and scalability:

```
medivault-/
├── backend/                 # Flask backend application
│   ├── app/                # Main application package
│   ├── templates/          # Jinja2 HTML templates
│   ├── tests/              # Unit and integration tests
│   ├── config.py           # Configuration management
│   ├── run.py              # Development server entry point
│   ├── app.py              # WSGI entry point
│   ├── manage.py           # Management commands
│   ├── gunicorn.conf.py    # Production server config
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Docker configuration
│   └── README.md           # Backend documentation
│
├── frontend/               # Frontend static assets
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript modules
│   ├── uploads/           # User-uploaded files
│   └── README.md          # Frontend documentation
│
├── docs/                   # Documentation and smart contracts
│   ├── HashAnchor.sol     # Blockchain smart contract
│   └── [other docs]
│
├── firebase.json           # Firebase configuration
├── firestore.indexes.json # Firestore index definitions
├── firestore.rules        # Firestore security rules
├── PROJECT_STRUCTURE.md   # This file
└── README.md              # Main project README
```

## Folder Descriptions

### Backend (`/backend`)
Contains the Flask-based REST API and web application logic. The Flask app serves HTML templates and static assets from the frontend directory.

- **app/** - Core application logic with services, utilities, and routes
- **templates/** - Jinja2 templates served by Flask
- **tests/** - Automated tests for the backend
- **config.py** - Environment-based configuration management
- **requirements.txt** - Python package dependencies

See `/backend/README.md` for detailed backend documentation.

### Frontend (`/frontend`)
Contains static CSS and JavaScript files served by the Flask backend.

- **css/** - Stylesheet for the application UI
- **js/** - JavaScript modules for different pages and features
- **uploads/** - Directory for user-uploaded medical records and documents

See `/frontend/README.md` for detailed frontend documentation.

### Documentation (`/docs`)
Project documentation and smart contracts for blockchain integration.

- **HashAnchor.sol** - Solidity smart contract for blockchain hashing
- Other documentation files

### Configuration Files (Root Level)
- **firebase.json** - Firebase CLI configuration
- **firestore.indexes.json** - Firestore composite index definitions
- **firestore.rules** - Firestore security and validation rules

## Running the Application

### Development

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask development server:
   ```bash
   python run.py
   ```

   The application will be available at `http://localhost:5000`

### Production

See the Docker configuration in `/backend/Dockerfile` for container-based deployment.

## Key Notes

- **Templates** are stored in `/backend/templates` because Flask requires templates to be in the application directory for Jinja2 rendering to work correctly.
- **Static assets** (CSS/JS) are stored in `/frontend` and configured to be served by Flask via the `static_folder` setting pointing to `../frontend`.
- **Configuration files** for Firebase are kept at the root level as they are shared configuration used by both frontend and backend.
- Both `/backend` and `/frontend` have their own `README.md` files with detailed documentation specific to each component.

## Related Files
- Backend documentation: `/backend/README.md`
- Frontend documentation: `/frontend/README.md`
- API documentation: `/docs/api.yaml`
- Smart contract: `/docs/HashAnchor.sol`
