# FIGMA DESIGN SPECIFICATIONS
## Nata Group - Metro Paragon Residence Monitoring System

---

## 1. FIGMA FILE STRUCTURE

### Workspace Organization:
```
Nata Group - Metro Paragon Monitoring System
├── 01_Design System
│   ├── Colors & Tokens
│   ├── Typography
│   ├── Icons & Assets
│   ├── Components (Base)
│   └── Spacing & Sizing
│
├── 02_Authentication
│   ├── Login Screen
│   ├── Forgot Password
│   ├── Reset Password
│   └── Sign Up (if applicable)
│
├── 03_Dashboard & Main Views
│   ├── Dashboard (Light)
│   ├── Dashboard (Dark)
│   ├── Navigation Sidebar
│   ├── Header & Top Nav
│   └── Mobile Layouts
│
├── 04_Project Management
│   ├── Projects List
│   ├── Project Overview
│   ├── Blocks Management
│   ├── Block Detail View
│   └── Photo Gallery
│
├── 05_Monitoring & Progress
│   ├── Progress Tracking Main
│   ├── Gantt Chart Timeline
│   ├── Milestone Management
│   ├── Phase Details
│   └── Progress Charts
│
├── 06_Financial Analytics
│   ├── Budget Dashboard
│   ├── Spending Report
│   ├── Variance Analysis
│   ├── Cash Flow Chart
│   └── Transaction List
│
├── 07_Documents Management
│   ├── Document Library
│   ├── Upload Modal
│   ├── Document Preview
│   ├── Approval Workflow
│   └── Version History
│
├── 08_Live Data & Monitoring
│   ├── Real-time Metrics
│   ├── Alert Dashboard
│   ├── Alert Details
│   └── Data Visualization
│
├── 09_User Management
│   ├── User List
│   ├── User Detail
│   ├── Add User Modal
│   ├── Role Management
│   └── Activity Logs
│
├── 10_Reports
│   ├── Report Templates
│   ├── Report Builder
│   ├── Report Preview
│   └── Export Options
│
├── 11_Settings
│   ├── Account Settings
│   ├── Notification Preferences
│   ├── System Settings
│   └── Data Management
│
└── 12_Variants & States
    ├── Empty States
    ├── Loading States
    ├── Error States
    ├── Success States
    └── Mobile Variants
```

---

## 2. COLOR PALETTE (FIGMA STYLES)

### Primary Colors:
```
Deep Navy Blue
Hex: #1F2937
RGB: 31, 41, 55
Usage: Headers, sidebars, primary text, primary backgrounds
Component: background-primary

Accent Orange
Hex: #F97316
RGB: 249, 115, 22
Usage: CTAs, highlights, important status
Component: color-accent

Success Green
Hex: #22C55E
RGB: 34, 197, 94
Usage: Completed status, success messages, positive indicators
Component: color-success

Warning Yellow
Hex: #FBBF24
RGB: 251, 191, 36
Usage: Warnings, pending status, caution alerts
Component: color-warning

Danger Red
Hex: #EF4444
RGB: 239, 68, 68
Usage: Errors, critical alerts, danger actions
Component: color-danger

Neutral Gray
Hex: #6B7280
RGB: 107, 114, 128
Usage: Secondary text, borders, disabled elements
Component: color-neutral
```

### Secondary Colors:
```
Light Gray (Backgrounds):
Hex: #F9FAFB
RGB: 249, 250, 251
Usage: Cards, content backgrounds

Dark Gray (Borders):
Hex: #E5E7EB
RGB: 229, 231, 235
Usage: Borders, dividers

White:
Hex: #FFFFFF
Usage: Primary background, text on dark

Dark Text:
Hex: #111827
Usage: Main text color (light mode)

Light Text:
Hex: #F3F4F6
Usage: Text color (dark mode)
```

### Dark Mode Palette:
```
Dark Background: #0F172A
Card Background: #1E293B
Border Color: #334155
Text Primary: #F1F5F9
Text Secondary: #CBD5E1
```

---

## 3. TYPOGRAPHY (FIGMA STYLES)

### Font Families:
- **Heading Font**: Inter Bold (Google Fonts)
- **Body Font**: Inter Regular (Google Fonts)
- **Code Font**: IBM Plex Mono (Google Fonts)

### Text Styles:

