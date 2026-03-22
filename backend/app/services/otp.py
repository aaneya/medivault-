import hashlib
import os
import random
import time
from datetime import datetime, timedelta, timezone

import firebase_admin.auth as fb_auth
from flask import current_app
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from app.services import firestore as fs


def generate_otp() -> str:
    """Generate a 6-digit OTP."""
    return str(random.randint(100000, 999999))


def hash_otp(otp: str) -> str:
    """Hash OTP using SHA-256."""
    return hashlib.sha256(otp.encode()).hexdigest()


def send_sms_otp(phone: str, otp: str) -> bool:
    """Send OTP via Twilio SMS."""
    try:
        from twilio.rest import Client
        
        account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
        auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
        twilio_number = os.environ.get("TWILIO_PHONE_NUMBER")
        
        if not all([account_sid, auth_token, twilio_number]):
            current_app.logger.warning("Twilio credentials not configured")
            return False
        
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            body=f"Your MediVault OTP is {otp}. Valid for 10 minutes.",
            from_=twilio_number,
            to=phone,
        )
        return bool(message.sid)
    except Exception as e:
        current_app.logger.error(f"SMS send failed: {e}")
        return False


def send_email_otp(email: str, otp: str) -> bool:
    """Send OTP via SendGrid Email."""
    try:
        api_key = current_app.config.get("SENDGRID_API_KEY")
        from_email = current_app.config.get("SENDGRID_FROM_EMAIL")
        
        if not api_key or not from_email:
            current_app.logger.warning("SendGrid credentials not configured")
            return False
        
        sg = SendGridAPIClient(api_key)
        message = Mail(
            from_email=from_email,
            to_emails=email,
            subject="Your MediVault OTP",
            html_content=f"""
            <h2>Your OTP is: <strong>{otp}</strong></h2>
            <p>This code is valid for 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            """,
        )
        response = sg.send(message)
        return response.status_code in (200, 202)
    except Exception as e:
        current_app.logger.error(f"Email send failed: {e}")
        return False


def create_otp_session(identifier: str, is_phone: bool = False) -> dict:
    """
    Create an OTP session (stored in Firestore).
    identifier: phone number or email
    is_phone: True if identifier is a phone number, False if email
    
    Returns: {"otp_session_id": str, "otp": str, "expires_at": timestamp}
    """
    now = datetime.now(timezone.utc)
    otp = generate_otp()
    hashed = hash_otp(otp)
    expires_at = now + timedelta(minutes=10)
    
    session_data = {
        "identifier": identifier,
        "isPhone": is_phone,
        "hashedOtp": hashed,
        "createdAt": now,
        "expiresAt": expires_at,
        "attempts": 0,
        "locked": False,
        "lockedUntil": None,
        "verified": False,
    }
    
    session_id = fs.create_otp_session(session_data)
    
    # Check rate limit: 5 OTPs per hour per identifier
    hour_ago = now - timedelta(hours=1)
    count = fs.count_otp_sessions(identifier, hour_ago)
    if count >= 5:
        current_app.logger.warning(f"Rate limit exceeded for {identifier}")
        return {"error": "Too many OTP requests. Try again in 1 hour."}
    
    return {
        "otp_session_id": session_id,
        "otp": otp,
        "expires_at": expires_at.isoformat(),
        "identifier": identifier,
    }


