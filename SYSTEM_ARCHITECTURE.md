# NATA GROUP MONITORING SYSTEM - SYSTEM ARCHITECTURE DOCUMENTATION

## PROJECT OVERVIEW

**Project Name:** Nata Group Metro Paragon Residence Monitoring System
**Client:** Nata Group
**Type:** Real Estate Development Management & Public Landing Page
**Platform:** Web Application (Responsive)

### Business Objectives
1. Provide real-time construction progress monitoring
2. Showcase company profile and projects to public
3. Enable admin to manage landing page content and media
4. Track budget, timeline, and project analytics
5. Manage documents (SPR, contracts, permits)
6. Team management and coordination

---

## TECHNOLOGY STACK

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19.2
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Component Library:** Shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Form Handling:** React Hook Form (implicit)
- **HTTP Client:** Native Fetch API

### Backend
- **Framework:** Next.js API Routes
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Session Management:** HTTP-only cookies
- **ORM:** Prisma (configured, can be activated)

### Database
- **Type:** PostgreSQL (recommended)
- **Connection:** Via Neon or similar managed PostgreSQL service
- **Current Setup:** Mock data (ready to connect to real DB)

### Deployment
- **Host:** Vercel (optimized for Next.js)
- **Storage:** Vercel Blob (optional, for file uploads)
- **Analytics:** Sentry (optional)

---

## SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                      PUBLIC LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Landing Page (/landing)                                     │
│  ├─ Hero Section                                             │
│  ├─ Company Profile                                          │
│  ├─ Media Gallery (Managed by Admin)                         │
│  ├─ Statistics                                               │
│  └─ Newsletter Signup                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Login (/login) → JWT Token → localStorage                   │
│  Register (/register) → Create User → JWT Token              │
│  Logout → Clear Token                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ADMIN DASHBOARD LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Dashboard (/dashboard)                                      │
│  ├─ Projects (/projects)                                    │
│  ├─ Analytics (/analytics)                                  │
│  ├─ Documents (/documents)                                  │
│  ├─ Reports (/reports)                                      │
│  ├─ Team (/team)                                            │
│  └─ Admin Features                                           │
│      ├─ Landing Manager (/admin/landing-manager)             │
│      ├─ Media Manager (/admin/media-manager)                 │
│      └─ Settings (/admin/settings)                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (Routes)                        │
├─────────────────────────────────────────────────────────────┤
│  Authentication                                              │
│  ├─ POST /api/auth/login                                     │
│  ├─ POST /api/auth/register                                  │
│  └─ GET /api/auth/verify                                     │
│                                                              │
│  Projects                                                    │
│  ├─ GET /api/projects (list all)                             │
│  ├─ POST /api/projects (create)                              │
│  ├─ GET /api/projects/[id] (detail)                          │
│  └─ PATCH /api/projects/[id] (update)                        │
│                                                              │
│  Analytics                                                   │
│  ├─ GET /api/projects/[id]/analytics                         │
│  └─ POST /api/projects/[id]/analytics (submit)               │
│                                                              │
│  Landing Content                                             │
│  ├─ GET /api/landing/content (public)                        │
│  └─ PUT /api/landing/content (admin)                         │
│                                                              │
│  Media Management                                            │
│  ├─ GET /api/landing/media (public)                          │
│  ├─ POST /api/landing/media (admin create)                   │
│  ├─ PUT /api/landing/media/[id] (admin update)               │
│  └─ DELETE /api/landing/media/[id] (admin delete)            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   UTILITY LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  Authentication Utilities                                    │
│  ├─ authenticateUser()                                       │
│  ├─ generateToken()                                          │
│  ├─ verifyToken()                                            │
│  ├─ hashPassword()                                           │
│  ├─ comparePassword()                                        │
│  └─ logAudit()                                               │
│                                                              │
│  Middleware                                                  │
│  └─ JWT verification on protected routes                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
├─────────────────────────────────────────────────────────────┤
│  Mock Data (In-Memory):                                      │
│  ├─ Users (admin, managers, viewers)                         │
│  ├─ Projects (Metro Paragon Residence)                       │
│  ├─ Phases (4 construction phases)                           │
│  ├─ Blocks (4 building blocks)                               │
│  ├─ Units (120+ apartment units)                             │
│  ├─ Analytics (90-day history)                               │
│  ├─ Documents (SPR, blueprints, etc)                         │
│  └─ Media (4 featured images)                                │
│                                                              │
│  Ready to Connect:                                           │
│  └─ PostgreSQL via Prisma ORM                                │
└─────────────────────────────────────────────────────────────┘
```

---

## FOLDER STRUCTURE

```
nata-group-monitoring/
├── app/
│   ├── (root)
│   │   ├── page.tsx (home - redirects to landing)
│   │   └── layout.tsx (root layout with metadata)
│   ├── landing/
│   │   └── page.tsx (public landing page)
│   ├── login/
│   │   └── page.tsx (authentication page)
│   ├── dashboard/
│   │   └── page.tsx (main dashboard)
│   ├── projects/
│   │   └── page.tsx (project management)
│   ├── analytics/
│   │   └── page.tsx (analytics & reporting)
│   ├── documents/
│   │   └── page.tsx (document management)
│   ├── reports/
│   │   └── page.tsx (report generation)
│   ├── team/
│   │   └── page.tsx (team management)
│   ├── admin/
│   │   ├── landing-manager/
│   │   │   └── page.tsx (admin panel for landing)
│   │   ├── media-manager/
│   │   │   └── page.tsx (admin media management)
│   │   └── settings/
│   │       └── page.tsx (admin settings)
│   └── api/
│       ├── auth/
│       │   ├── login/
│       │   │   └── route.ts (POST login)
│       │   └── register/
│       │       └── route.ts (POST register)
│       ├── projects/
│       │   ├── route.ts (GET list, POST create)
│       │   └── [id]/
│       │       ├── route.ts (GET detail, PATCH update)
│       │       └── analytics/
│       │           └── route.ts (GET analytics, POST submit)
│       └── landing/
│           ├── content/
│           │   └── route.ts (GET/PUT content)
│           └── media/
│               └── route.ts (GET/POST/PUT/DELETE media)
│
├── components/
│   ├── Navbar.tsx (top navigation bar)
│   ├── Sidebar.tsx (left sidebar navigation)
│   └── ui/ (shadcn/ui components)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ... (other shadcn components)
│
├── lib/
│   ├── auth.ts (authentication utilities)
│   ├── middleware.ts (request middleware)
│   └── utils.ts (utility functions)
│
├── prisma/
│   └── schema.prisma (database schema definition)
│
├── public/
│   ├── hero-metro-paragon.jpg
│   ├── construction-progress.jpg
│   ├── interior-design.jpg
│   └── amenities-pool.jpg
│
├── scripts/
│   ├── init-db.sql (database initialization)
│   └── seed.js (data seeding)
│
├── styles/
│   └── globals.css (tailwind configuration)
│
├── .env.example (environment variables template)
├── .env.local (local environment variables)
├── next.config.mjs (Next.js configuration)
├── package.json (dependencies)
├── tsconfig.json (TypeScript configuration)
└── DOCUMENTATION/ (all markdown docs)
    ├── 00_EXECUTIVE_SUMMARY.md
    ├── 01_BRD_Nata_Group.md
    ├── 02_FSD_Nata_Group.md
    ├── 03_Brainstorming_Design_Direction.md
    ├── 04_Figma_Design_Specifications.md
    ├── 05_Technical_Implementation_Roadmap.md
    ├── 06_Quick_Reference_Guide.md
    ├── 07_Visual_Mockup_Guide.md
    └── INDEX.md
