# MediVault - Complete UI/UX Showcase

## Overview
MediVault is a **blockchain-secured medical records platform** with a modern, professional interface designed for patients, doctors, and administrators.

---

## Color Palette & Design System

### Primary Colors
- **Indigo (#4F46E5)** - Main brand color, CTAs, primary actions
- **White (#FFFFFF)** - Background, cards
- **Gray-900 (#111827)** - Text, dark mode background
- **Gray-50 (#F9FAFB)** - Light backgrounds, borders

### Status Colors
- **Emerald (#10B981)** - Success, approved, verified
- **Red (#EF4444)** - Danger, rejected, error
- **Amber (#F59E0B)** - Warning, pending, alert
- **Blue (#3B82F6)** - Info, loading

### Typography
- **Headings**: Sora (700 weight) - Modern, professional
- **Body**: DM Sans (400-500 weight) - Clean, readable
- **Code**: Space Mono (Monospace)

---

## Page 1: Home/Landing Page

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🏥 MEDIVAULT  [Get Started] [Login] [Features]        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    HERO SECTION                         │
│                                                         │
│  Secure Medical Records  ✓                              │
│  Powered by Blockchain                                  │
│                                                         │
│  Your health data is yours. Control who accesses it.   │
│                                                         │
│          [Get Started]        [Learn More]             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│            HOW IT WORKS (4 Steps)                       │
│                                                         │
│  1. Register         2. Verify         3. Upload        │
│  [Card]              [Card]            [Card]           │
│                                                         │
│  4. Share & Control                                     │
│  [Card]                                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│          WHY MEDIVAULT (Features Grid)                  │
│                                                         │
│  🔐 End-to-End Encrypted    🔗 Blockchain Verified     │
│  📱 Mobile First             ⚡ Instant Access          │
│  👨‍⚕️ Doctor Verified          📊 Full Audit Trail         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Page 2: Login - Step 1 (Role Selection & Phone Input)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ← Back         LOG IN TO MEDIVAULT                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    WHO ARE YOU?                                         │
│                                                         │
│    ☐ Patient      ☐ Doctor      ☐ Admin               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    ENTER YOUR PHONE NUMBER                             │
│                                                         │
│    [ 🇮🇳 +91 ] [_____________________]                  │
│                                                         │
│    We'll send you a One-Time Password                   │
│                                                         │
│                                                         │
│              [Send OTP]    [Use Email]                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Don't have an account? [Sign Up]                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Page 3: Login - Step 2 (OTP Verification)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ← Back         VERIFY YOUR PHONE                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    Sent an OTP to +91 98765 43210                       │
│                                                         │
│    ENTER 6-DIGIT CODE                                   │
│                                                         │
│    [_] [_] [_] [_] [_] [_]                             │
│                                                         │
│    Expires in: 04:32                                    │
│                                                         │
│              [Verify]                                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Wrong code? [Resend OTP]   Didn't get it? [Call Me]   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Page 4: Patient Dashboard

```
┌──────────────────────────────────────────────────────────┐
│ 🏥 MEDIVAULT  [📋 Records] [👥 Access] [⚙️ Settings]     │
├────────────────┬──────────────────────────────────────┤
│ PATIENT MENU   │                                      │
│ ┌────────────┐ │     MY MEDICAL RECORDS               │
│ │ Dashboard  │ │                                      │
│ │ Records    │ │  [+ Upload New Record]               │
│ │ Access     │ │                                      │
│ │ Verify     │ │  📄 Blood Report       Jan 15, 2024 │
│ │ Settings   │ │  Status: ✓ Verified    [View]       │
│ │ Logout     │ │                                      │
│ └────────────┘ │  📄 X-Ray                Jan 10, 2024 │
│                │  Status: ⏳ Processing    [View]       │
│                │                                      │
│                │  📄 Prescription        Dec 20, 2023 │
│                │  Status: ✓ Verified    [View]       │
│                │                                      │
│                │  ══════════════════════              │
│                │  DOCTOR ACCESS                       │
│                │                                      │
│                │  Dr. Rajesh Kumar      [✓ Access]    │
│                │  Cardiologist          [Revoke]      │
│                │                                      │
│                │  Dr. Priya Singh       [⏳ Pending]   │
│                │  General Physician     [Approve]     │
│                │                                      │
└────────────────┴──────────────────────────────────────┘
```

---

## Page 5: Doctor Dashboard

```
┌──────────────────────────────────────────────────────────┐
│ 🏥 MEDIVAULT  [📋 Patients] [📬 Requests] [⚙️ Settings]   │
├────────────────┬──────────────────────────────────────┤
│ DOCTOR MENU    │                                      │
│ ┌────────────┐ │     PATIENT ACCESS REQUESTS          │
│ │ Dashboard  │ │                                      │
│ │ Patients   │ │  👤 John Doe                         │
│ │ Requests   │ │     Cardiologist Request             │
│ │ Records    │ │     [Accept] [Reject]                │
│ │ Activity   │ │                                      │
│ │ Settings   │ │  👤 Sarah Williams                   │
│ │ Logout     │ │     Lab Request                      │
│ │            │ │     [Accept] [Reject]                │
│ └────────────┘ │                                      │
│                │  ══════════════════════              │
│                │  APPROVED PATIENTS                   │
│                │                                      │
│                │  👤 Michael Johnson                  │
│                │     ✓ Approved Apr 15               │
│                │     [View Records] [Share Note]      │
│                │                                      │
│                │  👤 Emma Davis                       │
│                │     ✓ Approved Apr 10               │
│                │     [View Records] [Share Note]      │
│                │                                      │
└────────────────┴──────────────────────────────────────┘
```

---

## Page 6: Admin Dashboard

```
┌──────────────────────────────────────────────────────────┐
│ 🏥 MEDIVAULT ADMIN  [Doctors] [Hospitals] [Stats]        │
├────────────────┬──────────────────────────────────────┤
│ ADMIN MENU     │                                      │
│ ┌────────────┐ │     PENDING DOCTOR APPROVALS         │
│ │ Dashboard  │ │                                      │
│ │ Doctors    │ │  👨‍⚕️ Dr. Amit Patel                    │
│ │ Hospitals  │ │     License: MCI/12345               │
│ │ Stats      │ │     Hospital: Apollo Delhi           │
│ │ Users      │ │     [View Docs] [Approve] [Reject]   │
│ │ Settings   │ │                                      │
│ │ Logout     │ │  👨‍⚕️ Dr. Neha Sharma                   │
│ └────────────┘ │     License: MCI/67890               │
│                │     Hospital: Max Delhi              │
│                │     [View Docs] [Approve] [Reject]   │
│                │                                      │
│                │  ══════════════════════              │
│                │  PLATFORM STATISTICS                 │
│                │                                      │
│                │  Total Users: 4,521                  │
│                │  Doctors Verified: 342               │
│                │  Records Uploaded: 12,543            │
│                │  Blockchain Anchors: 8,234           │
│                │                                      │
└────────────────┴──────────────────────────────────────┘
```

---

## Page 7: Doctor Onboarding - Step 1

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  DOCTOR REGISTRATION (Step 1 of 4)                      │
│  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░ 25%                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PERSONAL INFORMATION                                   │
│                                                         │
│  Full Name                                              │
│  [ Dr. Rajesh Kumar                    ]                │
│                                                         │
│  Email Address                                          │
│  [ rajesh.kumar@email.com              ]                │
│                                                         │
│  Medical License Number                                 │
│  [ MCI/56789                           ]                │
│                                                         │
│  Hospital Name                                          │
│  [ Apollo Delhi                        ]                │
│                                                         │
│  Specialization                                         │
│  [ Cardiology                          ▼]               │
│                                                         │
│              [Back]          [Next] →                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Page 8: Doctor Onboarding - Step 2 (Document Upload)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  DOCTOR REGISTRATION (Step 2 of 4)                      │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░ 50%                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  UPLOAD DOCUMENTS                                       │
│                                                         │
│  Medical License                                        │
│  ╔═════════════════════════════════════╗               │
│  ║  📄                                 ║               │
│  ║  Drag files here or click to browse  ║               │
│  ║  (PDF, JPG, PNG - Max 5MB)           ║               │
│  ╚═════════════════════════════════════╝               │
│                                                         │
│  Degree Certificate                                     │
│  ╔═════════════════════════════════════╗               │
│  ║  📄                                 ║               │
│  ║  Drag files here or click to browse  ║               │
│  ║  (PDF, JPG, PNG - Max 5MB)           ║               │
│  ╚═════════════════════════════════════╝               │
│                                                         │
│  Hospital Verification Letter                           │
│  ╔═════════════════════════════════════╗               │
│  ║  📄 apollo_letter.pdf (2.3MB) ✓      ║               │
│  ╚═════════════════════════════════════╝               │
│                                                         │
│              [Back]          [Next] →                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Page 9: Doctor Onboarding - Step 3 (Selfie Capture)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  DOCTOR REGISTRATION (Step 3 of 4)                      │
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░ 75%               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  VERIFICATION SELFIE                                    │
│                                                         │
│  Please take a clear selfie with your medical ID       │
│                                                         │
│  ╔═════════════════════════════════════╗               │
│  ║                                     ║               │
│  ║      📷 Selfie Captured            ║               │
│  ║                                     ║               │
│  ║      [ ✓ Good Quality ]             ║               │
│  ║                                     ║               │
│  ║      [Retake Photo]  [Use This]     ║               │
│  ║                                     ║               │
│  ╚═════════════════════════════════════╝               │
│                                                         │
│              [Back]          [Next] →                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Page 10: Doctor Onboarding - Step 4 (Review & Submit)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  DOCTOR REGISTRATION (Step 4 of 4)                      │
│  ████████████████████░░░░░░░░░░░░░░░ 100%              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  REVIEW YOUR INFORMATION                                │
│                                                         │
│  ✓ Personal Info:      Dr. Rajesh Kumar                │
│  ✓ License:            MCI/56789 (Verified)            │
│  ✓ Documents:          3 files uploaded                │
│  ✓ Selfie:             Captured & verified             │
│                                                         │
│  Hospital:             Apollo Delhi                     │
│  Specialization:       Cardiology                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ☑ I confirm all information is accurate                │
│  ☑ I agree to the Terms of Service                      │
│                                                         │
│                                                         │
│        [Back]        [Submit for Review]               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Mobile Design

All pages are **mobile-first** with:
- Full-width single column on mobile (< 640px)
- Sidebar collapses to hamburger menu
- Touch-friendly buttons (min 48px)
- Optimized typography for readability
- Horizontal scrolling for wide tables

### Mobile Navigation
```
┌─────────────────────┐
│ ☰  MediVault  👤    │
├─────────────────────┤
│  Content            │
│  (Full width)       │
│                     │
│                     │
│                     │
└─────────────────────┘
```

---

## Components Library

### Buttons
- **Primary** (Indigo): Main actions, form submit
- **Secondary** (Ghost): Alternative actions, cancel
- **Success** (Emerald): Approve, confirm positive
- **Danger** (Red): Reject, delete
- **Disabled**: All variants have disabled state

### Form Inputs
- Text inputs with error states
- Dropdown selects
- File upload zones (drag & drop)
- Radio button groups
- Checkboxes
- Validation messages

### Status Badges
- ✓ Verified (Emerald)
- ⏳ Pending (Amber)
- ✗ Rejected (Red)
- ℹ️ Info (Blue)

### Cards
- Hover effects (shadow lift, scale)
- Border on left for status
- Padding: 24px
- Rounded corners: 8px
- Action buttons aligned right

---

## Animations & Interactions

- **Page Load**: Fade in smoothly (200ms)
- **Button Hover**: Scale 1.05 + shadow
- **Toast Messages**: Slide in from bottom, auto-dismiss
- **Modal Open**: Scale from center with backdrop fade
- **Form Validation**: Red outline + error message
- **Success**: Checkmark animation + green color

---

## Accessibility Features

✓ WCAG 2.1 AA Compliant
✓ 4.5:1 color contrast minimum
✓ Keyboard navigation (Tab, Enter, Esc)
✓ Screen reader support (ARIA labels)
✓ Focus indicators (2px indigo ring)
✓ Minimum 16px font size
✓ Clear error messages
✓ Form labels properly associated

---

## Dark Mode

All pages support dark mode with:
- Dark backgrounds (#111827)
- Light text (#F9FAFB)
- Adjusted contrasts
- Smooth theme transition
- System preference detection
- Manual toggle in settings

---

## Summary

MediVault provides a **professional, secure, and accessible** interface for managing medical records across all user roles. The design emphasizes:

1. **Security** - Trust signals, verification badges, locks
2. **Clarity** - Clear hierarchy, obvious CTAs, status indicators
3. **Accessibility** - High contrast, keyboard support, screen readers
4. **Responsiveness** - Works on mobile, tablet, desktop
5. **Modern** - Clean design, smooth animations, professional fonts

The UI is ready to see in action. Start the dev server to experience it!
