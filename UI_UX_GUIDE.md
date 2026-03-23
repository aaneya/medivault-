# MediVault UI/UX Design Guide

## Design System Overview

**Brand Color**: Indigo (#4F46E5)
**Secondary**: Slate grays for accessibility
**Fonts**: 
- **Sora** (Headings) - Modern, geometric, clean
- **DM Sans** (Body) - Readable, professional
**Mode**: Light and Dark theme support
**Layout**: Mobile-first responsive design

---

## Color Palette

### Light Mode
- **Background**: #FFFFFF (white)
- **Secondary BG**: #F8FAFC (slate-50)
- **Text Primary**: #1E293B (slate-900)
- **Text Secondary**: #64748B (slate-500)
- **Brand**: #4F46E5 (indigo-600)
- **Success**: #10B981 (emerald-500)
- **Warning**: #F59E0B (amber-500)
- **Error**: #EF4444 (red-500)

### Dark Mode
- **Background**: #0F172A (slate-900)
- **Secondary BG**: #1E293B (slate-800)
- **Text Primary**: #F1F5F9 (slate-100)
- **Text Secondary**: #94A3B8 (slate-400)
- **Brand**: #6366F1 (indigo-500)

---

## Page Layouts

### 1. Home Page (Landing)
```
┌─────────────────────────────────┐
│         NAVBAR (Indigo)         │  ← Logo, Sign In, Register buttons
├─────────────────────────────────┤
│                                 │
│     🔐 Secure Medical Records  │  ← Large Hero H1
│                                 │
│  Blockchain-secured cloud store │  ← Subheading
│                                 │
│  [Sign In]  [Register]          │  ← CTA Buttons
│                                 │
├─────────────────────────────────┤
│  Features Grid (3 columns)      │  ← Security, Control, Verify
├─────────────────────────────────┤
│  How It Works (4 steps)         │  ← Signup → Verify → Upload → Share
├─────────────────────────────────┤
│        Ready to start?          │  ← Final CTA
│      [Get Started Now]          │
└─────────────────────────────────┘
```

**Design Notes**:
- Gradient background (light to light secondary)
- Large typography (Sora bold)
- High contrast CTA buttons
- Dark mode: Gradient from dark-900 to dark-800

---

### 2. Login Page (2-Step Auth)

#### Step 1: Credentials
```
┌──────────────────────────────┐
│      NAVBAR (Simple)         │
├──────────────────────────────┤
│                              │
│    Welcome Back to          │
│      MediVault              │
│                              │
│  Role Selection (Tabs):      │  ← Patient | Doctor | Admin
│  ◉ Patient  ○ Doctor  ○Admin │
│                              │
│  [Phone Input Field]         │  ← For patients
│  ┌──────────────────────┐    │
│  │ +1 _________________ │    │
│  └──────────────────────┘    │
│                              │
│  [Send OTP Button (Indigo)]  │
│                              │
│  Don't have an account?      │
│  [Register here]             │
│                              │
└──────────────────────────────┘
```

#### Step 2: OTP Verification
```
┌──────────────────────────────┐
│    Verify Your Phone         │
│                              │
│  Enter 6-digit code sent to  │
│  +1 (555) 123-4567          │
│                              │
│  [_] [_] [_] [_] [_] [_]     │  ← OTP boxes
│                              │
│  Resend in 45s (countdown)   │
│                              │
│  [Verify & Login (Button)]   │
│                              │
│  Wrong number? [Change]      │
└──────────────────────────────┘
```

**Design Notes**:
- Tab-based role selection (visual clarity)
- Large OTP input boxes (mobile accessibility)
- Countdown timer visible
- Error states: Red border + helper text
- Success state: Green checkmark

---

### 3. Patient Dashboard

```
┌─────────────────────────────────┐
│    NAVBAR + SIDEBAR             │
├──────────┬──────────────────────┤
│ ☰ Menu   │  Patient Dashboard   │
│ ⊡ Home   │  Welcome, John!      │
│ 📄 Records                      │
│ 🔐 Access                       │
│ ✓ Verify                        │
│ ⚙️ Settings                     │
├──────────┴──────────────────────┤
│  Stats Row (4 cards):           │
│  ┌──────────┬──────────┐        │
│  │ 5        │ 3        │        │
│  │ Records  │ Doctors  │        │
│  ├──────────┼──────────┤        │
│  │ 12       │ 100%     │        │
│  │ Verified │ Secure   │        │
│  └──────────┴──────────┘        │
│                                 │
│  TABS: Records | Access | Ver   │
│  ┌─────────────────────────┐    │
│  │ [+ Upload New Record]   │    │
│  │ Record 1 - Jan 15       │    │
│  │ [View] [Share] [Delete] │    │
│  │ ───────────────────────│    │
│  │ Record 2 - Jan 10       │    │
│  │ [View] [Share] [Delete] │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

**Design Notes**:
- Left sidebar (collapsible on mobile)
- Stat cards with icons and colors
- Tab navigation (Records/Access/Verify)
- Action buttons on each record row
- Floating action button for "Upload"

---

### 4. Doctor Dashboard

```
┌─────────────────────────────────┐
│    NAVBAR + SIDEBAR             │
├──────────┬──────────────────────┤
│ ☰ Menu   │  Doctor Dashboard    │
│ ⊡ Home   │  Welcome, Dr. Smith! │
│ 👥 Patients                     │
│ 🔔 Requests                     │
│ 📄 Upload                       │
│ 📋 Audit Log                    │
├──────────┴──────────────────────┤
│  Pending Requests (Badge: 3):   │
│  ┌─────────────────────────┐    │
│  │ John Doe                │    │
│  │ Requested: Jan 15       │    │
│  │ [Request: Cardiology]   │    │
│  │ [✓ Approve] [✗ Decline] │    │
│  ├─────────────────────────┤    │
│  │ Jane Smith              │    │
│  │ [✓ Approve] [✗ Decline] │    │
│  └─────────────────────────┘    │
│                                 │
│  My Patients (10 total):        │
│  ┌─────────────────────────┐    │
│  │ John Doe - Approved     │    │
│  │ [View Records]          │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

**Design Notes**:
- Request cards with approval buttons
- Badge showing pending count (red)
- Doctor status indicator (verified/unverified)
- Quick action buttons

---

### 5. Admin Dashboard

```
┌─────────────────────────────────┐
│    NAVBAR + SIDEBAR             │
├──────────┬──────────────────────┤
│ ☰ Menu   │  Admin Dashboard     │
│ ⊡ Home   │  Platform Overview   │
│ 👨 Doctors                      │
│ 👥 Users                        │
│ 📊 Stats                        │
│ ⚙️ Settings                     │
├──────────┴──────────────────────┤
│  Quick Stats:                   │
│  ┌──────────┬────────┬────────┐ │
│  │ 150      │ 45     │ 1200   │ │
│  │ Doctors  │ Pending│ Records│ │
│  └──────────┴────────┴────────┘ │
│                                 │
│  Pending Doctor Approvals:      │
│  ┌─────────────────────────┐    │
│  │ Dr. Michael Chen        │    │
│  │ Applied: Jan 15         │    │
│  │ [View Docs] [Approve]   │    │
│  │ [Reject - Reason ▼]     │    │
│  ├─────────────────────────┤    │
│  │ Dr. Sarah Johnson       │    │
│  │ [View Docs] [Approve]   │    │
│  └─────────────────────────┘    │
│                                 │
│  Activity Log (Last 10):        │
│  Dr. John - Approved - 1h ago   │
│  Record uploaded - 45m ago      │
└─────────────────────────────────┘
```

**Design Notes**:
- Large stat cards
- Approval workflow cards
- Modal for reject reason
- Activity timeline

---

### 6. Doctor Onboarding (4-Step Wizard)

#### Step 1: Basic Info
```
┌──────────────────────────────┐
│  Doctor Registration         │  ← H2
│  Step 1 of 4: Basic Info     │  ← Progress indicator
│                              │
│  ■■□□ Progress bar           │
│                              │
│  Full Name                   │
│  [________________________]   │
│                              │
│  Email                       │
│  [________________________]   │
│                              │
│  Medical License #           │
│  [________________________]   │
│                              │
│  Hospital/Clinic Name        │
│  [________________________]   │
│                              │
│  [Back]  [Next (Indigo)]     │
└──────────────────────────────┘
```

#### Step 2: Document Upload
```
┌──────────────────────────────┐
│  Step 2 of 4: Documents      │
│  ■■■□ Progress bar           │
│                              │
│  Medical Degree Certificate  │
│  [Drop zone / Upload Button] │
│  Upload_2023.pdf (✓)        │
│                              │
│  Medical License             │
│  [Drop zone / Upload Button] │
│  License_2023.pdf (✓)       │
│                              │
│  Government ID               │
│  [Drop zone / Upload Button] │
│  ID_scan.pdf (✓)            │
│                              │
│  [Back]  [Next (Indigo)]     │
└──────────────────────────────┘
```

#### Step 3: Selfie Verification
```
┌──────────────────────────────┐
│  Step 3 of 4: Selfie        │
│  ■■■■□ Progress bar          │
│                              │
│  Take a photo of yourself    │
│  for identity verification   │
│                              │
│  ┌──────────────────────┐    │
│  │                      │    │
│  │  📷 [Take Photo]     │    │
│  │  Or Upload from      │    │
│  │  Device              │    │
│  │                      │    │
│  └──────────────────────┘    │
│                              │
│  [Back]  [Next (Indigo)]     │
└──────────────────────────────┘
```

#### Step 4: Review & Submit
```
┌──────────────────────────────┐
│  Step 4 of 4: Review        │
│  ■■■■ Progress bar (100%)    │
│                              │
│  ✓ Basic Information         │
│  ✓ Documents Uploaded        │
│  ✓ Selfie Verified          │
│                              │
│  All information looks good! │
│                              │
│  Application Status:         │
│  Pending Hospital Review     │
│                              │
│  ⓘ You'll receive an email   │
│    when your application     │
│    is reviewed (2-3 days)    │
│                              │
│  [Back]  [Submit (Green)]    │
└──────────────────────────────┘
```

**Design Notes**:
- Progress bar (visual progress)
- Step indicators
- File upload zones (drag & drop)
- File preview with checkmarks
- Clear submission message
- Color-coded buttons (Blue next, Green submit)

---

## Component Styles

### Buttons
```
Primary (Indigo):
┌─────────────────┐
│  Sign In        │  ← Indigo BG, white text
└─────────────────┘

Secondary (Gray):
┌─────────────────┐
│  Register       │  ← Gray BG, indigo text
└─────────────────┘

Danger (Red):
┌─────────────────┐
│  Delete         │  ← Red BG, white text
└─────────────────┘

Disabled (Gray):
┌─────────────────┐
│  Verify         │  ← Gray BG, gray text, cursor disabled
└─────────────────┘
```

### Cards
```
Record Card:
┌────────────────────────┐
│ Cardiology Report      │  ← Title (Sora)
│ Jan 15, 2024          │  ← Date (DM Sans)
│ 2.4 MB                │  ← Size
├────────────────────────┤
│ [View] [Share] [Delete]│  ← Actions
└────────────────────────┘
```

### Form Inputs
```
Normal:
┌─────────────────────────┐
│ +1 (555) 123-4567      │  ← Input text
└─────────────────────────┘

Error:
┌─────────────────────────┐  Red border
│ invalid@email           │
└─────────────────────────┘
Phone number is invalid

Success:
┌─────────────────────────┐  Green border
│ john.doe@hospital.com   │  ✓
└─────────────────────────┘
```

### Notifications
```
Toast (Top Right):
┌──────────────────────────┐
│ ✓ Record uploaded        │  ← Green
│   successfully           │
└──────────────────────────┘

Error Toast:
┌──────────────────────────┐
│ ✗ Upload failed          │  ← Red
│   File size too large    │
└──────────────────────────┘
```

---

## Responsive Design

### Mobile (< 640px)
- Full-width layout
- Sidebar becomes hamburger menu
- Stack cards vertically
- Touch-friendly buttons (48px min height)
- Large text (18px+)

### Tablet (640px - 1024px)
- Sidebar visible but narrow
- 2-column layouts
- Same card styling

### Desktop (> 1024px)
- Sidebar always visible
- Multi-column layouts
- Cards in grid (2-4 columns)
- Optimized spacing

---

## Accessibility Features

✓ WCAG 2.1 AA compliant
✓ High contrast ratios (4.5:1 minimum)
✓ Keyboard navigation support
✓ ARIA labels on interactive elements
✓ Focus indicators on all buttons
✓ Dark mode support
✓ Large text options
✓ Screen reader optimized

---

## Design Tokens (Tailwind)

**Colors**: Indigo brand (#4F46E5)
**Spacing**: 4px base unit (p-4, gap-6, etc.)
**Typography**: Sora + DM Sans
**Shadows**: Subtle shadows for depth
**Borders**: Rounded corners (rounded-lg)
**Breakpoints**: Mobile-first (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)

---

## Animation & Transitions

- **Page transitions**: Fade in 200ms
- **Hover states**: Scale 105% on buttons
- **Loading states**: Spinner animation
- **Modals**: Fade in + scale up
- **Alerts**: Slide in from top

---

## Next Steps

1. Run `npm run dev` to see the UI in action
2. Navigate to `http://localhost:3000`
3. Test all pages and flows
4. Verify responsive design on mobile (DevTools)
5. Check dark mode toggle in navbar
