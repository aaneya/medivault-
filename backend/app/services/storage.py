import mimetypes
from datetime import timedelta

from firebase_admin import storage
from flask import current_app


def _bucket():
    return current_app.bucket


def _guess_content_type(filename: str) -> str:
    ctype, _ = mimetypes.guess_type(filename)
    return ctype or "application/octet-stream"


def upload_medical_file(
    file_bytes: bytes,
    patient_uid: str,
    record_id: str,
    filename: str,
) -> str:
    """
    Upload to medical-files/{patient_uid}/{record_id}/{filename}.
    Private blob; returns storage path (storageRef).
    """
    safe_name = filename.replace("..", "").strip("/\\") or "file.bin"
    path = f"medical-files/{patient_uid}/{record_id}/{safe_name}"
    blob = _bucket().blob(path)
    blob.upload_from_string(file_bytes, content_type=_guess_content_type(safe_name))
    blob.cache_control = "private, max-age=0"
    blob.patch()
    return path


def generate_signed_url(storage_ref: str, expiry_minutes: int | None = None) -> str:
    minutes = expiry_minutes or current_app.config.get("SIGNED_URL_EXPIRY_MINUTES", 60)
    blob = _bucket().blob(storage_ref)
    return blob.generate_signed_url(
        version="v4",
        expiration=timedelta(minutes=minutes),
        method="GET",
    )


def delete_file(storage_ref: str) -> None:
    blob = _bucket().blob(storage_ref)
    if blob.exists():
        blob.delete()


def download_file(storage_ref: str) -> bytes:
    blob = _bucket().blob(storage_ref)
    return blob.download_as_bytes()


def upload_onboarding_file(
    file_bytes: bytes,
    uid: str,
    doc_type: str,
    filename: str,
) -> str:
    """
    Store at onboarding/{uid}/{docType}.{ext} (ext from filename; selfie defaults to jpg).
    """
    from app.utils.validators import ext_from_filename

    ext = ext_from_filename(filename)
    if ext == ".jpeg":
        ext = ".jpg"
    if doc_type == "selfie":
        ext = ".jpg"
    elif ext not in (".pdf", ".jpg"):
        ext = ".jpg"
    safe_type = doc_type.replace("..", "").strip("/\\") or "doc"
    path = f"onboarding/{uid}/{safe_type}{ext}"
    blob = _bucket().blob(path)
    blob.upload_from_string(file_bytes, content_type=_guess_content_type(f"x{ext}"))
    blob.cache_control = "private, max-age=0"
    blob.patch()
    return path
