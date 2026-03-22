import os
from typing import BinaryIO

from flask import current_app

ALLOWED_EXT = {".pdf", ".jpg", ".jpeg", ".png", ".dicom"}
MIME_MAP = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".dicom": "application/dicom",
}


def ext_from_filename(filename: str) -> str:
    return os.path.splitext(filename.lower())[1]


def file_type_from_ext(ext: str) -> str:
    e = ext.lower()
    if e == ".jpeg":
        e = ".jpg"
    if e == ".jpg":
        return "jpg"
    if e == ".png":
        return "png"
    if e == ".pdf":
        return "pdf"
    if e == ".dicom":
        return "dicom"
    return "pdf"


def validate_upload(
    filename: str,
    file_obj: BinaryIO,
    content_length: int | None,
) -> tuple[bool, str | None]:
    ext = ext_from_filename(filename)
    if ext not in ALLOWED_EXT:
        return False, f"Extension not allowed: {ext}"
    max_b = current_app.config.get("MAX_UPLOAD_BYTES", 50 * 1024 * 1024)
    if content_length is not None and content_length > max_b:
        return False, "File too large"
    data = file_obj.read()
    if len(data) > max_b:
        return False, "File too large"
    return True, None


def validate_upload_bytes(filename: str, data: bytes) -> tuple[bool, str | None]:
    ext = ext_from_filename(filename)
    if ext not in ALLOWED_EXT:
        return False, f"Extension not allowed: {ext}"
    max_b = current_app.config.get("MAX_UPLOAD_BYTES", 50 * 1024 * 1024)
    if len(data) > max_b:
        return False, "File too large"
    return True, None


ONBOARDING_EXT = {".pdf", ".jpg", ".jpeg"}


def validate_onboarding_upload(filename: str, data: bytes) -> tuple[bool, str | None]:
    ext = ext_from_filename(filename)
    if ext not in ONBOARDING_EXT:
        return False, "Only PDF or JPG allowed for onboarding documents"
    max_b = current_app.config.get("ONBOARDING_MAX_UPLOAD_BYTES", 5 * 1024 * 1024)
    if len(data) > max_b:
        return False, "File too large (max 5MB)"
    return True, None
