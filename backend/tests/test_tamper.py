from app.services.hashing import hash_file


def test_hash_stable():
    h = hash_file(b"hello")
    assert h == hash_file(b"hello")
    assert len(h) == 64


def test_hash_changes():
    assert hash_file(b"a") != hash_file(b"b")
