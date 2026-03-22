"""
Polygon Mumbai anchoring via Web3 + Alchemy.
SHA-256 hex is converted to bytes32 for the HashAnchor contract.
"""
from typing import Any

from eth_abi import encode
from flask import current_app
from web3 import Web3


def _w3() -> Web3 | None:
    rpc = current_app.config.get("POLYGON_RPC_URL") or ""
    if not rpc and current_app.config.get("ALCHEMY_KEY"):
        rpc = (
            "https://polygon-mumbai.g.alchemy.com/v2/"
            + current_app.config["ALCHEMY_KEY"]
        )
    if not rpc:
        return None
    return Web3(Web3.HTTPProvider(rpc))


def _hex_sha256_to_bytes32(hex_digest: str) -> bytes:
    h = hex_digest.lower().removeprefix("0x")
    return bytes.fromhex(h)


def anchor_hash_to_polygon(hex_sha256: str) -> dict[str, Any] | None:
    """
    Submit anchor transaction. Returns {tx_hash, block_number} or None if skipped/failed.
    """
    w3 = _w3()
    pk = current_app.config.get("OWNER_PRIVATE_KEY")
    contract_addr = current_app.config.get("CONTRACT_ADDRESS")
    if not w3 or not pk or not contract_addr:
        return None
    if not w3.is_connected():
        return None

    account = w3.eth.account.from_key(pk)
    digest = _hex_sha256_to_bytes32(hex_sha256)
    # ABI: anchorHash(bytes32)
    fn_selector = Web3.keccak(text="anchorHash(bytes32)")[:4]
    calldata = fn_selector + encode(["bytes32"], [digest])

    tx: dict[str, Any] = {
        "from": account.address,
        "to": Web3.to_checksum_address(contract_addr),
        "data": calldata,
        "gas": 200_000,
        "gasPrice": w3.eth.gas_price,
        "nonce": w3.eth.get_transaction_count(account.address),
        "chainId": w3.eth.chain_id,
    }
    try:
        signed = w3.eth.account.sign_transaction(tx, private_key=pk)
        raw = getattr(signed, "raw_transaction", None) or signed.rawTransaction
        tx_hash = w3.eth.send_raw_transaction(raw)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        return {
            "tx_hash": receipt["transactionHash"].hex(),
            "block_number": receipt["blockNumber"],
        }
    except Exception:
        return None


def verify_on_chain(hex_sha256: str) -> bool:
    w3 = _w3()
    contract_addr = current_app.config.get("CONTRACT_ADDRESS")
    if not w3 or not contract_addr or not w3.is_connected():
        return False
    digest = _hex_sha256_to_bytes32(hex_sha256)
    # isAnchored(bytes32) — selector
    fn_selector = Web3.keccak(text="isAnchored(bytes32)")[:4]
    calldata = fn_selector + encode(["bytes32"], [digest])
    try:
        raw = w3.eth.call(
            {
                "to": Web3.to_checksum_address(contract_addr),
                "data": calldata,
            }
        )
        return bool(int.from_bytes(raw, "big"))
    except Exception:
        return False
