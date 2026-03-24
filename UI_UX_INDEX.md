# UI/UX Documentation Index

## Quick Navigation

### For Visual Overview
- **[VISUAL_GUIDE.txt](VISUAL_GUIDE.txt)** - ASCII mockups of all 10 pages with layout structure
- **[UI_UX_SUMMARY.md](UI_UX_SUMMARY.md)** - What you'll see on each page, design highlights
- **[UI_UX_GUIDE.md](UI_UX_GUIDE.md)** - Detailed page-by-page breakdown with interactions

### For Design Specifications
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Complete design system with:
  - Color palette with hex codes
  - Typography specs (fonts, sizes, weights)
  - Component specifications (buttons, inputs, cards)
  - Spacing and border radius rules
  - Interactive states and animations
  - Dark mode specifications
  - Accessibility guidelines

### For Layout & Structure
- **[FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)** - File organization
- **[FILE_TREE.md](FILE_TREE.md)** - All files listed

---

## UI/UX Highlights

### Design Theme
- **Modern, Professional Healthcare**
- **Brand Color**: Indigo (#4F46E5) for trust and security
- **Accent Colors**: Emerald (success), Red (danger), Amber (warning)
- **Typography**: Sora (headings) + DM Sans (body)
- **Layout**: Sidebar navigation (responsive collapsible on mobile)

### Key Features
✓ 10 complete pages (Home, Login, Register, 3 Dashboards, Onboarding, Status)
✓ Dark mode toggle with system preference detection
✓ Fully responsive (mobile, tablet, desktop)
✓ WCAG 2.1 AA accessibility compliant
✓ Smooth animations and transitions
✓ Role-based user flows (Patient, Doctor, Admin)
✓ Clear status indicators and feedback
✓ Hospital-grade professional design

---

## Pages Included

1. **Home / Landing Page**
   - Hero section with CTA
   - Feature showcase
   - Navbar and footer

2. **Login Step 1 & 2**
   - Phone/email entry
   - OTP verification with countdown

3. **Patient Dashboard**
   - My Records (upload, view, download)
   - Doctor Access (approve/revoke)
   - Blockchain Verification

4. **Doctor Dashboard**
   - Access Requests (approve/reject)
   - Patient Records
   - Activity Log

5. **Admin Dashboard**
   - Pending Doctor Approvals
   - Hospital Management
   - Platform Analytics

6. **Doctor Onboarding (4 Steps)**
   - Personal Information
   - Document Upload
   - Selfie Verification
   - Review & Submit

7. **Status Pages**
   - Pending Approval
   - Rejected Application
   - Approved Notification

---

## How to View the UI/UX

### Option 1: See ASCII Mockups (5 minutes)
```bash
cat VISUAL_GUIDE.txt
```
Shows layout and structure of all pages.

### Option 2: Read Detailed Specs (15 minutes)
- Open **UI_UX_SUMMARY.md** for what each page looks like
- Open **DESIGN_SYSTEM.md** for complete design specifications

### Option 3: Run Locally and Preview (30 minutes)
```bash
npm install
npm run dev
```
Navigate to http://localhost:3000 to see the live app.

---

## Color Palette

**Indigo** (#4F46E5) - Primary buttons, links, focus states
**Emerald** (#10B981) - Approve, success, positive actions
**Red** (#EF4444) - Reject, delete, danger actions
**Amber** (#F59E0B) - Alerts, pending states, warnings
**Gray** (#F3F4F6) - Backgrounds, separators
**Dark Gray** (#1F2937) - Text, strong elements

---

## Typography

**Headings**: Sora font (Bold, SemiBold)
- H1: 48px
- H2: 36px
- H3: 24px
- H4: 20px
- H5: 16px

**Body**: DM Sans font (Regular, Medium)
- Large: 18px
- Base: 16px
- Small: 14px
- Tiny: 12px

**Code**: JetBrains Mono (for hashes, addresses)

---

## Component Overview

### Buttons
- **Primary (Indigo)**: Main actions
- **Secondary (Ghost)**: Alternative actions
- **Success (Emerald)**: Confirmations
- **Danger (Red)**: Destructive actions

### Inputs
- Text fields with validation states
- Phone input with auto-formatting
- File upload drag-and-drop zones
- OTP 6-digit input boxes
- Password toggle

### Cards
- White background with subtle shadow
- Hover effect: shadow increase + lift
- Used for records, requests, doctors, etc.

### Status Badges
- Verified (green ✓)
- Pending (amber ⏳)
- Approved (green)
- Rejected (red ✗)
- Processing (blue spinner)

### Navigation
- Sticky navbar (top)
- Collapsible sidebar (left, mobile-responsive)
- Breadcrumbs on detail pages
- Tab navigation for content sections

---

## Responsive Design

**Mobile** (< 640px)
- Hidden sidebar, hamburger menu
- Single column layout
- Full-width buttons
- Larger touch targets (48px min)

**Tablet** (640px - 1024px)
- Drawer sidebar
- 2-column grids
- Balanced spacing
- Touch-optimized

**Desktop** (> 1024px)
- Permanent sidebar
- Multi-column layouts
- Full feature visibility
- Optimized for productivity

---

## Accessibility Features

✓ WCAG 2.1 AA compliant
✓ 4.5:1 minimum color contrast
✓ Keyboard navigation (Tab, Enter, Esc)
✓ Screen reader labels (ARIA)
✓ Visible focus indicators (2px indigo rings)
✓ Minimum 16px base font size
✓ Line height 1.4-1.6 for readability
✓ Form validation messages
✓ Skip to main content links

---

## Animations & Interactions

- **Page Load**: Fade in + slide down (200ms)
- **Modal**: Scale from center (300ms)
- **Toast**: Slide in from bottom (200ms)
- **Button Hover**: Scale 1.02x + shadow (200ms)
- **Loading**: Spinner rotation (infinite)
- **Success**: Checkmark animate (300ms)

---

## File Locations

```
/
├── DESIGN_SYSTEM.md          ← Detailed design specs
├── UI_UX_SUMMARY.md          ← Page-by-page overview
├── VISUAL_GUIDE.txt          ← ASCII mockups
├── UI_UX_GUIDE.md            ← Detailed page breakdowns
└── src/
    ├── globals.css           ← Design tokens
    ├── components/           ← Navbar, Toast
    ├── app/                  ← All 10 pages
    ├── context/              ← Auth state
    └── lib/                  ← API, Firebase
```

---

## Next Steps

1. **Quick Look**: Read UI_UX_SUMMARY.md (5 min)
2. **Visual Check**: Look at VISUAL_GUIDE.txt (5 min)
3. **Full Specs**: Read DESIGN_SYSTEM.md (15 min)
4. **Live Preview**: Run `npm install && npm run dev` (30 min)

---

**Everything is ready to view. Start with UI_UX_SUMMARY.md!** 🎨
