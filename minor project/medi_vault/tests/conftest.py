import os

os.environ.setdefault("FLASK_ENV", "testing")

import pytest

from app import create_app


@pytest.fixture
def app():
    return create_app("testing")


@pytest.fixture
def client(app):
    return app.test_client()
