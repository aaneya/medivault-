from unittest.mock import MagicMock, patch

import pytest

from config import TestingConfig


@pytest.fixture
def app_ctx():
    from flask import Flask

    app = Flask(__name__)
    app.config.from_object(TestingConfig)
    with app.app_context():
        yield app


def test_verify_returns_false_without_contract(app_ctx):
    from app.services import blockchain as bc

    app_ctx.config["CONTRACT_ADDRESS"] = ""
    assert bc.verify_on_chain("a" * 64) is False


@patch("app.services.blockchain._w3")
def test_verify_on_chain_true(mock_w3, app_ctx):
    from app.services import blockchain as bc

    app_ctx.config["CONTRACT_ADDRESS"] = "0x" + "1" * 40
    w3 = MagicMock()
    w3.is_connected.return_value = True
    w3.eth.call.return_value = (1).to_bytes(32, "big")
    mock_w3.return_value = w3

    assert bc.verify_on_chain("a" * 64) is True
