import base64
import json
from typing import Any

import requests
from flask import current_app


def upload_to_ipfs(file_bytes: bytes, filename: str = "file.bin") -> str | None:
    """
    Upload bytes to Infura IPFS. Returns CID or None if not configured / on failure.
    """
    project_id = current_app.config.get("INFURA_PROJECT_ID")
    secret = current_app.config.get("INFURA_PROJECT_SECRET")
    if not project_id or not secret:
        return None
    auth = base64.b64encode(f"{project_id}:{secret}".encode()).decode()
    url = f"https://ipfs.infura.io:5001/api/v0/add"
    try:
        r = requests.post(
            url,
            headers={"Authorization": f"Basic {auth}"},
            files={"file": (filename, file_bytes)},
            timeout=120,
        )
        r.raise_for_status()
        line = r.text.strip().split("\n")[0]
        data: dict[str, Any] = json.loads(line)
        return data.get("Hash")
    except Exception:
        return None
