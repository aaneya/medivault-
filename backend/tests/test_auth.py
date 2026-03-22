from unittest.mock import patch

from firebase_admin import auth as fb_auth


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.get_json().get("status") == "ok"


def test_records_requires_token(client):
    r = client.get("/api/records")
    assert r.status_code == 401


@patch("app.routes.fs.list_records_for_patient", return_value=[])
@patch.object(fb_auth, "verify_id_token", return_value={"uid": "u1", "role": "patient"})
def test_records_with_bearer(mock_verify, mock_list, client):
    r = client.get("/api/records", headers={"Authorization": "Bearer fake"})
    assert r.status_code == 200
    assert r.get_json().get("records") == []
