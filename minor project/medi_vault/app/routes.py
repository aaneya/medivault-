from __future__ import annotations

import threading
from datetime import datetime, timezone

from flask import (
    Blueprint,
    current_app,
    g,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

from app.extensions import limiter
from app.services import firestore as fs
from app.services.blockchain import anchor_hash_to_polygon, verify_on_chain
from app.services.hashing import hash_file
from app.services.ipfs import upload_to_ipfs
from app.services.notifications import (
    notify_admin_new_doctor_onboarding,
    notify_doctor_onboarding_approved,
    notify_doctor_onboarding_rejected,
    notify_patient_record_uploaded,
)
from app.services.storage import (
    download_file,
    generate_signed_url,
    upload_medical_file,
    upload_onboarding_file,
)
from app.utils.auth import (
    merge_custom_claims,
    require_role,
    require_verified_doctor,
    set_custom_claims,
    verify_firebase_token,
)
from app.utils.firestore_json import firestore_to_json
from app.utils.validators import (
    ext_from_filename,
    file_type_from_ext,
    validate_onboarding_upload,
    validate_upload_bytes,
)
from google.cloud.firestore import SERVER_TIMESTAMP

import firebase_admin.auth as fb_auth

bp = Blueprint("main", __name__)


def _j(data):
    return jsonify(firestore_to_json(data))


def _client_ip() -> str | None:
    xff = request.headers.get("X-Forwarded-For")
    if xff:
        return xff.split(",")[0].strip()
    return request.remote_addr


def _run_post_upload_tasks(record_id: str, log_id: str, sha256: str, file_bytes: bytes, filename: str):
    app = current_app._get_current_object()

    def job():
        with app.app_context():
            cid = upload_to_ipfs(file_bytes, filename)
            if cid:
                fs.update_record_ipfs(record_id, cid)
            result = anchor_hash_to_polygon(sha256)
            if result:
                fs.update_anchor_status(
                    record_id,
                    log_id,
                    result["tx_hash"],
                    int(result["block_number"]),
                )
            else:
                fs.update_hash_log_failed(record_id, log_id)

    threading.Thread(target=job, daemon=True).start()


# --- Pages ---


@bp.route("/")
def index():
    return render_template("login.html")


@bp.route("/login")
def login_page():
    return render_template("login.html")


@bp.route("/patient")
def patient_dashboard():
    return render_template("patient_dashboard.html")


@bp.route("/doctor")
def doctor_dashboard():
    return render_template("doctor_dashboard.html")


@bp.route("/onboarding")
def onboarding_page():
    uid = session.get("uid")
    role = session.get("role")
    if not uid or role != "doctor":
        return redirect(url_for("main.login_page"))
    return render_template("doctor_onboarding.html")


@bp.route("/admin/onboarding")
def admin_onboarding_page():
    uid = session.get("uid")
    role = session.get("role")
    if not uid or role != "admin":
        return redirect(url_for("main.login_page"))
    return render_template("admin_onboarding.html")


@bp.route("/dashboard")
def dashboard():
    uid = session.get("uid")
    role = session.get("role")
    if not uid:
        return redirect(url_for("main.login_page"))
    if role == "doctor":
        doc = fs.get_doctor(uid)
        if doc and doc.get("isVerified"):
            return render_template("doctor_dashboard.html")
        sub = fs.get_onboarding_submission(uid)
        if not sub:
            return redirect(url_for("main.onboarding_page"))
        st = sub.get("reviewStatus")
        if st == "pending":
            return render_template("onboarding_pending.html")
        if st == "rejected":
            return render_template(
                "onboarding_rejected.html",
                reason=sub.get("rejectionReason") or "",
            )
        if st == "approved" and doc and doc.get("isVerified"):
            return render_template("doctor_dashboard.html")
        return redirect(url_for("main.onboarding_page"))
    if role == "patient":
        return render_template("patient_dashboard.html")
    if role == "admin":
        return render_template("admin_onboarding.html")
    return redirect(url_for("main.login_page"))


# --- Auth API ---


@bp.route("/api/auth/session", methods=["POST"])
def establish_session():
    data = request.get_json(silent=True) or {}
    token = data.get("idToken")
    if not token:
        return jsonify({"error": "idToken required"}), 400
    try:
        decoded = fb_auth.verify_id_token(token)
    except Exception as e:
        return jsonify({"error": str(e)}), 401
    uid = decoded["uid"]
    user = fb_auth.get_user(uid)
    role = (user.custom_claims or {}).get("role", "patient")
    session["uid"] = uid
    session["role"] = role
    session["email"] = user.email or ""
    return jsonify({"ok": True})


@bp.route("/api/auth/register", methods=["POST"])
@limiter.limit("10 per hour")
def register():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "patient")
    display_name = data.get("displayName", "")
    if not email or not password:
        return jsonify({"error": "email and password required"}), 400
    if role not in ("patient", "doctor", "admin"):
        return jsonify({"error": "invalid role"}), 400
    try:
        user = fb_auth.create_user(email=email, password=password, display_name=display_name)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    uid = user.uid
    set_custom_claims(uid, role)
    fs.create_user_doc(uid, email, role, display_name)
    if role == "patient":
        fs.create_patient_profile(
            uid,
            {
                "fullName": data.get("fullName", display_name),
                "dob": data.get("dob", ""),
                "bloodType": data.get("bloodType", ""),
                "emergencyContact": data.get("emergencyContact") or {"name": "", "phone": ""},
                "walletAddress": data.get("walletAddress"),
                "hospitalId": data.get("hospitalId", ""),
            },
        )
    elif role == "doctor":
        fs.create_doctor_profile(
            uid,
            {
                "fullName": data.get("fullName", display_name),
                "licenseNumber": data.get("licenseNumber", ""),
                "specialty": data.get("specialty", ""),
                "hospital": data.get("hospital", ""),
                "isVerified": False,
                "publicKey": data.get("publicKey"),
                "verifiedAt": None,
            },
        )
    return jsonify({"uid": uid, "message": "Registered. Sign in with Firebase client SDK."})


