from functools import wraps
from typing import Any

import firebase_admin.auth as fb_auth
from flask import current_app, g, jsonify, request


def merge_custom_claims(uid: str, **updates: Any) -> None:
    user = fb_auth.get_user(uid)
    claims = dict(user.custom_claims or {})
    claims.update(updates)
    fb_auth.set_custom_user_claims(uid, claims)


def _doctor_onboarding_gate():
    from app.services import firestore as fs

    doc = fs.get_doctor(g.uid)
    if doc and doc.get("isVerified"):
        return None
    sub = fs.get_onboarding_submission(g.uid)
    if not sub:
        return jsonify({"error": "onboarding_incomplete"}), 403
    st = sub.get("reviewStatus")
    if st == "pending":
        return jsonify({"error": "onboarding_pending"}), 403
    if st == "rejected":
        return jsonify(
            {
                "error": "onboarding_rejected",
                "rejectionReason": sub.get("rejectionReason"),
            }
        ), 403
    if st == "approved":
        return jsonify({"error": "onboarding_incomplete"}), 403
    return jsonify({"error": "onboarding_incomplete"}), 403


def require_verified_doctor(f):
    """Block unverified doctors from patient-facing record APIs."""

    @wraps(f)
    def decorated(*args, **kwargs):
        if getattr(g, "role", None) != "doctor":
            return f(*args, **kwargs)
        if getattr(g, "_doctor_gate_ok", False):
            return f(*args, **kwargs)
        err = _doctor_onboarding_gate()
        if err is not None:
            return err
        g._doctor_gate_ok = True
        return f(*args, **kwargs)

    return decorated


def verify_firebase_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        token = auth_header[7:].strip()
        if not token:
            return jsonify({"error": "Empty bearer token"}), 401
        try:
            decoded = fb_auth.verify_id_token(
                token,
                check_revoked=current_app.config.get("FLASK_ENV") == "production",
            )
        except Exception as e:
            return jsonify({"error": "Invalid or expired token", "detail": str(e)}), 401
        g.uid = decoded["uid"]
        g.email = decoded.get("email")
        g.role = decoded.get("role")
        if not g.role:
            user = fb_auth.get_user(g.uid)
            g.role = (user.custom_claims or {}).get("role", "patient")
        return f(*args, **kwargs)

    return decorated


def require_role(*roles):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if getattr(g, "role", None) not in roles:
                return jsonify({"error": "Forbidden", "allowed": list(roles)}), 403
            return f(*args, **kwargs)

        return wrapped

    return decorator


def set_custom_claims(uid: str, role: str) -> None:
    fb_auth.set_custom_user_claims(uid, {"role": role})
