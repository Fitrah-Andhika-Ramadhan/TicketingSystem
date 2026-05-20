# VISUAL MOCKUP & WIREFRAME GUIDE
## Nata Group - Metro Paragon Residence Monitoring System

---

## 1. OVERALL LAYOUT STRUCTURE

### Standard Page Layout (Desktop):
```
┌──────────────────────────────────────────────────────┐
│  HEADER (64px)                                        │
│  Logo | Page Title | Search | Notifications | User    │
├────────────┬──────────────────────────────────────────┤
│            │                                          │
│  SIDEBAR   │  MAIN CONTENT AREA                      │
│  (280px)   │                                          │
│            │  Content fills responsive grid           │
│  Logo      │  - Cards                                │
│  Menu      │  - Charts                               │
│  Items     │  - Tables                               │
│  User      │  - Forms                                │
│            │                                          │
│            │                                          │
└────────────┴──────────────────────────────────────────┘
```

### Mobile Layout:
```
┌─────────────────────┐
│  HEADER (64px)      │
│  Logo | Menu | User │
├─────────────────────┤
│ MAIN CONTENT        │
│ (Full Width)        │
│ Single Column       │
│ Stacked Cards       │
│                     │
│                     │
├─────────────────────┤
│ BOTTOM NAV (48px)   │
│ [Home] [Progress]   │
│ [Finance] [Docs]    │
└─────────────────────┘
```

---

## 2. LOGIN SCREEN WIREFRAME

```
                        ┌─────────────────┐
                        │                 │
                        │  [LOGO - 64px]  │
                        │                 │
                        ├─────────────────┤
                        │                 │
                        │  Welcome to      │
                        │  Nata Group      │
                        │                 │
                        │  Project Monitor │
                        │  System          │
                        │                 │
                        ├─────────────────┤
                        │                 │
                        │ [Email Field]   │
                        │                 │
                        │ [Password Field]│
                        │                 │
                        │ [Forgot Pass]   │
                        │                 │
                        │ [Login Button]  │
                        │  (Orange, Full) │
                        │                 │
                        │ © 2026 Nata Grp │
                        │                 │
                        └─────────────────┘
```

---

## 3. DASHBOARD WIREFRAME

```
┌───────────────────────────────────────────────────────────────┐
│ LOGO | Dashboard | SEARCH BAR | 🔔 | 👤                      │
├──────────────┬───────────────────────────────────────────────┤
│              │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────┐
│  Dashboard   │ │Progress  │ │ Budget   │ │Timeline  │ │...  │
│  Projects    │ │87%       │ │ $950K    │ │ On Track │ │Card4│
│  Blocks      │ │          │ │ / $1M    │ │          │ │     │
│  Progress    │ └──────────┘ └──────────┘ └──────────┘ └─────┘
│  Financial   │
│  Documents   │ ┌──────────────────┐ ┌──────────────────┐
│  Live Data   │ │   Progress       │ │   Timeline View  │
│  Users       │ │   Chart          │ │                  │
│  Reports     │ │   (Line/Bar)     │ │   [Gantt Chart]  │
│  Settings    │ │                  │ │                  │
│              │ └──────────────────┘ └──────────────────┘
│              │
│   👤 User    │ ┌────────────────────────────────────────┐
│              │ │ Recent Alerts & Notifications          │
│              │ │ [Alert 1] [Alert 2] [Alert 3]         │
│              │ └────────────────────────────────────────┘
│              │
│              │ ┌────────────────────────────────────────┐
│              │ │ Quick Access Blocks                    │
│              │ │ [Block A] [Block B] [Block C] [Block D]│
│              │ └────────────────────────────────────────┘
└──────────────┴───────────────────────────────────────────────┘
```

---

## 4. PROGRESS TRACKING WIREFRAME