#### Headings:
```
H1 - Main Title
Font: Inter Bold, 48px
Line Height: 57.6px (1.2x)
Letter Spacing: -0.5px
Color: #1F2937

H2 - Section Title
Font: Inter Bold, 32px
Line Height: 38.4px (1.2x)
Letter Spacing: -0.3px
Color: #1F2937

H3 - Subsection
Font: Inter SemiBold, 24px
Line Height: 28.8px (1.2x)
Letter Spacing: 0px
Color: #1F2937

H4 - Card Title
Font: Inter SemiBold, 18px
Line Height: 27px (1.5x)
Letter Spacing: 0px
Color: #1F2937

H5 - Label Title
Font: Inter SemiBold, 14px
Line Height: 21px (1.5x)
Letter Spacing: 0px
Color: #1F2937
```

#### Body Text:
```
Body Large
Font: Inter Regular, 16px
Line Height: 24px (1.5x)
Letter Spacing: 0px
Color: #374151

Body Normal
Font: Inter Regular, 14px
Line Height: 21px (1.5x)
Letter Spacing: 0px
Color: #374151

Body Small
Font: Inter Regular, 13px
Line Height: 19.5px (1.5x)
Letter Spacing: 0px
Color: #6B7280

Caption
Font: Inter Regular, 12px
Line Height: 18px (1.5x)
Letter Spacing: 0.5px
Color: #9CA3AF

Micro
Font: Inter Regular, 11px
Line Height: 16.5px (1.5x)
Letter Spacing: 0px
Color: #9CA3AF
```

#### Code:
```
Code Block
Font: IBM Plex Mono, 13px
Line Height: 19.5px
Letter Spacing: 0px
Color: #1E293B
Background: #F1F5F9
Padding: 12px 16px
Border Radius: 8px
```

---

## 4. COMPONENT LIBRARY (FIGMA COMPONENTS)

### 4.1 Button Components

**Button - Primary (Default)**
```
Size: 40px height
Padding: 8px 16px (sm), 12px 24px (md), 16px 32px (lg)
Background: #F97316 (Accent Orange)
Text: White, Inter SemiBold, 14px
Border Radius: 8px
State: Default, Hover (+10% darker), Active (-10% lighter), Disabled (opacity 50%)
```

**Button - Secondary**
```
Background: Transparent
Border: 2px solid #E5E7EB
Text: #1F2937
Hover: Background #F9FAFB
Similar to Primary for sizing
```

**Button - Danger**
```
Background: #EF4444
Text: White
Similar structure to Primary
```

**Button - Icon**
```
Size: 40x40px (circle)
Background: Transparent on default
Content: Icon (24px)
Hover: Background #F9FAFB
```

### 4.2 Card Component

```
Background: White (#FFFFFF)
Border Radius: 12px
Padding: 20px (standard)
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Hover State: Shadow increase, slight scale

Dark Mode:
Background: #1E293B
Border: 1px solid #334155
```

### 4.3 Input Field Component

```
Height: 40px
Padding: 8px 12px
Border: 1px solid #E5E7EB
Border Radius: 8px
Font: Inter, 14px
Placeholder Color: #9CA3AF
Focus State: Border #F97316, Shadow 0 0 0 3px rgba(249, 115, 22, 0.1)
Disabled: Background #F9FAFB, opacity 50%
```

### 4.4 Select/Dropdown

```
Similar to Input Field
Icon: Chevron Down (right side)
Dropdown Menu: Positioned below, width matches input
Menu Items: 40px height, hover background #F9FAFB
```

### 4.5 Checkbox & Radio Button

```
Checkbox:
Size: 20x20px
Border: 2px solid #E5E7EB
Border Radius: 4px
Checked: Background #F97316, checkmark icon white

Radio Button:
Size: 20x20px
Border Radius: 50% (circle)
Similar checked state with filled circle
```

### 4.6 Badge/Status Indicator

```
Completed: Green (#22C55E) background, white text, 8px padding
In Progress: Blue background, white text
Pending: Yellow (#FBBF24) background, dark text
Delayed: Red (#EF4444) background, white text
Border Radius: 20px (pill shape)
Font: Inter, 12px, SemiBold
```

### 4.7 Progress Bar

```
Height: 8px
Background: #E5E7EB (light gray)
Fill: Green (#22C55E)
Border Radius: 4px
Animated fill: Linear transition 600ms
```

### 4.8 Modal/Dialog

```
Background: White with shadow overlay (50% opacity black)
Width: 90vw max 600px (desktop)
Border Radius: 16px
Padding: 24px
Header: Include close button (top right)
Footer: Action buttons (right-aligned)
Animation: Scale + fade in/out (300ms)
```

### 4.9 Toast/Notification