```

---

## DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CONTRACTOR', 'VIEWER'),
  department VARCHAR(255),
  phoneNumber VARCHAR(20),
  isActive BOOLEAN DEFAULT true,
  lastLogin TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'),
  progress DECIMAL(5,2) DEFAULT 0,
  budgetAmount DECIMAL(15,2),
  spentAmount DECIMAL(15,2) DEFAULT 0,
  startDate TIMESTAMP,
  endDate TIMESTAMP,
  projectManager VARCHAR(255),
  contractor VARCHAR(255),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Phases Table
```sql
CREATE TABLE phases (
  id UUID PRIMARY KEY,
  projectId UUID NOT NULL REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED'),
  progress DECIMAL(5,2) DEFAULT 0,
  startDate TIMESTAMP,
  endDate TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Analytics Table
```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY,
  projectId UUID NOT NULL REFERENCES projects(id),
  date DATE NOT NULL,
  workersOnSite INT DEFAULT 0,
  safetyIncidents INT DEFAULT 0,
  qualityScore DECIMAL(5,2) DEFAULT 0,
  progressPercentage DECIMAL(5,2) DEFAULT 0,
  budgetUtilization DECIMAL(5,2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(projectId, date)
);
```

### Documents Table
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  projectId UUID NOT NULL REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  docType ENUM('SPR', 'BLUEPRINT', 'CONTRACT', 'PERMIT', 'REPORT', 'INSPECTION'),
  filePath VARCHAR(500),
  uploadedBy UUID NOT NULL REFERENCES users(id),
  uploadedAt TIMESTAMP DEFAULT NOW(),
  version INT DEFAULT 1,
  createdAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(projectId) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Media Table (Landing Page)
```sql
CREATE TABLE media (
  id UUID PRIMARY KEY,
  type ENUM('IMAGE', 'VIDEO') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500) NOT NULL,
  thumbnail VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  position INT,
  uploadedAt TIMESTAMP DEFAULT NOW(),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

---

## API ENDPOINTS SPECIFICATION

### Authentication

**Login**
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "admin@natagroup.com",
  "password": "NataGroup@2024"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "1",
    "email": "admin@natagroup.com",
    "name": "Admin User",
    "role": "SUPER_ADMIN"
  }
}
```

**Register**
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "name": "New User",
  "password": "Password123",
  "role": "VIEWER",
  "department": "Sales",
  "phoneNumber": "+62812345678"
}

Response (201):
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### Projects

**Get All Projects**
```
GET /api/projects
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Metro Paragon Residence",
      "location": "Jakarta",
      "progress": 65,
      "budgetAmount": 500000000,
      "spentAmount": 325000000,
      "phases": [...]
    }
  ]
}
```

**Get Project Detail**
```
GET /api/projects/[id]
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Metro Paragon Residence",
    "phases": [...],
    "documents": [...],
    "milestones": [...]
  }
}
```

**Create Project**
```
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "name": "Project Name",
  "location": "Location",
  "budgetAmount": 500000000,
  "startDate": "2024-01-01",
  "endDate": "2025-12-31"
}

Response (201):
{
  "success": true,
  "data": { ... }
}
```

### Analytics

**Get Analytics**
```
GET /api/projects/[id]/analytics?days=30
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "analytics": [
      {
        "date": "2024-01-01",
        "workersOnSite": 85,
        "safetyIncidents": 0,
        "qualityScore": 92
      }
    ],
    "aggregates": {
      "totalDays": 30,
      "avgWorkers": 82,
      "totalIncidents": 2,
      "avgQuality": 89.5
    }
  }
}
```

### Landing Content

**Get Landing Content (Public)**
```
GET /api/landing/content

Response (200):
{
  "success": true,
  "data": {
    "hero": {
      "title": "Metro Paragon Residence",
      "subtitle": "Premium Living",
      "description": "..."
    },
    "stats": {
      "projects": 1,
      "units": 500,
      "experience": 10,
      "satisfaction": 98
    },
    "about": {
      "mission": "...",
      "vision": "..."
    }
  }
}
```

**Update Landing Content (Admin)**
```
PUT /api/landing/content
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "hero": { ... },
  "stats": { ... },
  "about": { ... }
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### Media Management

**Get All Media (Public)**
```
GET /api/landing/media

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "1",
      "type": "image",
      "title": "Metro Paragon Main Tower",
      "url": "/hero-metro-paragon.jpg",
      "featured": true
    }
  ]
}
```

**Create Media (Admin)**
```
POST /api/landing/media
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "type": "image",
  "title": "New Image",
  "description": "Description",
  "url": "https://...",
  "thumbnail": "https://...",
  "featured": false
}