```
┌──────────────┬───────────────────────────────────────────────┐
│              │ Filters | Progress Tracking                   │
│ ┌──────────┐ │                                               │
│ │ Status   │ │ ┌────────────────────────────────────────┐  │
│ │ ☑ Active │ │ │ Gantt Timeline View                    │  │
│ │ ☑ Pending│ │ │ [Phase 1 ██████░░] [Milestone >]       │  │
│ │ ☑ Done   │ │ │ [Phase 2 ███████░] [Milestone >]       │  │
│ │ ☐ Delayed│ │ │ [Phase 3 ████░░░░] [Milestone >]       │  │
│ │          │ │ │ [Phase 4 ██░░░░░░] [Milestone >]       │  │
│ ├──────────┤ │ └────────────────────────────────────────┘  │
│ │ Phase    │ │                                               │
│ │ [Select] │ │ Block Progress List:                        │
│ │          │ │ ┌─────────────────────────────────────────┐ │
│ │ ├──────┤ │ │ Name │ Status │ % │ Phase │ Manager    │ │
│ │ │Fndtn │ │ ├─────────────────────────────────────────┤ │
│ │ │Struct│ │ │BlockA│ Active │ 85│ Struct│ John       │ │
│ │ │Finish│ │ │BlockB│ Pending│ 60│ Struct│ Sarah      │ │
│ │ └──────┘ │ │BlockC│ Done   │100│ Fndtn │ Mike       │ │
│ │          │ │BlockD│ Active │ 45│ Finish│ Lisa       │ │
│ │ ┌──────┐ │ └─────────────────────────────────────────┘ │
│ │ │Date  │ │                                               │
│ │ │Range │ │ Photo Gallery for Selected Block:            │
│ │ └──────┘ │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│ │          │ │Photo1│ │Photo2│ │Photo3│ │Photo4│        │
│ │          │ └──────┘ └──────┘ └──────┘ └──────┘        │
│              └────────────────────────────────────────────┘
└──────────────┴───────────────────────────────────────────────┘
```

---

## 5. FINANCIAL ANALYTICS WIREFRAME

```
┌──────────────┬────────────────────────────────────────────────┐
│              │ Financial Analytics | Date Range | Export     │
│              │                                                 │
│              │ Budget Summary Cards:                          │
│              │ ┌──────────────┐ ┌──────────────┐ ┌──────────┐
│              │ │Total Budget  │ │Spent         │ │Remaining │
│              │ │$1,000,000    │ │$950,000      │ │$50,000   │
│              │ │              │ │              │ │          │
│              │ └──────────────┘ └──────────────┘ └──────────┘
│ [Sidebar]    │
│ Navigation   │ Charts Row 1:
│              │ ┌──────────────────────┐ ┌──────────────────────┐
│              │ │Budget vs Actual      │ │Category Breakdown    │
│              │ │(Line Chart)          │ │(Pie Chart)           │
│              │ │                      │ │                      │
│              │ │ $M │                 │ │  Labor (40%)         │
│              │ │    │ ╱╲  ╱╲          │ │  Materials (35%)     │
│              │ │    ├╱  ╲╱  ╲ ╱╲      │ │  Equipment (15%)     │
│              │ │    │        ╱  ╲─    │ │  Other (10%)         │
│              │ │    └───────────────  │ │                      │
│              │ └──────────────────────┘ └──────────────────────┘
│              │
│              │ Variance Analysis Table:
│              │ ┌────────────────────────────────────────────────┐
│              │ │Category    │Allocated│Spent │Var % │Status    │
│              │ ├────────────────────────────────────────────────┤
│              │ │Labor       │$350K    │$355K │+1.4% │ ✓ OK    │
│              │ │Materials   │$350K    │$330K │-5.7% │ ✓ OK    │
│              │ │Equipment   │$200K    │$215K │+7.5% │ ⚠ Watch │
│              │ │Other       │$100K    │ $50K │-50% │ ✓ Good  │
│              │ └────────────────────────────────────────────────┘
│              │
│              │ Cash Flow Projection:
│              │ ┌────────────────────────────────────────────────┐
│              │ │ Projected vs Actual Spending                  │
│              │ │ (Line Chart - 12 months)                      │
│              │ └────────────────────────────────────────────────┘
└──────────────┴────────────────────────────────────────────────────┘
```

---

## 6. DOCUMENTS MANAGEMENT WIREFRAME

