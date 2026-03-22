import os

from flask import Flask

from config import get_config
from app.extensions import init_extensions
from app.routes import bp as api_bp


def create_app(config_name=None):
    app = Flask(
        __name__,
        template_folder="../templates",
        static_folder="../static",
    )
    cfg = get_config(config_name or os.environ.get("FLASK_ENV", "development"))
    app.config.from_object(cfg)

    init_extensions(app)
    app.register_blueprint(api_bp)

    @app.context_processor
    def inject_firebase():
        return {
            "config": {
                "FIREBASE_API_KEY": app.config.get("FIREBASE_API_KEY", ""),
                "FIREBASE_AUTH_DOMAIN": app.config.get("FIREBASE_AUTH_DOMAIN", ""),
                "FIREBASE_PROJECT_ID": app.config.get("FIREBASE_PROJECT_ID", ""),
                "FIREBASE_STORAGE_BUCKET": app.config.get("FIREBASE_STORAGE_BUCKET", ""),
            }
        }

    return app
