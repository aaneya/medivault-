# MediVault Design System

## Visual Identity

### Color Palette
```
Primary Brand: Indigo (#4F46E5)
  - Used for: Buttons, links, highlights, active states
  - RGB: (79, 70, 229)
  
Secondary: Emerald (#10B981)
  - Used for: Success states, positive actions
  - RGB: (16, 185, 129)

Danger: Red (#EF4444)
  - Used for: Errors, rejections, critical actions
  - RGB: (239, 68, 68)

Warning: Amber (#F59E0B)
  - Used for: Alerts, pending states
  - RGB: (245, 158, 11)

Neutral Light: Gray (#F3F4F6)
  - Used for: Backgrounds, subtle separators
  
Neutral Dark: Gray (#1F2937)
  - Used for: Text, strong elements

Dark Mode Background: (#0F172A)
  - Used for: Main background in dark mode
```

### Typography

**Headings: Sora (Bold/SemiBold)**
```
H1: 48px, line-height 1.2
H2: 36px, line-height 1.3
H3: 24px, line-height 1.4
H4: 20px, line-height 1.5
H5: 16px, line-height 1.6
```

**Body: DM Sans (Regular/Medium)**
```
Large: 18px, line-height 1.6
Base: 16px, line-height 1.6
Small: 14px, line-height 1.5
Tiny: 12px, line-height 1.4
```

**Mono: JetBrains Mono**
```
Used for: Code, file hashes, blockchain addresses
Base: 14px
```

### Spacing Scale
```
XS: 4px
SM: 8px
MD: 12px
LG: 16px
XL: 24px
2XL: 32px
3XL: 48px
4XL: 64px
```

### Border Radius
```
Small: 4px (buttons, inputs)
Medium: 8px (cards)
Large: 12px (modals)
Full: 9999px (avatars, pills)
```

---

## Component Library

### Buttons

**Primary (Indigo Background)**
```
Background: #4F46E5
Text: White
Padding: 12px 24px
Border Radius: 6px
Hover: #4338CA (darker indigo)
Active: #3730A3 (even darker)
Disabled: Gray with 50% opacity
```

**Secondary (Ghost/Outline)**
```
Background: Transparent
Border: 2px #4F46E5
Text: #4F46E5
Padding: 10px 22px
Hover: Light indigo background (#EEF2FF)
```

**Danger (Red)**
```
Background: #EF4444
Text: White
Used for: Delete, Reject, Cancel
Hover: #DC2626
```

**Success (Emerald)**
```
Background: #10B981
Text: White
Used for: Approve, Upload, Confirm
Hover: #059669
```

### Input Fields