```
┌──────────────────────────────────────────────────────────┐
│ LOGO | Documents | [Upload] [New Folder]                 │
├──────────────────────────────────────────────────────────┤
│
│ ├─ SPR (Surat Perintah Rancang)
│ │  ├─ Phase 1                    ┌─────────────────────┐
│ │  │  └─ Foundation.pdf          │ Document List       │
│ │  │  └─ Electrical.pdf          ├─────────────────────┤
│ │  └─ Phase 2                    │ Name │Type │Ver │   │
│ │     └─ Structure.pdf           ├─────────────────────┤
│ │                                 │Fndtn │SPR  │v2  │⋮ │
│ ├─ Technical Drawings             │Elec  │SPR  │v1  │⋮ │
│ │  ├─ Architecture                │Struc │SPR  │v3  │⋮ │
│ │  ├─ Structural                  └─────────────────────┘
│ │  └─ MEP
│ │
│ ├─ Reports                       Document Preview:
│ │  ├─ Monthly Report              ┌─────────────────────┐
│ │  └─ Safety Report               │                     │
│ │                                 │  [PDF Preview]      │
│ └─ Other Documents                │                     │
│                                   └─────────────────────┘
│
│                                   Actions:
│                                   [Download] [Versions]
│                                   [Request Approval]
│                                   [Delete]
```

---

## 7. LIVE DATA MONITORING WIREFRAME

```
┌──────────────────────────────────────────────────────────┐
│ LOGO | Live Monitoring | Last Update: 2 min ago (LIVE)   │
├──────────────────────────────────────────────────────────┤
│
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ │Temperature│ │ Workers  │ │Safety    │ │Equipment │
│ │   28°C   │ │  247     │ │Incidents │ │Status    │
│ │   ▶      │ │   ▶      │ │   2      │ │ ✓ OK    │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘
│
│ Alerts Panel              │  Real-time Charts
│ ┌────────────────────────┐│┌─────────────────────┐
│ │ CRITICAL ALERTS (3)    ││Temperature Trend    │
│ │ ✗ Over 30°C temp       ││ [Line Chart - 24h]  │
│ │ ✗ Worker count low     ││                     │
│ │ ⚠ Equipment maintenance││                     │
│ │                        ││┌─────────────────────┐
│ │ INFO ALERTS (5)        ││Workers Count        │
│ │ ℹ Material delivery    ││ [Line Chart - 24h]  │
│ │ ℹ Shift change 2pm     ││                     │
│ └────────────────────────┘└─────────────────────┘
│
│ Site Map View:
│ ┌──────────────────────────────────────────────┐
│ │         [Site Layout]                        │
│ │                                              │
│ │  Foundation  🔴 Sensor 1 (28°C)              │
│ │             🟢 Sensor 2 (26°C)               │
│ │  Structure   🟡 Sensor 3 (29°C)              │
│ │                                              │
│ │  Finishing   🟢 Sensor 4 (25°C)              │
│ └──────────────────────────────────────────────┘
```

---

## 8. USER MANAGEMENT WIREFRAME

```
┌────────────────────────────────────────────────────────────┐
│ LOGO | User Management | [Add New User]                   │
├────────────────────────────────────────────────────────────┤
│
│ User List:
│ ┌──────────────────────────────────────────────────────────┐
│ │ Name      │ Email              │ Role      │ Dept    │ ✏️  │
│ ├──────────────────────────────────────────────────────────┤
│ │ John Doe  │ john@natagroup.com │ Director  │ Exec    │ ✏️  │
│ │ Sarah Lee │ sarah@natagroup.co │ Manager   │ Project │ ✏️  │
│ │ Mike Chen │ mike@natagroup.com │ Supervisor│ Site    │ ✏️  │
│ │ Lisa Wong │ lisa@natagroup.com │ Finance   │ Finance │ ✏️  │
│ │ James Park│ james@natagroup.co │ Viewer    │ Exec    │ ✏️  │
│ │ ...       │ ...                │ ...       │ ...     │ ✏️  │
│ └──────────────────────────────────────────────────────────┘
│
│ Pagination: [< Previous] 1 2 3 4 5 [Next >]  Show: [10 ▼]
│
│ Add User Modal (opened when clicking [Add New User]):
│ ┌────────────────────────────────────┐
│ │ Add New User                  [×]   │
│ ├────────────────────────────────────┤
│ │ Full Name:  [____________]         │
│ │ Email:      [____________]         │
│ │ Role:       [Select ▼]             │
│ │             - Admin                │
│ │             - Manager              │
│ │             - Supervisor           │
│ │             - Finance              │
│ │             - Viewer               │
│ │ Department: [____________]         │
│ │                                    │
│ │ [Cancel]  [Create User]            │
│ └────────────────────────────────────┘
```

---

## 9. REPORTS WIREFRAME

