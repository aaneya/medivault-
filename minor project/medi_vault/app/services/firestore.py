"""
All Firestore reads/writes. Uses batch getAll() instead of get() in a loop.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from flask import current_app
from google.cloud.firestore import SERVER_TIMESTAMP, Query
from google.cloud.firestore_v1.base_query import FieldFilter


def _db():
    return current_app.db


def _users():
    return _db().collection("users")


def _patients():
    return _db().collection("patients")


def _doctors():
    return _db().collection("doctors")


def _records():
    return _db().collection("records")


def _access():
    return _db().collection("accessRequests")


def _audit():
    return _db().collection("auditLogs")


def _doc_to_dict(doc) -> dict[str, Any] | None:
    if not doc.exists:
        return None
    d = doc.to_dict() or {}
    d["id"] = doc.id
    return d


# --- USER / PROFILE ---


def create_user_doc(uid: str, email: str, role: str, display_name: str) -> None:
    _users().document(uid).set(
        {
            "email": email,
            "role": role,
            "displayName": display_name,
            "createdAt": SERVER_TIMESTAMP,
            "isActive": True,
            "lastLogin": SERVER_TIMESTAMP,
        }
    )


def get_user(uid: str) -> dict[str, Any] | None:
    return _doc_to_dict(_users().document(uid).get())


def update_last_login(uid: str) -> None:
    _users().document(uid).update({"lastLogin": SERVER_TIMESTAMP})


# --- PATIENTS ---


def create_patient_profile(uid: str, data: dict[str, Any]) -> None:
    payload = {**data, "lastUpdated": SERVER_TIMESTAMP}
    _patients().document(uid).set(payload)


def get_patient(uid: str) -> dict[str, Any] | None:
    return _doc_to_dict(_patients().document(uid).get())


def update_patient(uid: str, data: dict[str, Any]) -> None:
    payload = {**data, "lastUpdated": SERVER_TIMESTAMP}
    _patients().document(uid).update(payload)


def list_patients_by_hospital(hospital_id: str) -> list[dict[str, Any]]:
    q = _patients().where(filter=FieldFilter("hospitalId", "==", hospital_id))
    return [_doc_to_dict(s) for s in q.stream() if _doc_to_dict(s)]


# --- DOCTORS ---


def create_doctor_profile(uid: str, data: dict[str, Any]) -> None:
    payload = {
        **data,
        "createdAt": SERVER_TIMESTAMP,
        "submittedOnboarding": False,
    }
    _doctors().document(uid).set(payload)


def get_doctor(uid: str) -> dict[str, Any] | None:
    return _doc_to_dict(_doctors().document(uid).get())


def verify_doctor(uid: str) -> None:
    _doctors().document(uid).update(
        {"isVerified": True, "verifiedAt": SERVER_TIMESTAMP}
    )


# --- RECORDS ---


def allocate_record_id() -> str:
    return _records().document().id


def create_record(data: dict[str, Any]) -> str:
    doc_ref = _records().document()
    payload = {**data, "createdAt": SERVER_TIMESTAMP, "updatedAt": SERVER_TIMESTAMP}
    doc_ref.set(payload)
    return doc_ref.id


def create_record_with_id(record_id: str, data: dict[str, Any]) -> None:
    payload = {**data, "createdAt": SERVER_TIMESTAMP, "updatedAt": SERVER_TIMESTAMP}
    _records().document(record_id).set(payload)


def get_record(record_id: str) -> dict[str, Any] | None:
    return _doc_to_dict(_records().document(record_id).get())


def can_read_record(uid: str, role: str, record: dict[str, Any]) -> bool:
    if record.get("isDeleted"):
        return False
    if role == "admin":
        return True
    pid = record.get("patientId")
    rid = record.get("id")
    if pid == uid:
        return True
    if role == "doctor":
        if record.get("uploadedBy") == uid:
            return True
        req = get_access_request(access_request_doc_id(uid, pid or ""))
        if not req or req.get("status") != "approved":
            return False
        allowed = req.get("recordIds") or []
        return rid in allowed if allowed else False
    return False


def list_records_for_patient(patient_uid: str) -> list[dict[str, Any]]:
    q = _records().where(filter=FieldFilter("patientId", "==", patient_uid))
    out: list[dict[str, Any]] = []
    for s in q.stream():
        d = _doc_to_dict(s)
        if d and not d.get("isDeleted"):
            out.append(d)
    return out


def _approved_record_ids_for_doctor(doctor_uid: str) -> set[str]:
    q = _access().where(filter=FieldFilter("doctorId", "==", doctor_uid))
    q = q.where(filter=FieldFilter("status", "==", "approved"))
    ids: set[str] = set()
    for s in q.stream():
        d = s.to_dict() or {}
        for rid in d.get("recordIds") or []:
            ids.add(rid)
    return ids


def list_all_records(include_deleted: bool = False) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for s in _records().stream():
        d = _doc_to_dict(s)
        if not d:
            continue
        if not include_deleted and d.get("isDeleted"):
            continue
        out.append(d)
    return out


def list_records_for_doctor(doctor_uid: str) -> list[dict[str, Any]]:
    rids = _approved_record_ids_for_doctor(doctor_uid)
    if not rids:
        return []
    refs = [_records().document(rid) for rid in rids]
    snaps = list(_db().get_all(refs))
    out: list[dict[str, Any]] = []
    for snap in snaps:
        d = _doc_to_dict(snap)
        if d and not d.get("isDeleted"):
            out.append(d)
    return out


def soft_delete_record(record_id: str) -> None:
    _records().document(record_id).update(
        {"isDeleted": True, "updatedAt": SERVER_TIMESTAMP}
    )


def mark_tampered(record_id: str, is_tampered: bool) -> None:
    _records().document(record_id).update(
        {"isTampered": is_tampered, "updatedAt": SERVER_TIMESTAMP}
    )


def update_record_ipfs(record_id: str, ipfs_cid: str | None) -> None:
    _records().document(record_id).update(
        {"ipfsCid": ipfs_cid, "updatedAt": SERVER_TIMESTAMP}
    )


# --- HASH LOGS ---


def _hash_logs(record_id: str):
    return _records().document(record_id).collection("hashLogs")


def add_hash_log(record_id: str, log_data: dict[str, Any]) -> str:
    doc_ref = _hash_logs(record_id).document()
    doc_ref.set(log_data)
    return doc_ref.id


def get_latest_hash_log(record_id: str) -> dict[str, Any] | None:
    q = (
        _hash_logs(record_id)
        .order_by("anchoredAt", direction=Query.DESCENDING)
        .limit(1)
    )
    for s in q.stream():
        return _doc_to_dict(s)
    return None


def update_anchor_status(
    record_id: str,
    log_id: str,
    tx_hash: str,
    block_number: int,
) -> None:
    _hash_logs(record_id).document(log_id).update(
        {
            "txHash": tx_hash,
            "blockNumber": block_number,
            "anchorStatus": "confirmed",
            "anchoredAt": SERVER_TIMESTAMP,
        }
    )


def update_hash_log_failed(record_id: str, log_id: str) -> None:
    _hash_logs(record_id).document(log_id).update({"anchorStatus": "failed"})


# --- ACCESS REQUESTS ---

# Document ID pattern doctor_patient pairs with Firestore rules (exists path).


def access_request_doc_id(doctor_uid: str, patient_uid: str) -> str:
    return f"{doctor_uid}_{patient_uid}"


def create_access_request(
    doctor_uid: str,
    patient_uid: str,
    record_ids: list[str],
    reason: str,
) -> str:
    req_id = access_request_doc_id(doctor_uid, patient_uid)
    expires = datetime.now(timezone.utc) + timedelta(days=7)
    _access().document(req_id).set(
        {
            "doctorId": doctor_uid,
            "patientId": patient_uid,
            "recordIds": record_ids,
            "status": "pending",
            "reason": reason,
            "requestedAt": SERVER_TIMESTAMP,
            "respondedAt": None,
            "expiresAt": expires,
            "notifiedAt": None,
        },
        merge=True,
    )
    return req_id


def get_access_request(req_id: str) -> dict[str, Any] | None:
    return _doc_to_dict(_access().document(req_id).get())


def list_pending_requests_for_patient(patient_uid: str) -> list[dict[str, Any]]:
    q = _access().where(filter=FieldFilter("patientId", "==", patient_uid))
    q = q.where(filter=FieldFilter("status", "==", "pending"))
    return [_doc_to_dict(s) for s in q.stream() if _doc_to_dict(s)]


def list_approved_for_doctor(doctor_uid: str) -> list[dict[str, Any]]:
    q = _access().where(filter=FieldFilter("doctorId", "==", doctor_uid))
    q = q.where(filter=FieldFilter("status", "==", "approved"))
    return [_doc_to_dict(s) for s in q.stream() if _doc_to_dict(s)]


def respond_to_request(req_id: str, status: str) -> None:
    if status not in ("approved", "denied"):
        raise ValueError("status must be approved or denied")
    _access().document(req_id).update(
        {
            "status": status,
            "respondedAt": SERVER_TIMESTAMP,
        }
    )


# --- AUDIT LOGS ---


def write_audit_log(
    actor_id: str,
    actor_role: str,
    action: str,
    resource_id: str,
    resource_type: str,
    ip_address: str | None = None,
) -> None:
    _audit().document().set(
        {
            "actorId": actor_id,
            "actorRole": actor_role,
            "action": action,
            "resourceId": resource_id,
            "resourceType": resource_type,
            "timestamp": SERVER_TIMESTAMP,
            "ipAddress": ip_address,
        }
    )


def list_audit_logs_for_actor(
    actor_uid: str, days: int = 90, limit: int = 200
) -> list[dict[str, Any]]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    q = _audit().where(filter=FieldFilter("actorId", "==", actor_uid))
    q = q.where(filter=FieldFilter("timestamp", ">=", cutoff))
    q = q.order_by("timestamp", direction=Query.DESCENDING).limit(limit)
    return [_doc_to_dict(s) for s in q.stream() if _doc_to_dict(s)]


def list_access_requests_for_doctor(doctor_uid: str) -> list[dict[str, Any]]:
    q = _access().where(filter=FieldFilter("doctorId", "==", doctor_uid))
    rows = [_doc_to_dict(s) for s in q.stream() if _doc_to_dict(s)]

    def ts_key(x: dict[str, Any]) -> float:
        t = x.get("requestedAt")
        if hasattr(t, "timestamp"):
            return float(t.timestamp())
        return 0.0

    rows.sort(key=ts_key, reverse=True)
    return rows


# --- ONBOARDING ---


def _onboarding():
    return _db().collection("onboardingSubmissions")


def create_onboarding_submission(uid: str, data: dict[str, Any]) -> None:
    payload = {
        **data,
        "uid": uid,
        "submittedAt": SERVER_TIMESTAMP,
        "reviewStatus": "pending",
        "reviewedBy": None,
        "reviewedAt": None,
        "rejectionReason": None,
    }
    _onboarding().document(uid).set(payload)


def get_onboarding_submission(uid: str) -> dict[str, Any] | None:
    return _doc_to_dict(_onboarding().document(uid).get())


def list_pending_onboarding() -> list[dict[str, Any]]:
    q = _onboarding().where(filter=FieldFilter("reviewStatus", "==", "pending"))
    q = q.order_by("submittedAt", direction=Query.DESCENDING)
    return [_doc_to_dict(s) for s in q.stream() if _doc_to_dict(s)]


def mark_doctor_submitted_onboarding(uid: str) -> None:
    _doctors().document(uid).update({"submittedOnboarding": True})


def approve_onboarding(uid: str, admin_uid: str) -> None:
    batch = _db().batch()
    oref = _onboarding().document(uid)
    dref = _doctors().document(uid)
    batch.update(
        oref,
        {
            "reviewStatus": "approved",
            "reviewedBy": admin_uid,
            "reviewedAt": SERVER_TIMESTAMP,
            "rejectionReason": None,
        },
    )
    batch.update(
        dref,
        {"isVerified": True, "verifiedAt": SERVER_TIMESTAMP},
    )
    batch.commit()


def reject_onboarding(uid: str, admin_uid: str, reason: str) -> None:
    _onboarding().document(uid).update(
        {
            "reviewStatus": "rejected",
            "reviewedBy": admin_uid,
            "reviewedAt": SERVER_TIMESTAMP,
            "rejectionReason": reason,
        }
    )