Response (201):
{
  "success": true,
  "data": { ... }
}
```

**Update Media (Admin)**
```
PUT /api/landing/media/[id]
Authorization: Bearer <token>
Content-Type: application/json

Request: { ... same as create ... }

Response (200):
{
  "success": true,
  "data": { ... }
}
```

**Delete Media (Admin)**
```
DELETE /api/landing/media/[id]
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Media deleted"
}
```

---

## USER ROLES & PERMISSIONS

### SUPER_ADMIN
- Full access to all features
- Can manage users
- Can access all analytics
- Can manage landing page
- Can manage media
- Can access settings

### ADMIN
- Access to all dashboards
- Can create/edit projects
- Can manage documents
- Can manage landing page
- Can manage media
- Cannot access user management

### MANAGER
- View projects & analytics
- Can edit project details
- Can submit daily analytics
- Cannot manage landing
- Cannot manage settings

### CONTRACTOR
- View project progress
- Can submit updates
- Can upload documents
- Cannot edit project settings

### VIEWER
- Read-only access
- Can view dashboards
- Can view analytics
- Cannot edit anything

---

## AUTHENTICATION FLOW

```
1. User visits http://localhost:3000
   ↓
2. Checks localStorage for token
   ├─ Token exists → Redirect to /dashboard
   └─ No token → Redirect to /landing (public)
   
3. User clicks Login
   ↓
4. Enters credentials (admin@natagroup.com / NataGroup@2024)
   ↓
5. POST /api/auth/login
   ├─ Verify email & password
   ├─ Generate JWT token
   └─ Return user data
   
6. Frontend stores token in localStorage
   ├─ Authorization: Bearer <token>
   └─ Subsequent requests use token
   
7. Access protected routes
   ├─ Middleware verifies token
   └─ Route returns data or 401
   
8. User logs out
   └─ Clear localStorage & redirect to /landing
```

---

## STATE MANAGEMENT

Currently using:
- **React Hooks (useState, useEffect)** for component state
- **localStorage** for token & user data
- **SWR or Fetch** for server state

Ready to upgrade to:
- Redux Toolkit
- Zustand
- TanStack Query (React Query)

---

## SECURITY CONSIDERATIONS

1. **Authentication:**
   - JWT tokens for stateless auth
   - Tokens stored in localStorage
   - HTTP-only cookies (ready for implementation)
   - Bcrypt for password hashing

2. **Authorization:**
   - Role-based access control (RBAC)
   - Middleware verification on all routes
   - API endpoints check user permissions

3. **Data Protection:**
   - HTTPS/TLS for all communications
   - Environment variables for secrets
   - SQL injection prevention (Prisma ORM)
   - CORS configuration

4. **API Security:**
   - Rate limiting (ready to implement)
   - Input validation
   - CSRF protection (built-in Next.js)

---

## DEPLOYMENT CHECKLIST

- [ ] Environment variables configured
- [ ] Database connected (PostgreSQL)
- [ ] Prisma migrations run
- [ ] Static files optimized
- [ ] Error handling implemented
- [ ] Logging setup
- [ ] Monitoring (Sentry) configured
- [ ] SSL/TLS certificates
- [ ] Backups configured
- [ ] CDN for static assets
- [ ] Performance optimized
- [ ] Security headers set

---

## FUTURE ENHANCEMENTS

1. **Real-time Features:**
   - WebSocket for live updates
   - Real-time notifications
   - Live project tracking

2. **Advanced Analytics:**
   - Predictive analytics
   - Budget forecasting
   - Risk assessment

3. **Mobile App:**
   - React Native / Flutter
   - Offline capability
   - Push notifications

4. **Payment Integration:**
   - Stripe/PayPal integration
   - Unit payment tracking
   - Invoice generation

5. **Advanced Media:**
   - 360° virtual tours
   - 3D building models
   - Drone footage

6. **Communication:**
   - In-app messaging
   - Email notifications
   - SMS alerts

7. **Marketplace:**
   - Unit buying/selling
   - Secondary market
   - Auction system

---

## MONITORING & LOGGING

Current:
- Console logging for development
- Next.js built-in logging

Ready to implement:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior
- Custom logging service

