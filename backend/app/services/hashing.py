import hashlib


def hash_file(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()