```
┌──────────────────────────────────────────────────────────┐
│ LOGO | Reports | [Generate Report] [Scheduled Reports]   │
├──────────────────────────────────────────────────────────┤
│
│ Report Types:
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ │ Executive    │ │ Progress     │ │ Financial    │
│ │ Summary      │ │ Report       │ │ Report       │
│ │              │ │              │ │              │
│ │ [Generate]   │ │ [Generate]   │ │ [Generate]   │
│ │ [Schedule]   │ │ [Schedule]   │ │ [Schedule]   │
│ └──────────────┘ └──────────────┘ └──────────────┘
│
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ │ Safety       │ │ Cost         │ │ Custom       │
│ │ Report       │ │ Variance     │ │ Report       │
│ │              │ │ Report       │ │              │
│ │ [Generate]   │ │ [Generate]   │ │ [Generate]   │
│ │ [Schedule]   │ │ [Schedule]   │ │ [Schedule]   │
│ └──────────────┘ └──────────────┘ └──────────────┘
│
│ Recent Reports:
│ ┌────────────────────────────────────────────────────────┐
│ │ Name │ Type │ Generated │ Status │ Format │ Actions    │
│ ├────────────────────────────────────────────────────────┤
│ │Exec S│Execut│May 1, 10am│ Ready │ PDF    │⬇️ 📧 ⋮     │
│ │Prog R│Progr │May 1, 9am │ Ready │ PDF    │⬇️ 📧 ⋮     │
│ │Fin R │Finan │May 1, 8am │ Ready │ Excel  │⬇️ 📧 ⋮     │
│ └────────────────────────────────────────────────────────┘
│
│ Export Options: [PDF] [Excel] [PowerPoint] [Email]
```

---

## 10. COLOR PALETTE VISUALIZATION

### Primary Colors:
```
Deep Navy     ████████████ #1F2937 (Headers, primary text)
Accent Orange ████████████ #F97316 (Buttons, highlights)
Success Green ████████████ #22C55E (Completed, success)
Warning Red   ████████████ #EF4444 (Alerts, errors)
Neutral Gray  ████████████ #6B7280 (Secondary text)
```

### Usage Examples:
```
Status Indicators:
🟢 Green (#22C55E)   = Completed / On-track / Success
🟡 Yellow (#FBBF24)  = In-progress / Pending / Warning
🔴 Red (#EF4444)     = Delayed / Critical / Error
🔵 Blue (#3B82F6)    = Info / Active / Selected
```

---

## 11. COMPONENT SPECIFICATIONS

### Button Variants:
```
Primary (CTA):
┌─────────────────┐
│ Action Button   │  Orange background, white text
│  (40px height)  │  Rounded corners, hover effect
└─────────────────┘

Secondary:
┌─────────────────┐
│ Secondary       │  Gray outline, dark text
│ (40px height)   │  Hover: light background
└─────────────────┘

Danger:
┌─────────────────┐
│ Delete / Remove │  Red background, white text
│ (40px height)   │  With warning confirmation
└─────────────────┘
```

### Card Component:
```
┌─────────────────────────────────┐
│ Card Title                       │
├─────────────────────────────────┤
│                                 │
│ Card content goes here          │
│ - Multiple elements possible    │
│ - Responsive sizing             │
│                                 │
└─────────────────────────────────┘
White background, rounded corners, subtle shadow
Hover: Slight elevation increase
```

### Data Table:
```
┌─────────────────────────────────────────────┐
│ Column 1 │ Column 2 │ Column 3 │ Column 4   │  Header
├─────────────────────────────────────────────┤
│ Data 1   │ Data 2   │ Data 3   │ Data 4     │  Row 1
│ Data 1   │ Data 2   │ Data 3   │ Data 4     │  Row 2
│ Data 1   │ Data 2   │ Data 3   │ Data 4     │  Row 3
│ Data 1   │ Data 2   │ Data 3   │ Data 4     │  Row 4 (hover)
└─────────────────────────────────────────────┘
48px row height, alternating row colors optional
Sortable columns, pagination at bottom
```

---

## 12. RESPONSIVE BEHAVIOR

### Desktop (1024px+):
```
[Sidebar 280px] [Main Content Area]
Full navigation visible
2-3 column layouts for cards
Full-size tables
Desktop-optimized charts
```

### Tablet (640-1024px):
```
[Collapsed Sidebar] [Main Content Area]
Hamburger menu for navigation
2 column layouts (cards stack)
Simplified table view
Mobile-optimized charts
```