@bp.route("/api/auth/login", methods=["POST"])
def login_api():
    return jsonify(
        {
            "message": "Use Firebase client SDK to sign in and send ID token in Authorization header.",
        }
    )


# --- Onboarding API ---


@bp.route("/api/onboarding/upload-doc", methods=["POST"])
@verify_firebase_token
@require_role("doctor")
def onboarding_upload_doc():
    if "file" not in request.files:
        return jsonify({"error": "file required"}), 400
    doc_type = request.form.get("docType", "")
    if doc_type not in ("license", "id", "selfie"):
        return jsonify({"error": "docType must be license, id, or selfie"}), 400
    f = request.files["file"]
    if not f.filename:
        return jsonify({"error": "empty filename"}), 400
    data = f.read()
    ok, err = validate_onboarding_upload(f.filename, data)
    if not ok:
        return jsonify({"error": err}), 400
    storage_ref = upload_onboarding_file(data, g.uid, doc_type, f.filename)
    return jsonify({"storageRef": storage_ref})


@bp.route("/api/onboarding/submit", methods=["POST"])
@verify_firebase_token
@require_role("doctor")
def onboarding_submit():
    data = request.get_json(silent=True) or {}
    required = [
        "fullName",
        "licenseNumber",
        "specialty",
        "hospital",
        "hospitalAddress",
        "hospitalPhone",
        "yearsExperience",
        "licenseDocRef",
        "idDocRef",
        "selfieRef",
    ]
    for k in required:
        if data.get(k) in (None, ""):
            return jsonify({"error": f"missing field: {k}"}), 400
    try:
        years = int(data["yearsExperience"])
    except (TypeError, ValueError):
        return jsonify({"error": "yearsExperience must be int"}), 400
    payload = {
        "fullName": data["fullName"],
        "licenseNumber": data["licenseNumber"],
        "specialty": data["specialty"],
        "hospital": data["hospital"],
        "hospitalAddress": data["hospitalAddress"],
        "hospitalPhone": data["hospitalPhone"],
        "yearsExperience": years,
        "licenseDocRef": data["licenseDocRef"],
        "idDocRef": data["idDocRef"],
        "selfieRef": data["selfieRef"],
    }
    fs.create_onboarding_submission(g.uid, payload)
    fs.mark_doctor_submitted_onboarding(g.uid)
    notify_admin_new_doctor_onboarding(g.uid)
    fs.write_audit_log(g.uid, "doctor", "upload", g.uid, "user", _client_ip())
    return jsonify({"status": "pending"})


@bp.route("/api/onboarding/status", methods=["GET"])
@verify_firebase_token
@require_role("doctor")
def onboarding_status():
    sub = fs.get_onboarding_submission(g.uid)
    if not sub:
        return jsonify({"reviewStatus": None, "submittedAt": None, "rejectionReason": None})
    return _j(
        {
            "reviewStatus": sub.get("reviewStatus"),
            "submittedAt": sub.get("submittedAt"),
            "rejectionReason": sub.get("rejectionReason"),
        }
    )


