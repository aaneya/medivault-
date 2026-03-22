import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-change-me")
    FLASK_ENV = os.environ.get("FLASK_ENV", "development")

    FIREBASE_SERVICE_ACCOUNT_PATH = os.environ.get(
        "FIREBASE_SERVICE_ACCOUNT_PATH",
        str(BASE_DIR / "firebase-service-account.json"),
    )
    FIREBASE_API_KEY = os.environ.get("FIREBASE_API_KEY", "")
    FIREBASE_AUTH_DOMAIN = os.environ.get("FIREBASE_AUTH_DOMAIN", "")
    FIREBASE_PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "")
    FIREBASE_STORAGE_BUCKET = os.environ.get("FIREBASE_STORAGE_BUCKET", "")

    ALCHEMY_KEY = os.environ.get("ALCHEMY_KEY", "")
    POLYGON_RPC_URL = os.environ.get(
        "POLYGON_RPC_URL",
        "",
    )
    INFURA_PROJECT_ID = os.environ.get("INFURA_PROJECT_ID", "")
    INFURA_PROJECT_SECRET = os.environ.get("INFURA_PROJECT_SECRET", "")
    SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY", "")
    SENDGRID_FROM_EMAIL = os.environ.get("SENDGRID_FROM_EMAIL", "")
    ADMIN_NOTIFY_EMAIL = os.environ.get("ADMIN_NOTIFY_EMAIL", "")

    CONTRACT_ADDRESS = os.environ.get("CONTRACT_ADDRESS", "")
    OWNER_PRIVATE_KEY = os.environ.get("OWNER_PRIVATE_KEY", "")

    MAX_UPLOAD_BYTES = 50 * 1024 * 1024  # 50 MB
    ONBOARDING_MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5 MB
    SIGNED_URL_EXPIRY_MINUTES = 60

    TALISMAN_ENABLED = False
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URI = os.environ.get("RATELIMIT_STORAGE_URI", "memory://")
    RATELIMIT_DEFAULT = "200 per day;50 per hour"
    RATELIMIT_HEADERS_ENABLED = True


class DevelopmentConfig(Config):
    DEBUG = True
    TALISMAN_ENABLED = False
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URI = os.environ.get("RATELIMIT_STORAGE_URI", "memory://")


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    TALISMAN_ENABLED = True
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URI = os.environ.get("RATELIMIT_STORAGE_URI", "redis://localhost:6379")

    TALISMAN_FORCE_HTTPS = True
    TALISMAN_STRICT_TRANSPORT = True
    TALISMAN_CONTENT_SECURITY_POLICY = {
        "default-src": "'self'",
        "script-src": [
            "'self'",
            "https://www.gstatic.com",
            "https://cdn.jsdelivr.net",
        ],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https://storage.googleapis.com"],
        "connect-src": [
            "'self'",
            "https://identitytoolkit.googleapis.com",
            "https://securetoken.googleapis.com",
        ],
    }


class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    TALISMAN_ENABLED = False
    RATELIMIT_ENABLED = False


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig,
}


def get_config(name=None):
    if name is None:
        name = os.environ.get("FLASK_ENV", "development")
    return config_by_name.get(name, DevelopmentConfig)
