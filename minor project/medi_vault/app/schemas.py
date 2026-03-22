"""
Firestore document shapes — reference only (dicts at runtime).
"""

USER_FIELDS = (
    "email",
    "role",
    "displayName",
    "createdAt",
    "isActive",
    "lastLogin",
)

PATIENT_FIELDS = (
    "fullName",
    "dob",
    "bloodType",
    "emergencyContact",
    "walletAddress",
    "hospitalId",
    "lastUpdated",
)

DOCTOR_FIELDS = (
    "fullName",
    "licenseNumber",
    "specialty",
    "hospital",
    "isVerified",
    "publicKey",
    "verifiedAt",
)

RECORD_FIELDS = (
    "patientId",
    "uploadedBy",
    "title",
    "description",
    "fileType",
    "storageRef",
    "ipfsCid",
    "sha256Hash",
    "isTampered",
    "fileSizeBytes",
    "createdAt",
    "updatedAt",
    "isDeleted",
)

HASH_LOG_FIELDS = (
    "sha256Hash",
    "txHash",
    "blockNumber",
    "anchorStatus",
    "anchoredAt",
    "network",
)

ACCESS_REQUEST_FIELDS = (
    "doctorId",
    "patientId",
    "recordIds",
    "status",
    "reason",
    "requestedAt",
    "respondedAt",
    "expiresAt",
    "notifiedAt",
)

AUDIT_LOG_FIELDS = (
    "actorId",
    "actorRole",
    "action",
    "resourceId",
    "resourceType",
    "timestamp",
    "ipAddress",
)