@bp.route("/api/admin/onboarding/pending", methods=["GET"])
@verify_firebase_token
@require_role("admin")
def admin_onboarding_pending():
    items = fs.list_pending_onboarding()
    out = []
    for row in items:
        uid = row.get("uid") or row.get("id")
        entry = firestore_to_json(row)
        for key in ("licenseDocRef", "idDocRef", "selfieRef"):
            ref = row.get(key)
            if ref:
                try:
                    entry[f"{key}_url"] = generate_signed_url(ref)
                except Exception:
                    entry[f"{key}_url"] = None
            else:
                entry[f"{key}_url"] = None
        entry["uid"] = uid
        out.append(entry)
    return jsonify({"submissions": out})


@bp.route("/api/admin/onboarding/<uid>/review", methods=["PATCH"])
@verify_firebase_token
@require_role("admin")
def admin_onboarding_review(uid: str):
    data = request.get_json(silent=True) or {}
    action = data.get("action")
    if action not in ("approve", "reject"):
        return jsonify({"error": "action must be approve or reject"}), 400
    sub = fs.get_onboarding_submission(uid)
    if not sub:
        return jsonify({"error": "Not found"}), 404
    user = fs.get_user(uid)
    email = (user or {}).get("email")
    if action == "approve":
        fs.approve_onboarding(uid, g.uid)
        merge_custom_claims(uid, isVerified=True)
        if email:
            notify_doctor_onboarding_approved(email)
        fs.write_audit_log(g.uid, "admin", "approve", uid, "user", _client_ip())
        return jsonify({"status": "approved"})
    reason = data.get("rejectionReason") or "No reason provided"
    fs.reject_onboarding(uid, g.uid, reason)
    if email:
        notify_doctor_onboarding_rejected(email, reason)
    fs.write_audit_log(g.uid, "admin", "deny", uid, "user", _client_ip())
    return jsonify({"status": "rejected"})


# --- Records ---


@bp.route("/api/records/upload", methods=["POST"])
@limiter.limit("30 per hour")
@verify_firebase_token
@require_role("doctor", "patient", "admin")
@require_verified_doctor
def upload_record():
    if "file" not in request.files:
        return jsonify({"error": "file required"}), 400
    f = request.files["file"]
    if not f.filename:
        return jsonify({"error": "empty filename"}), 400
    title = request.form.get("title", f.filename)
    description = request.form.get("description", "")
    patient_id = request.form.get("patientId") or g.uid

    if g.role == "patient" and patient_id != g.uid:
        return jsonify({"error": "patients may only upload to their own profile"}), 403
    if g.role == "doctor" and not patient_id:
        return jsonify({"error": "patientId required for doctor uploads"}), 400

    data = f.read()
    ok, err = validate_upload_bytes(f.filename, data)
    if not ok:
        return jsonify({"error": err}), 400

    sha256 = hash_file(data)
    ext = ext_from_filename(f.filename)
    file_type = file_type_from_ext(ext)

    record_id = fs.allocate_record_id()
    storage_ref = upload_medical_file(data, patient_id, record_id, f.filename)

    uploader = g.uid
    fs.create_record_with_id(
        record_id,
        {
            "patientId": patient_id,
            "uploadedBy": uploader,
            "title": title,
            "description": description,
            "fileType": file_type,
            "storageRef": storage_ref,
            "ipfsCid": None,
            "sha256Hash": sha256,
            "isTampered": False,
            "fileSizeBytes": len(data),
            "isDeleted": False,
        },
    )

    log_id = fs.add_hash_log(
        record_id,
        {
            "sha256Hash": sha256,
            "txHash": "",
            "blockNumber": 0,
            "anchorStatus": "pending",
            "anchoredAt": SERVER_TIMESTAMP,
            "network": "polygon_mumbai",
        },
    )

    _run_post_upload_tasks(record_id, log_id, sha256, data, f.filename)

    if g.role == "doctor":
        pu = fs.get_user(patient_id)
        if pu and pu.get("email"):
            notify_patient_record_uploaded(pu["email"], title)

    fs.write_audit_log(g.uid, g.role, "upload", record_id, "record", _client_ip())

    return jsonify(
        {
            "record_id": record_id,
            "sha256_hash": sha256,
            "storage_ref": storage_ref,
            "ipfs_cid": None,
        }
    )


@bp.route("/api/records", methods=["GET"])
@verify_firebase_token
@require_verified_doctor
def list_records():
    if g.role == "patient":
        items = fs.list_records_for_patient(g.uid)
    elif g.role == "doctor":
        items = fs.list_records_for_doctor(g.uid)
    elif g.role == "admin":
        items = fs.list_all_records(include_deleted=False)
    else:
        return jsonify({"error": "Forbidden"}), 403
    return _j({"records": items})


