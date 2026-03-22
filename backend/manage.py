"""
CLI helpers (no SQL migrations). Use Firebase Console or gcloud for index/rules deploy.
"""
import argparse
import os
import sys

# Ensure package root on path when run as script
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app  # noqa: E402


def main():
    parser = argparse.ArgumentParser(description="MediVault management")
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("check", help="Load app and Firebase (fail fast if misconfigured)")

    args = parser.parse_args()
    if args.cmd == "check" or args.cmd is None:
        app = create_app()
        with app.app_context():
            _ = app.db
            _ = app.bucket
        print("OK: Flask app and Firebase clients initialized.")


if __name__ == "__main__":
    main()