def verify_otp(session_id: str, otp_input: str) -> dict:
    """
    Verify OTP from a session.
    Returns: {"verified": bool, "error": str or None, "uid": str or None}
    """
    session_data = fs.get_otp_session(session_id)
    if not session_data:
        return {"verified": False, "error": "Invalid session"}
    
    now = datetime.now(timezone.utc)
    
    # Check expiration
    expires_at = session_data.get("expiresAt")
    if expires_at and expires_at < now:
        return {"verified": False, "error": "OTP expired"}
    
    # Check lockout
    if session_data.get("locked"):
        locked_until = session_data.get("lockedUntil")
        if locked_until and locked_until > now:
            remaining = int((locked_until - now).total_seconds() / 60)
            return {
                "verified": False,
                "error": f"Too many attempts. Try again in {remaining} minutes.",
            }
    
    # Verify OTP
    hashed_input = hash_otp(otp_input)
    if hashed_input != session_data.get("hashedOtp"):
        attempts = session_data.get("attempts", 0) + 1
        if attempts >= 3:
            locked_until = now + timedelta(minutes=15)
            fs.update_otp_session(
                session_id,
                {
                    "attempts": attempts,
                    "locked": True,
                    "lockedUntil": locked_until,
                },
            )
            return {
                "verified": False,
                "error": "Too many wrong attempts. Locked for 15 minutes.",
            }
        fs.update_otp_session(session_id, {"attempts": attempts})
        return {"verified": False, "error": f"Wrong OTP. {3 - attempts} attempts left."}
    
    # OTP is correct
    identifier = session_data.get("identifier")
    is_phone = session_data.get("isPhone")
    
    # Find or create Firebase user
    uid = None
    if is_phone:
        # Phone-based (patient)
        user_doc = fs.get_user_by_phone(identifier)
        if not user_doc:
            return {
                "verified": False,
                "error": "User not found. Please register first.",
            }
        uid = user_doc.get("uid")
    else:
        # Email-based (doctor/admin)
        try:
            user = fb_auth.get_user_by_email(identifier)
            uid = user.uid
        except fb_auth.UserNotFoundError:
            return {"verified": False, "error": "User not found"}
    
    # Mark session as verified
    fs.update_otp_session(session_id, {"verified": True})
    
    return {"verified": True, "uid": uid}


def resend_otp(session_id: str, channel: str = "sms") -> dict:
    """Resend OTP (SMS or Email)."""
    session_data = fs.get_otp_session(session_id)
    if not session_data:
        return {"error": "Invalid session"}
    
    now = datetime.now(timezone.utc)
    expires_at = session_data.get("expiresAt")
    
    # Allow resend only if not expired
    if expires_at and expires_at < now:
        # Generate new OTP
        otp = generate_otp()
        hashed = hash_otp(otp)
        new_expires = now + timedelta(minutes=10)
        fs.update_otp_session(
            session_id,
            {
                "hashedOtp": hashed,
                "expiresAt": new_expires,
                "attempts": 0,
                "locked": False,
            },
        )
    else:
        # Reuse existing OTP (don't regenerate)
        otp = session_data.get("_otp")
    
    identifier = session_data.get("identifier")
    is_phone = session_data.get("isPhone")
    
    if channel == "sms" and is_phone:
        success = send_sms_otp(identifier, otp)
    elif channel == "email" and not is_phone:
        success = send_email_otp(identifier, otp)
    else:
        return {"error": "Invalid channel for this identifier type"}
    
    if not success:
        return {"error": "Failed to send OTP"}
    
    return {"ok": True}


def get_otp_session_info(session_id: str) -> dict:
    """Get OTP session info (without revealing OTP or hash)."""
    session_data = fs.get_otp_session(session_id)
    if not session_data:
        return None
    
    now = datetime.now(timezone.utc)
    expires_at = session_data.get("expiresAt")
    remaining = None
    if expires_at:
        remaining = max(0, int((expires_at - now).total_seconds()))
    
    identifier = session_data.get("identifier")
    is_phone = session_data.get("isPhone")
    
    # Mask identifier
    if is_phone:
        masked = f"+91 XXXX XXXX {identifier[-4:]}"
    else:
        parts = identifier.split("@")
        masked = f"{parts[0][:2]}***@{parts[1]}"
    
    return {
        "masked_identifier": masked,
        "is_phone": is_phone,
        "expires_in_seconds": remaining,
        "attempts_left": max(0, 3 - session_data.get("attempts", 0)),
        "is_locked": session_data.get("locked", False),
    }
