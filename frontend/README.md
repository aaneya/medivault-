# Frontend - MediVault

This folder contains the frontend assets (CSS and JavaScript) for MediVault, served by the Flask backend application.

## Structure

```
frontend/
├── css/                     # Stylesheets
│   └── style.css           # Main stylesheet
├── js/                      # JavaScript files
│   ├── app.js              # Core application logic
│   ├── admin_onboarding.js # Admin onboarding flow
│   ├── doctor_onboarding.js # Doctor onboarding flow
│   ├── doctor.js           # Doctor dashboard functionality
│   ├── patient.js          # Patient dashboard functionality
│   └── charts.js           # Chart and visualization logic
├── uploads/                 # User-uploaded files directory
└── README.md               # This file
```

## Files Explanation

- **style.css** - Contains all styling for the application including layouts, colors, and responsive design
- **app.js** - Main application logic, handles routing and general functionality
- **admin_onboarding.js** - Logic for the admin user onboarding process
- **doctor_onboarding.js** - Logic for doctor user onboarding and registration
- **doctor.js** - Doctor dashboard features and patient record management
- **patient.js** - Patient dashboard for viewing medical records
- **charts.js** - Data visualization and charting functionality

## Static Asset Serving

These assets are served by the Flask backend from the `/static` route. The Flask app is configured to serve files from this directory at:
- CSS: `/static/css/style.css`
- JavaScript: `/static/js/*.js`

## Development Notes

- All styles should be added to `style.css`
- JavaScript modules should follow the existing pattern for consistency
- Uploaded files are stored in the `uploads/` directory