### Mobile (<640px):
```
[Hamburger Menu]
[Main Content - Full Width]
Single column stacked cards
List view instead of tables
Bottom navigation bar
Mobile-first design
Optimized touch targets (44px minimum)
```

---

## 13. INTERACTIVE ELEMENTS

### Hover Effects:
```
Buttons:     Color shift + slight scale (1.05x)
Cards:       Shadow increase, slight lift
Links:       Color change + underline
Table rows:  Background highlight
Dropdowns:   Open with animation
```

### Loading States:
```
Skeleton screens (placeholder content)
Spinner indicators (centered)
Progress bars (with percentage)
Smooth transitions (no jarring changes)
```

### Success/Error States:
```
Success Toast:      Green bg, checkmark, auto-dismiss
Error Toast:        Red bg, X icon, error message
Validation Error:   Red text below field
Success Checkmark:  Green indicator beside field
```

---

## 14. NAVIGATION FLOW DIAGRAM

```
                    ┌─────────────────┐
                    │   Login Page    │
                    └────────┬────────┘
                             │ (Login)
                             ▼
                    ┌─────────────────┐
                    │   Dashboard     │◄─────┐
                    │   (Overview)    │      │
                    └────────┬────────┘      │
                             │               │
        ┌────────────────────┼────────────────────────────────┐
        │                    │                                │
        ▼                    ▼                    ▼            ▼
┌──────────────┐      ┌──────────────┐  ┌──────────────┐ ┌─────────┐
│ Projects     │      │ Progress     │  │ Financial    │ │Documents│
└──────────────┘      └──────────────┘  └──────────────┘ └─────────┘
        │
        ▼
┌──────────────┐
│Block Details │
└──────────────┘

All sections accessible from sidebar navigation
Quick access buttons available on dashboard
Mobile: Bottom navigation instead of sidebar
```

---

## 15. MODAL & DIALOG EXAMPLES

### Confirmation Modal:
```
┌─────────────────────────────────────┐
│ Confirm Action                [×]   │
├─────────────────────────────────────┤
│                                     │
│ Are you sure you want to delete     │
│ this document?                      │
│                                     │
│ This action cannot be undone.       │
│                                     │
│ [Cancel]               [Delete] (R) │
└─────────────────────────────────────┘
```

### Data Input Modal:
```
┌─────────────────────────────────────┐
│ Add New Milestone              [×]   │
├─────────────────────────────────────┤
│                                     │
│ Milestone Name:  [____________]    │
│ Description:     [____________]    │
│ Planned Date:    [____________]    │
│ Responsible:     [Select ▼]       │
│ Priority:        ○ Critical        │
│                  ○ High            │
│                  ◉ Medium          │
│                  ○ Low             │
│                                     │
│ [Cancel]              [Create] (OK) │
└─────────────────────────────────────┘
```

---

## 16. NOTIFICATION & ALERT EXAMPLES

### Toast Notification (Top-Right):
```
┌─────────────────────────┐
│ ✓ Milestone Updated     │ (Green bg, auto-dismiss)
│ Project saved           │
└─────────────────────────┘
```

### Alert Panel:
```
┌────────────────────────────────────┐
│ Active Alerts        [Dismiss All] │
├────────────────────────────────────┤
│ ✗ Critical: Temp exceeds 30°C      │
│   Site 5:42 PM                  ✕  │
│                                    │
│ ⚠ Warning: Budget variance +8%     │
│   Finance 5:30 PM                ✕  │
│                                    │
│ ℹ Info: New document uploaded      │
│   Documents 5:15 PM               ✕  │
└────────────────────────────────────┘
```

---

## SUMMARY: KEY VISUAL PRINCIPLES

✓ **Clean & Uncluttered** - Whitespace is used effectively  
✓ **Data-Centric** - Charts and metrics take priority  
✓ **Color-Coded** - Status is immediately visible  
✓ **Accessible** - Large text, good contrast, intuitive icons  
✓ **Responsive** - Works seamlessly across all devices  
✓ **Professional** - Enterprise appearance and polish  
✓ **Interactive** - Smooth transitions and feedback  
✓ **Consistent** - Design system applied throughout  

---

**Document Version**: 1.0  
**Last Updated**: 2026  
**Status**: Visual Reference Complete  
**Next**: Figma File Creation
