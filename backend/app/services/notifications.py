from flask import current_app


def send_email(to_address: str, subject: str, body: str) -> bool:
    api_key = current_app.config.get("SENDGRID_API_KEY")
    from_email = current_app.config.get("SENDGRID_FROM_EMAIL")
    if not api_key or not from_email:
        return False
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail

        message = Mail(
            from_email=from_email,
            to_emails=to_address,
            subject=subject,
            plain_text_content=body,
        )
        sg = SendGridAPIClient(api_key)
        sg.send(message)
        return True
    except Exception:
        return False


def notify_patient_record_uploaded(patient_email: str, record_title: str) -> None:
    send_email(
        patient_email,
        "New medical record uploaded",
        f"A new record was added to your MediVault account: {record_title}",
    )


def notify_admin_new_doctor_onboarding(doctor_uid: str) -> None:
    admin = current_app.config.get("ADMIN_NOTIFY_EMAIL")
    if not admin:
        return
    send_email(
        admin,
        "New doctor onboarding submission",
        f"A doctor completed onboarding submission. UID: {doctor_uid}",
    )


def notify_doctor_onboarding_approved(email: str) -> None:
    send_email(
        email,
        "MediVault — application approved",
        "Your doctor account has been verified. You can now access patient records.",
    )


def notify_doctor_onboarding_rejected(email: str, reason: str) -> None:
    send_email(
        email,
        "MediVault — application update",
        f"Your onboarding application was not approved. Reason: {reason}",
    )
