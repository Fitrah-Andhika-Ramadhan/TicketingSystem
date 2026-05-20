# NATA GROUP - INTEGRATED LANDING PAGE + ADMIN DASHBOARD

## System Architecture

### 1. PUBLIC LANDING PAGE (No Login Required)
**URL:** `/landing`
- **Content Source:** `/api/landing/content` (publicly accessible)
- **Dynamic Content:** Hero, Statistics, About section
- **Features:**
  - Real-time content from API
  - Newsletter subscription
  - Company profile link
  - Login button for admin
  - Responsive design
  - Contact information

### 2. ADMIN MANAGEMENT PANEL
**URL:** `/admin/landing-manager`
- **Access:** SUPER_ADMIN & ADMIN only (requires login)
- **Location:** Sidebar menu item: "Manage Landing"
- **Capabilities:**
  - Edit hero section (title, subtitle, description)
  - Update statistics (projects, units, years, satisfaction)
  - Modify about section (mission, vision, description)
  - Real-time preview on landing page
  - Save/Cancel functionality

### 3. LANDING CONTENT API
**Endpoint:** `/api/landing/content`
- **GET:** Public access (for landing page)
- **PUT:** Admin only (for management)
- **Response:** JSON with hero, features, stats, about data

### 4. FULL INTERNAL DASHBOARD
**URL:** `/dashboard`
- **Access:** All authenticated users
- **Features:** 7 menu items + admin settings

## User Flow

```
VISITOR ARRIVES AT HOMEPAGE (/)
    ↓
AUTO-REDIRECT TO LANDING (/landing)
    ↓
LANDING PAGE (PUBLIC - NO LOGIN)
├─ View: Company info, statistics, features
├─ Option 1: Go to Company Profile (/company-profile)
├─ Option 2: Click Login Button
    ↓
LOGIN PAGE (/login)
    ↓
AUTHENTICATION SUCCESS
    ↓
DASHBOARD (/dashboard)
├─ Dashboard (KPI Monitoring)
├─ Projects (Project Management)
├─ Analytics (90-day Analysis)
├─ Documents (SPR Management)
├─ Reports (Report Generation)
├─ Team (Team Management)
├─ Admin Menu (if SUPER_ADMIN/ADMIN)
    ├─ Manage Landing (/admin/landing-manager)
    └─ Settings (/admin/settings)
```

## Files Created/Modified

### New Files:
1. `/app/api/landing/content/route.ts` - Landing content API
2. `/app/admin/landing-manager/page.tsx` - Landing manager UI (372 lines)

### Modified Files:
1. `/app/landing/page.tsx` - Dynamic landing page using API
2. `/components/Sidebar.tsx` - Added "Manage Landing" menu item
3. `/app/page.tsx` - Redirect logic (already existed)

## Key Features

### Landing Page Features:
✓ Dynamic content from API
✓ Hero section with CTA
✓ 6 Feature cards
✓ Statistics display (dynamic)
✓ About section with mission/vision
✓ Newsletter subscription
✓ Professional footer
✓ Navigation to other pages
✓ Fully responsive design

### Admin Management:
✓ Hero section editor (title, subtitle, description)
✓ Statistics editor (4 key metrics)
✓ About section editor (mission, vision, description)
✓ Real-time updates reflected on landing page
✓ Section-based editing with toggle
✓ Save/Cancel functionality
✓ Permission-based access (admin only)

## Testing the Integration

### Step 1: View Public Landing Page
```
1. Go to http://localhost:3000
2. Auto-redirects to /landing
3. See dynamic content from API
4. All content is editable by admin
```

### Step 2: Login as Admin
```
1. Click "Login" on landing page
2. Email: admin@natagroup.com
3. Password: NataGroup@2024
4. Redirects to dashboard
```

### Step 3: Manage Landing Content
```
1. From dashboard, check sidebar
2. Click "Manage Landing" (under Admin section)
3. Edit any section (Hero, Stats, About)
4. Click Edit button to enable editing
5. Click Save Changes
6. Go back to /landing to see updates
```

### Step 4: View All Dashboard Features
```
1. Access all 7 main menu items
2. View admin settings
3. Go back to landing page
4. Content reflects any changes made by admin
```

## API Structure

### GET /api/landing/content
**Response:**
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "...",
      "subtitle": "...",
      "description": "...",
      "ctaText": "..."
    },
    "stats": {
      "projects": 25,
      "units": 500,
      "yearsExperience": 10,
      "satisfaction": 98
    },
    "about": {
      "title": "...",
      "description": "...",
      "mission": "...",
      "vision": "..."
    },
    "features": [...]
  }
}
```

### PUT /api/landing/content
**Headers:** `Authorization: Bearer <token>`
**Body:** Any section to update
**Response:** Updated content object

## Default Content

The system comes with pre-configured content:

**Hero:**
- Title: "Nata Group - Metro Paragon Residence"
- Subtitle: "Premium Residential Development in the Heart of Jakarta"

**Statistics:**
- 25+ Projects
- 500+ Units
- 10+ Years Experience
- 98% Customer Satisfaction

**About:**
- Mission: "To create exceptional living spaces that enhance quality of life"
- Vision: "To be the most trusted real estate developer in Southeast Asia"

## Permission Model

### Public Users:
- View landing page
- View company profile
- Access login page

### Authenticated Users:
- Access all dashboard features
- Access all 7 menu items
- View projects and analytics

### Admins (SUPER_ADMIN/ADMIN):
- Everything above, plus:
- Manage landing page content
- Access admin settings
- Edit hero, statistics, about sections

## Benefits

1. **Dynamic Content:** No redeployment needed for content updates
2. **Admin Control:** Admins can manage landing page without coding
3. **Public-Private Split:** Public can view landing, only admins manage it
4. **Real-time Updates:** Changes reflect immediately on landing page
5. **Scalable:** Easy to add more content sections
6. **Secure:** API endpoints are protected
7. **User-Friendly:** Simple toggle-based UI for admins

## Summary

The system now has:
✓ Public-facing landing page (no login required)
✓ Admin management panel (for authorized users only)
✓ Dynamic content delivery via API
✓ Full internal dashboard with all features
✓ Complete role-based access control
✓ Responsive design across all pages
✓ Newsletter subscription
✓ Company profile page
✓ Professional footer and navigation

Everything is fully integrated and ready for production use!