```
Position: Top-right, fixed
Width: 400px max
Padding: 16px
Border Radius: 8px
Shadow: Medium shadow
Auto-dismiss: 3-5 seconds

Success: Green background (#22C55E), white text
Error: Red background (#EF4444), white text
Info: Blue background, white text
Warning: Yellow background, dark text
```

### 4.10 Table Component

```
Header Row:
Background: #F9FAFB
Font: Inter SemiBold, 12px
Color: #6B7280
Padding: 12px 16px
Text-align: Left (default)

Data Rows:
Height: 48px
Padding: 12px 16px
Border-bottom: 1px solid #E5E7EB
Hover: Background #F9FAFB

Sorting Indicator: Arrow icon on header hover
Pagination: Bottom-right, 10/25/50 options
```

### 4.11 Pagination

```
Layout: [Previous] [1] [2] [3] ... [Next]
Button Style: Secondary (outlined)
Active Page: Primary (filled)
Height: 36px
Font: Inter, 14px
Spacing: 8px between items
```

### 4.12 Navigation - Sidebar

```
Width: 280px (desktop), collapse to 80px on mobile
Height: 100vh (full viewport)
Background: #1F2937 (Deep Navy)
Padding: 20px 12px
Logo Area: 60px height, centered
Menu Items: 48px height, flex centered vertically
Text: White, Inter Regular, 14px
Icons: White, 24px
Active Item: 
  - Background: rgba(249, 115, 22, 0.1)
  - Left border: 4px #F97316 (orange)
  - Text: White
Hover State: Background rgba(255, 255, 255, 0.05)
```

### 4.13 Navigation - Top Bar

```
Height: 64px
Background: White (#FFFFFF) or Dark (#0F172A) in dark mode
Padding: 0 24px
Display: Flex, space-between
Left: Logo/Breadcrumb
Right: Search bar, notifications, user menu
Border-bottom: 1px solid #E5E7EB
Shadow: Light shadow for depth
```

### 4.14 Chart Components (Recharts)

```
Line Chart:
Colors: Use brand colors (#F97316 primary, #22C55E secondary)
Stroke Width: 2px
Dots: 4px radius
Tooltip: Dark background, white text
Legend: Below chart, horizontal alignment

Bar Chart:
Bar Width: 60% of available space
Colors: Same color palette
Hover: Highlight individual bar with glow effect
Spacing: 8px between bar groups

Pie/Donut Chart:
Color: Each segment different from palette
Labels: Outside chart with lines to segments
Center Text (donut): Large number with label below

Gauge Chart:
Background: Light gray arc
Fill: Green → Yellow → Red gradient
Center: Large percentage number
```

---

## 5. SPACING & SIZING SCALE (FIGMA TOKENS)

### Spacing Scale:
```
xs: 4px
sm: 8px
md: 16px (base unit)
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

### Border Radius:
```
sm: 4px (small elements, tight corners)
md: 8px (buttons, inputs, small cards)
lg: 12px (cards, panels)
xl: 16px (larger components)
full: 9999px (circles, pills)
```

### Shadows:
```
Shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
Shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
Shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
Shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
Shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

---

## 6. KEY SCREEN DESIGNS

### 6.1 LOGIN SCREEN

