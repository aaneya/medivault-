import firebase_admin
from firebase_admin import credentials, firestore, storage
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman

talisman = Talisman()
limiter = Limiter(key_func=get_remote_address)


def _parse_default_limits(app):
    raw = app.config.get("RATELIMIT_DEFAULT") or ""
    parts = [p.strip() for p in raw.split(";") if p.strip()]
    return parts


def init_extensions(app):
    if app.config.get("TESTING"):
        from unittest.mock import MagicMock

        app.db = MagicMock()
        app.bucket = MagicMock()
        limiter.init_app(
            app,
            storage_uri="memory://",
            enabled=False,
        )
        return

    cred_path = app.config["FIREBASE_SERVICE_ACCOUNT_PATH"]
    cred = credentials.Certificate(cred_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(
            cred,
            {"storageBucket": app.config["FIREBASE_STORAGE_BUCKET"]},
        )
    app.db = firestore.client()
    app.bucket = storage.bucket(app.config["FIREBASE_STORAGE_BUCKET"])

    enabled = bool(app.config.get("RATELIMIT_ENABLED", True))
    limiter.init_app(
        app,
        storage_uri=app.config.get("RATELIMIT_STORAGE_URI", "memory://"),
        default_limits=_parse_default_limits(app),
        headers_enabled=app.config.get("RATELIMIT_HEADERS_ENABLED", True),
        enabled=enabled,
    )

    if app.config.get("TALISMAN_ENABLED"):
        talisman.init_app(
            app,
            force_https=app.config.get("TALISMAN_FORCE_HTTPS", False),
            content_security_policy=app.config.get("TALISMAN_CONTENT_SECURITY_POLICY"),
            strict_transport_security=app.config.get("TALISMAN_STRICT_TRANSPORT", False),
        )