@bp.route("/api/records/<record_id>", methods=["GET"])
@verify_firebase_token
@require_verified_doctor
def get_record(record_id: str):
    rec = fs.get_record(record_id)
    if not rec:
        return jsonify({"error": "Not found"}), 404
    if not fs.can_read_record(g.uid, g.role, rec):
        return jsonify({"error": "Forbidden"}), 403
    fs.write_audit_log(g.uid, g.role, "view", record_id, "record", _client_ip())
    return _j(rec)


@bp.route("/api/records/<record_id>/signed-url", methods=["GET"])
@verify_firebase_token
@require_verified_doctor
def record_signed_url(record_id: str):
    rec = fs.get_record(record_id)
    if not rec:
        return jsonify({"error": "Not found"}), 404
    if not fs.can_read_record(g.uid, g.role, rec):
        return jsonify({"error": "Forbidden"}), 403
    ref = rec.get("storageRef")
    if not ref:
        return jsonify({"error": "No storage reference"}), 400
    url = generate_signed_url(ref)
    fs.write_audit_log(g.uid, g.role, "view", record_id, "record", _client_ip())
    return jsonify({"url": url, "expires_in_minutes": current_app.config.get("SIGNED_URL_EXPIRY_MINUTES", 60)})


@bp.route("/api/records/<record_id>/verify", methods=["GET"])
@limiter.limit("60 per hour")
@verify_firebase_token
@require_verified_doctor
def verify_record(record_id: str):
    rec = fs.get_record(record_id)
    if not rec:
        return jsonify({"error": "Not found"}), 404
    if not fs.can_read_record(g.uid, g.role, rec):
        return jsonify({"error": "Forbidden"}), 403
    ref = rec.get("storageRef")
    if not ref:
        return jsonify({"error": "No file"}), 400
    file_bytes = download_file(ref)
    computed = hash_file(file_bytes)
    stored = rec.get("sha256Hash", "")
    log = fs.get_latest_hash_log(record_id)
    stored_log = (log or {}).get("sha256Hash", stored)
    if current_app.config.get("CONTRACT_ADDRESS"):
        on_chain = verify_on_chain(stored_log)
    else:
        on_chain = True
    is_tampered = (computed != stored_log) or (not on_chain)
    fs.mark_tampered(record_id, is_tampered)
    fs.write_audit_log(g.uid, g.role, "verify", record_id, "record", _client_ip())
    checked_at = datetime.now(timezone.utc).isoformat()
    return jsonify(
        {
            "is_tampered": is_tampered,
            "computed_hash": computed,
            "stored_hash": stored_log,
            "on_chain": on_chain,
            "checked_at": checked_at,
        }
    )


@bp.route("/api/access-requests", methods=["POST"])
@verify_firebase_token
@require_role("doctor")
@require_verified_doctor
def create_access_request_route():
    data = request.get_json(silent=True) or {}
    patient_id = data.get("patientId")
    record_ids = data.get("recordIds") or []
    reason = data.get("reason", "")
    if not patient_id:
        return jsonify({"error": "patientId required"}), 400
    req_id = fs.create_access_request(g.uid, patient_id, record_ids, reason)
    fs.write_audit_log(g.uid, g.role, "view", req_id, "accessRequest", _client_ip())
    return jsonify({"request_id": req_id})


@bp.route("/api/access/requests/mine", methods=["GET"])
@verify_firebase_token
@require_role("doctor")
@require_verified_doctor
def access_requests_mine():
    items = fs.list_access_requests_for_doctor(g.uid)
    return _j({"requests": items})


@bp.route("/api/access-requests/pending", methods=["GET"])
@verify_firebase_token
@require_role("patient")
def pending_access_requests():
    items = fs.list_pending_requests_for_patient(g.uid)
    return _j({"requests": items})


@bp.route("/api/access-requests/<req_id>", methods=["PATCH"])
@verify_firebase_token
@require_role("patient")
def respond_access_request(req_id: str):
    data = request.get_json(silent=True) or {}
    status = data.get("status")
    if status not in ("approved", "denied"):
        return jsonify({"error": "status must be approved or denied"}), 400
    req = fs.get_access_request(req_id)
    if not req or req.get("patientId") != g.uid:
        return jsonify({"error": "Not found"}), 404
    fs.respond_to_request(req_id, status)
    action = "approve" if status == "approved" else "deny"
    fs.write_audit_log(g.uid, g.role, action, req_id, "accessRequest", _client_ip())
    return jsonify({"ok": True})


@bp.route("/api/audit/mine", methods=["GET"])
@verify_firebase_token
def audit_mine():
    logs = fs.list_audit_logs_for_actor(g.uid, days=90, limit=200)
    return _j({"logs": logs})


@bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})