**States:**
- **Default**: Gray border (#E5E7EB), light background
- **Focused**: Indigo border (#4F46E5), shadow glow
- **Filled**: Value shown in dark text
- **Error**: Red border (#EF4444), error message below
- **Disabled**: Gray background, 50% opacity

**OTP Input:**
```
6 boxes, each 60x60px
Box: 2px border, rounded 8px
Focused: Indigo border, background light indigo
Digit: 24px bold mono font
```

### Cards

**Structure:**
```
Background: White (light) / #1F2937 (dark)
Border: 1px solid #E5E7EB (light) / #374151 (dark)
Border Radius: 8px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Hover: Slight shadow increase, subtle scale
```

### Toast Notifications

**Success:**
```
Background: #D1FAE5 (light green)
Text: #065F46 (dark green)
Icon: Checkmark ✓
Duration: 3 seconds
```

**Error:**
```
Background: #FEE2E2 (light red)
Text: #7F1D1D (dark red)
Icon: X mark ✗
Duration: 4 seconds
```

**Info:**
```
Background: #DBEAFE (light blue)
Text: #1E3A8A (dark blue)
Icon: Info circle ⓘ
Duration: 3 seconds
```

---

## Page Layouts

### 1. Home/Landing Page

**Header Section:**
```
Navigation Bar (sticky)
├── Logo (MediVault)
├── Nav Links (Features, Security, About)
└── Login Button (Indigo)

Hero Section
├── Heading: "Secure Medical Records On Blockchain"
├── Subheading: "Patient-controlled healthcare data with HIPAA compliance"
├── CTA Buttons: "Get Started" (Indigo) + "Learn More" (Ghost)
└── Hero Image: Illustration

Features Grid (3 columns on desktop, 1 on mobile)
├── Feature 1: Patient Control
├── Feature 2: Doctor Verification
├── Feature 3: Blockchain Security
└── Feature 4: HIPAA Compliant
```

**Footer:**
```
Company Links | Legal | Social Media | Contact
```

---

### 2. Login Page

**Two-Step Flow:**

**Step 1: Phone/Email Entry**
```
Container: Centered card (400px max width)
├── Logo
├── Heading: "Welcome to MediVault"
├── Role Radio Buttons: [ Patient ] [ Doctor ] [ Admin ]
├── Input Field: "Phone Number" / "Email"
│   └── Placeholder: "+1 (555) 000-0000"
├── Send OTP Button: "Send OTP" (Indigo, full width)
└── Footer: "First time? Register here"

Design:
- Light indigo background (#F0F9FF)
- White card container
- Smooth transitions
```

**Step 2: OTP Verification**
```
Container: Centered card (400px max width)
├── Heading: "Enter Verification Code"
├── Subheading: "We sent a code to your phone"
├── OTP Input: 6 digit boxes (60x60 each)
│   └── Auto-focus between boxes
├── Countdown Timer: "00:59 remaining"
├── Verify Button: "Verify & Sign In" (Indigo)
├── Resend Link: "Didn't receive? Resend" (small text)
└── Back Link: "Change phone number"

Design:
- Focused UX with auto-advance
- Clear error states if OTP wrong
- Rate limit: 3 attempts, 15-min lockout
```

---

### 3. Patient Dashboard

**Layout: Sidebar + Main Content**

**Sidebar (collapsible on mobile):**
```
├── User Profile Section
│   ├── Avatar
│   ├── Name
│   └── "Patient"
├── Navigation
│   ├── Dashboard (home icon)
│   ├── My Records (documents)
│   ├── Doctor Access (share)
│   ├── Verification (shield)
│   └── Settings (gear)
└── Logout Button
```

**Main Content Area:**

**Tab 1: My Records**
```
Header:
├── Title: "My Medical Records"
├── Upload Button: "Upload New Record" (Indigo)
└── Search/Filter Bar

Records List:
├── Card for each record
│   ├── Title: "Blood Test Report"
│   ├── Date: "Nov 15, 2024"
│   ├── Doctor: "Dr. Sarah Johnson"
│   ├── Status: Badge (Verified ✓, Pending, etc)
│   ├── Action Buttons:
│   │   ├── Download (arrow icon)
│   │   ├── Share (share icon)
│   │   └── Delete (trash icon)
│   └── Hash: "SHA256: ab3f..." (clickable → blockchain verification)
```

**Tab 2: Doctor Access**
```
Header: "Doctors Who Can Access Your Records"

Access Requests:
├── Pending Requests
│   └── Card per request
│       ├── Doctor Name + Avatar
│       ├── Hospital
│       ├── Requested: "3 days ago"
│       ├── Requested Records: List
│       ├── Approve Button (Emerald)
│       └── Reject Button (Red)

├── Approved Access
│   └── Card per doctor
│       ├── Doctor Name + Avatar
│       ├── Hospital
│       ├── Approved: "Nov 10, 2024"
│       ├── Records Access: Badge showing count
│       └── Revoke Button (Red)

├── Rejected Access
│   └── Card per doctor
│       ├── Doctor Name
│       ├── Rejected: "Nov 5, 2024"
│       └── Reason (if provided)
```

**Tab 3: Verification**
```
Blockchain Verification Status:

├── Record Card
│   ├── Title + Date
│   ├── Verification Status: Badge
│   ├── Block Hash: "0x123abc..." (copy button)
│   ├── Transaction: Link to Polygonscan
│   ├── Timestamp: "Nov 15, 2024 14:32 UTC"
│   └── Verify Button: "Verify on Blockchain"
```

---

### 4. Doctor Dashboard

**Layout: Similar to Patient**

**Sidebar Navigation:**
```
├── Dashboard
├── Access Requests
├── My Records
├── Patients
└── Activity Log
```

**Tab 1: Access Requests**
```
Pending Requests From Patients:

├── Request Card
│   ├── Patient Name + Avatar
│   ├── Date: "Requested 2 days ago"
│   ├── Requested Records: Checkboxes
│   │   ├── ☑ Blood Test
│   │   ├── ☑ X-Ray
│   │   └── ☐ Prescription
│   ├── Approve Button (Emerald)
│   ├── Reject Button (Red)
│   └── Reason Input (if rejecting)

Approved Access:
├── Patient Card
│   ├── Patient Name + Avatar
│   ├── Approved: "Date"
│   ├── Records Count: "3 records"
│   └── View Records Link
```

**Tab 2: My Records**
```
Similar to patient but for doctor-uploaded records

├── Upload Section (drag & drop area)
├── My Records List
│   └── Uploaded records with approval status
```

**Tab 3: Patients**
```
All patients who've granted access

├── Patient List
│   └── Patient Card
│       ├── Name + Avatar
│       ├── Hospital
│       ├── Records Count
│       ├── Last Access: "Date"
│       └── View Records Button
```

---

### 5. Admin Dashboard

**Layout: Full-width with widgets**

**Header Stats:**
```
4 Stat Cards in a row (responsive):
├── Pending Approvals: "12" (Amber badge)
├── Verified Doctors: "234" (Green)
├── Total Patients: "1,856" (Blue)
└── Platform Records: "45,678" (Indigo)
```

**Tab 1: Doctor Approvals**
```
Pending Doctor Applications:

├── Application Card
│   ├── Doctor Info
│   │   ├── Name
│   │   ├── Email
│   │   ├── Phone
│   │   ├── License Number
│   │   └── Hospital Name
│   ├── Documents Section
│   │   ├── Degree: View (PDF icon)
│   │   ├── License: View (PDF icon)
│   │   ├── Selfie: View (photo icon)
│   │   └── Hospital Affiliation: View
│   ├── Status: "Pending" (Amber badge)
│   ├── Applied: "Nov 10, 2024"
│   ├── Approve Button (Emerald)
│   └── Reject Button (Red)
│       └── Reject Reason: Text input
```

**Tab 2: Hospitals**
```
Hospital List:

├── Hospital Card
│   ├── Hospital Name
│   ├── Location
│   ├── Doctors: "45"
│   ├── Patients: "1,234"
│   ├── Status: Badge (Active/Inactive)
│   ├── Registered: "Date"
│   └── Manage Button
```

**Tab 3: Analytics**
```
Charts & Metrics:

├── Records Uploaded: Line chart (last 30 days)
├── Doctor Approvals: Pie chart
├── User Growth: Bar chart
├── Blockchain Verification Rate: Percentage
└── Data Export Button
```

---

### 6. Doctor Onboarding (4-Step Wizard)

**Progress Bar:**
```
Step 1 ✓ → Step 2 (Current) → Step 3 → Step 4 (Review)
```

**Step 1: Personal Information**
```
Form Fields:
├── Full Name: Text input (required)
├── Email: Text input (required)
├── Phone: Tel input (required)
├── Degree: Dropdown (MD, DO, etc) (required)
├── License Number: Text input (required)
├── License Expiry: Date input (required)
├── Hospital Name: Text input (required)
├── Hospital Address: Text input (required)
└── Next Button (Indigo, bottom right)
```

**Step 2: Upload Documents**
```
Document Upload Zones:

├── Medical Degree
│   └── Drag & drop or click to upload (PDF/Image)
├── Medical License
│   └── Drag & drop or click to upload (PDF/Image)
└── Hospital Affiliation Letter
    └── Drag & drop or click to upload (PDF/Image)

Uploaded Files Show:
├── File name
├── File size
├── Upload status (✓ Complete)
└── Remove button

Next Button (Indigo)
```

**Step 3: Selfie Verification**
```
Selfie Capture Section:

├── Camera Preview (centered, 400x400)
│   └── "Position your face in the circle"
├── Capture Button: "Take Photo" (Indigo)
├── Retake Button: "Try Again" (Ghost)

After Capture:
├── Preview of selfie
├── Quality check: "Good, clearly visible"
├── Next Button
```

**Step 4: Review & Submit**
```
Summary Card:
├── Personal Info Section (collapsible)
│   ├── Name
│   ├── Email
│   ├── Phone
│   ├── License
│   └── Hospital
├── Documents Section (collapsible)
│   ├── Degree: Uploaded ✓
│   ├── License: Uploaded ✓
│   └── Hospital Letter: Uploaded ✓
├── Selfie: Verified ✓
├── Agreement Checkbox:
│   └── "I certify all information is accurate"
├── Submit Button: "Submit Application" (Emerald)
└── Back Button: "Edit Information"

After Submit:
├── Success Message
├── "Your application has been submitted"
├── "You'll receive updates via email"
└── Redirect to Status Page
```

---

### 7. Onboarding Status Page

**Pending Approval State:**
```
Status Card:
├── Icon: Hourglass ⏳
├── Status: "Application Pending" (Amber)
├── Message: "Your application is being reviewed"
├── Submitted: "Nov 15, 2024"
├── Estimated Timeline: "3-5 business days"
├── Check Email: "We'll notify you at [email]"
└── Dashboard Button: "Return to Home"
```

**Rejected State:**
```
Status Card:
├── Icon: ✗
├── Status: "Application Rejected" (Red)
├── Reason: "Medical license verification failed"
├── Message: "Please address the issues and reapply"
├── Details: Expandable section
├── Reapply Button: "Submit New Application"
└── Support Link: "Contact support"
```

**Approved State:**
```
Status Card:
├── Icon: ✓
├── Status: "Approved" (Green)
├── Message: "Welcome to MediVault!"
├── Approved: "Nov 15, 2024"
├── Next Steps: List of onboarding
├── Go to Dashboard Button (Indigo)
└── Documentation Link
```

---

## Responsive Design

### Breakpoints
```
Mobile: 0px - 640px
Tablet: 640px - 1024px
Desktop: 1024px+
```

### Mobile Adjustments
```
Sidebars: Hidden by default, toggle with hamburger menu
Cards: Stack vertically
Buttons: Full width
Modals: Full screen with bottom sheet style
Inputs: Larger touch targets (48px minimum)
Font Sizes: Slightly larger for readability
Spacing: More generous for touch
```

---

## Interactive States

### Buttons
- **Hover**: Slight scale (1.02x) + shadow increase
- **Active**: Darker color + shadow decrease
- **Disabled**: Opacity 50%, cursor not-allowed
- **Loading**: Spinner animation

### Links
- **Default**: Indigo color
- **Hover**: Underline + slightly darker
- **Visited**: Purple (#8B5CF6)
- **Active**: Darker blue

### Form Inputs
- **Focus**: Indigo border, glow shadow
- **Error**: Red border, error message below
- **Success**: Green checkmark on right
- **Disabled**: Gray background, cursor not-allowed

### Cards
- **Default**: Subtle shadow
- **Hover**: Increased shadow, slight lift
- **Active**: Indigo border highlight

---

## Dark Mode

All colors automatically adjust:
```
Text: White on dark backgrounds
Backgrounds: Dark gray (#1F2937) to near black (#0F172A)
Borders: Lighter gray (#374151)
Cards: Dark gray (#111827)
Hover states: Slightly lighter background
Shadows: Adjusted for visibility
```

### Dark Mode Toggle
Located in navbar top-right, smooth transition effect.

---

## Animations

### Transitions
```
Default: 200ms ease-in-out
Fast: 100ms ease-in-out
Slow: 300ms ease-in-out
```

### Effects
- **Page load**: Fade in + slight slide down (200ms)
- **Modal**: Scale from center + fade (300ms)
- **Toast**: Slide in from bottom (200ms)
- **Button hover**: Scale + shadow (200ms)
- **Loading**: Spinner rotation (infinite)
- **Success**: Checkmark animate (300ms)

---

## Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast**: All text meets 4.5:1 contrast ratio
- **Focus States**: Visible focus rings (2px indigo)
- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Readers**: Proper ARIA labels on all inputs
- **Font Size**: Minimum 16px base size
- **Line Height**: Minimum 1.4 for readability

### Skip Links
- "Skip to main content" link at top
- "Skip to footer" link at bottom

---

## Performance

### Loading States
- Skeleton screens for data-heavy sections
- Progressive image loading
- Lazy loading for modals
- Code splitting by route

### Optimization
- SVG icons (crisp at any size)
- CSS-in-JS for optimal bundle
- Next.js Image optimization
- Font subset loading (only Latin)