**Layout**:
- Center aligned vertical layout
- Max width: 400px
- Background: Light gray (#F9FAFB)

**Elements**:
1. **Logo**: 64x64px, centered, 48px margin-bottom
2. **Title**: "Welcome to Nata Group"
   - Font: H2 (32px bold)
   - Color: #1F2937
   - Margin-bottom: 8px
3. **Subtitle**: "Project Monitoring System"
   - Font: Body Large (16px)
   - Color: #6B7280
   - Margin-bottom: 32px
4. **Email Field**:
   - Label: "Email Address"
   - Input: Standard 40px height
   - Margin-bottom: 16px
5. **Password Field**:
   - Label: "Password"
   - Input: Standard 40px height with eye toggle icon
   - Margin-bottom: 8px
6. **Forgot Password Link**:
   - Right-aligned, 12px font, blue color (#3B82F6)
   - Margin-bottom: 24px
7. **Login Button**:
   - Primary button, full width 40px height
   - Text: "Sign In"
   - Margin-bottom: 16px
8. **Footer Text**:
   - Center aligned, 12px, gray color
   - "© 2026 Nata Group. All rights reserved."

---

### 6.2 DASHBOARD SCREEN

**Header Section** (Height: 64px):
- Left: Logo (24x24px) + "Nata Group" text
- Center: "Dashboard" title
- Right: Search bar (200px) + Notifications bell + User menu

**Main Layout** (2-column):

**Left Sidebar** (280px):
- Navigation menu with 8-10 items
- User profile card at bottom (optional)

**Content Area**:
1. **Top Section - Quick Stats** (4 cards in 1x4 grid):
   ```
   [Overall Progress %]  [Budget Status]
   [Timeline Status]     [Active Workers]
   ```
   Card size: ~280px width each
   Content: Large number, label, trend indicator

2. **Middle Section** (2-column grid):
   - Left: Progress Chart (Bar chart or Progress meter)
   - Right: Timeline Gantt view
   Height: 300px each

3. **Bottom Section** (Full width):
   - Recent alerts & notifications feed
   - 3-4 alerts displayed
   Height: 250px

4. **Footer Quick Access** (Horizontal scroll):
   - Block cards (image + title + %completion)
   - 4-5 blocks visible at once

---

### 6.3 PROGRESS TRACKING SCREEN

**Layout** (3-section):

**Left Panel** (300px, Sidebar):
- Filter Section:
  - Status filter (checkboxes)
  - Phase filter (dropdown)
  - Block filter (dropdown)
  - Date range picker
  Height: ~350px

**Center Panel** (Main content):
- Gantt Timeline at top (500px height)
  - Phases as rows
  - Milestones as bars
  - Color: Green for completed, Yellow for in-progress, Gray for pending
- Block List below (scrollable)
  - Table with columns: Block Name, Status, %, Phase, Responsible
  - Each row: 48px height
  - Hover: Light background highlight
  - Click: Expand row for details

**Right Panel** (Optional detail view):
- When block selected:
  - Block name & image
  - Current phase details
  - Upcoming milestones
  - Team members assigned
  - Photo gallery preview
  - Comments feed

---

### 6.4 FINANCIAL ANALYTICS SCREEN

**Header** (50px):
- Title: "Financial Analytics"
- Date range picker
- Export button

**Content Sections**:

1. **Budget Summary Cards** (1x3 grid):
   ```
   [Total Budget] [Spent] [Remaining]
   ```

2. **Charts Section** (2-column):
   - Left: Budget vs Actual (Line chart) - 400px height
   - Right: Category Breakdown (Pie chart) - 400px height

3. **Variance Analysis Table**:
   - Full width
   - Columns: Category, Allocated, Spent, Variance %, Status
   - Color code rows by variance
   - Sortable columns
   Height: 400px scrollable

4. **Cash Flow Projection**:
   - Line chart showing projected spending
   - Full width
   Height: 300px

5. **Recent Transactions**:
   - Scrollable list/table
   - Columns: Date, Description, Category, Amount, Status
   Height: 300px scrollable

---

### 6.5 DOCUMENT MANAGEMENT SCREEN

**Layout** (2-panel):

**Left Panel** (Tree View, 300px):
- Document categories tree
- Expandable/collapsible
- Icons for different types

**Right Panel** (Main content, auto-expand):

1. **Top Section**:
   - Breadcrumb navigation
   - Search bar
   - Buttons: [Upload] [New Folder]
   Height: 50px

2. **Middle Section** (Document List):
   - List/Grid toggle
   - Columns: Name, Type, Version, Date, Status, Actions
   - Each item: 48px height
   - Hover: Show quick action icons (preview, download, delete)
   - Right-click context menu available

3. **Preview Section** (Bottom or modal):
   - Document preview (PDF, image, etc.)
   - If modal: Full-screen with close button
   Height: 400px

---

### 6.6 LIVE DATA MONITORING SCREEN

**Layout** (Dashboard style):

1. **Status Indicators Row** (Top):
   - 4-5 large metric cards
   - Circular gauge style
   - Values displayed large (48px font)
   - Trend indicator (↑/↓)
   Height: 150px
   Example cards: Temperature, Workers, Safety Incidents, Equipment Status

2. **Alert Panel** (Left side, 300px):
   - Title: "Active Alerts"
   - Alert list (scrollable)
   - Each alert: 60px height
   - Color coded (red/yellow/blue)
   - Show timestamp & source

3. **Charts Section** (Right, 2x2 grid):
   - Temperature trend (line chart)
   - Worker count timeline
   - Incident timeline
   - Equipment uptime

4. **Map View** (Bottom, if available):
   - Project site map
   - Sensor locations marked with status indicators
   - Interactive tooltips

---

### 6.7 USER MANAGEMENT SCREEN

**Layout** (Table + Form):

**Header Section** (50px):
- Title: "User Management"
- [Add New User] button

**Main Section** (Table):
- Columns: Name, Email, Role, Department, Status, Last Login, Actions
- Each row: 48px height
- Pagination: 10/25/50 per page
- Sortable columns
- Action icons: Edit (pencil), Delete (trash)
- Hover: Show action icons

**Form Section** (Modal when adding/editing):
- Modal: 500px width
- Fields:
  - Full Name (text input)
  - Email (email input)
  - Role (dropdown)
  - Department (dropdown)
  - Status (toggle active/inactive)
- Buttons: [Cancel] [Save]

---

## 7. RESPONSIVE BREAKPOINTS & MOBILE VARIANTS

### Breakpoints:
```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: 1024px - 1440px
Large: > 1440px
```

### Mobile Variants:
- Sidebar → Bottom navigation (48px height, 5 main items)
- 2-column → 1-column stacked
- Chart cards → Smaller cards, scrollable horizontally
- Table → Simplified list view with essential columns only
- Modals → Full-screen dialogs on mobile
- Font sizes → Slightly reduced (14px base instead of 16px)

---

## 8. DARK MODE SPECIFICATIONS

### Color Adjustments:
- Backgrounds: #0F172A (very dark) → #1E293B (cards)
- Text: #F1F5F9 (primary) → #CBD5E1 (secondary)
- Borders: #334155 (darker)
- Cards: Darker background with subtle border

### Component Adjustments:
- Input fields: Dark background (#1E293B), white text
- Buttons: Same colors (orange stays orange)
- Charts: Adjust text color to light, background to dark
- Sidebar: Same deep navy (can stay same)
- Cards: Dark background instead of white

---

## 9. ANIMATION & MICRO-INTERACTIONS (FIGMA PROTOTYPES)

### Transitions:
```
Fast: 150ms (hover effects)
Normal: 300ms (page transitions, modals)
Slow: 500ms (chart animations, complex transitions)
```

### Interactions to Prototype:
1. **Button Hover**: Color shift + slight scale (1.05x)
2. **Modal Open**: Scale from center (0.95x → 1x) + fade
3. **Form Input Focus**: Border color change + subtle glow
4. **Table Row Hover**: Background color change
5. **Notification Toast**: Slide in from right + fade out
6. **Chart Load**: Smooth animation of data visualization
7. **Page Transition**: Fade effect between pages
8. **Dropdown Open**: Slide down animation
9. **Progress Bar Fill**: Smooth linear animation

---

## 10. EXPORT & HANDOFF CHECKLIST

### Assets to Export:
- [ ] All components as individual files (PNG, SVG)
- [ ] Icon set (SVG format)
- [ ] Color palette (CSS variables)
- [ ] Typography specs (CSS)
- [ ] Button variants
- [ ] Form components
- [ ] Chart examples
- [ ] Empty states
- [ ] Error states
- [ ] Loading states

### Documentation to Provide:
- [ ] Component specs sheet (dimensions, padding, spacing)
- [ ] Interaction specifications
- [ ] Responsive breakpoint rules
- [ ] Dark mode specifications
- [ ] Animation timings
- [ ] Font weights and sizes
- [ ] Shadow definitions
- [ ] Border radius values

### Developer Handoff:
- [ ] Design file with organized layers
- [ ] Component naming conventions
- [ ] CSS variable names/tokens
- [ ] Figma link with view access
- [ ] Design tokens export (JSON)
- [ ] Prototype for user flows

---

## 11. DESIGN QUALITY CHECKLIST

### Before Final Handoff:
- [ ] All text is readable (contrast ratio 4.5:1)
- [ ] All components are properly sized (40px minimum tap target)
- [ ] Color palette is consistent across all screens
- [ ] Typography hierarchy is clear
- [ ] Spacing is consistent (using design scale)
- [ ] Icons are uniform in style
- [ ] Shadows are consistent
- [ ] Border radius is consistent
- [ ] All states are designed (hover, focus, active, disabled)
- [ ] Dark mode is implemented
- [ ] Mobile responsive layouts exist
- [ ] All interactions are prototyped
- [ ] Naming conventions are followed
- [ ] Assets are organized in layers
- [ ] All components are reusable

---

## DESIGN SYSTEM SUMMARY

**Overall Aesthetic**: Professional, modern, data-focused  
**Color Philosophy**: Navy + Orange + Green (trustworthy + energetic + positive)  
**Typography**: Inter (modern, clean, highly readable)  
**Spacing**: Generous (20-24px padding, 16px unit base)  
**Component Philosophy**: Reusable, consistent, accessible  
**Animation Philosophy**: Subtle, purposeful, performance-optimized  

---

**Document Version**: 1.0  
**Created**: 2026  
**Status**: Ready for Implementation  
**Next Phase**: Figma file creation and component development
