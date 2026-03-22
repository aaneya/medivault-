"""Convert Firestore types to JSON-serializable values."""

from __future__ import annotations

from typing import Any


def firestore_to_json(obj: Any) -> Any:
    if obj is None:
        return None
    if isinstance(obj, dict):
        return {k: firestore_to_json(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [firestore_to_json(x) for x in obj]
    if hasattr(obj, "timestamp") and callable(getattr(obj, "timestamp", None)):
        try:
            return obj.isoformat()
        except Exception:
            pass
    if hasattr(obj, "to_datetime"):
        try:
            return obj.to_datetime().isoformat()
        except Exception:
            pass
    if isinstance(obj, (str, int, float, bool)):
        return obj
    return str(obj)
