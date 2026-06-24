# FUNCTIONAL SPECIFICATION DOCUMENT (FSD)
## VibeDesk - Ticketing & IT Support Management System

---

## 1. SYSTEM ARCHITECTURE

### High-Level Architecture:
```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  (Next.js Frontend + React Components + TailwindCSS)        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    (REST API + WebSocket)
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                   Application Layer                          │
│  (Next.js API Routes + Server Components + Business Logic)  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                   Data Layer                                 │
│  (PostgreSQL Database + ORM + Caching)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. DATABASE SCHEMA

### Core Tables:

#### users
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)
- name (VARCHAR)
- role (ENUM: SUPER_ADMIN, ADMIN, FUNCTIONAL_TEAM, DEVELOPER, QA, VIEWER)
- department (VARCHAR)
- phone_number (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### tickets
```sql
- id (UUID, PK)
- ticket_number (VARCHAR, UNIQUE)
- title (VARCHAR)
- description (TEXT)
- category (ENUM: BUG, FEATURE_REQUEST, MAINTENANCE, ACCESS_ISSUE, OTHER)
- priority (ENUM: CRITICAL, HIGH, MEDIUM, LOW)
- status (ENUM: PENDING_APPROVAL, APPROVED, OPEN, IN_PROGRESS, IN_REVIEW, RESOLVED, CLOSED, REJECTED)
- progress (INTEGER: 0-100)
- solution (TEXT)
- recommendation (TEXT)
- due_date (TIMESTAMP)
- created_by (UUID, FK users)
- assigned_to (UUID, FK users)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### comments
```sql
- id (UUID, PK)
- ticket_id (UUID, FK tickets)
- user_id (UUID, FK users)
- content (TEXT)
- is_internal (BOOLEAN)
- created_at (TIMESTAMP)
```

#### ticket_history
```sql
- id (UUID, PK)
- ticket_id (UUID, FK tickets)
- action (VARCHAR)
- old_value (VARCHAR)
- new_value (VARCHAR)
- changed_by (UUID, FK users)
- changed_at (TIMESTAMP)
```

#### attachments
```sql
- id (UUID, PK)
- ticket_id (UUID, FK tickets)
- file_name (VARCHAR)
- file_url (VARCHAR)
- file_size (INTEGER)
- file_type (VARCHAR)
- uploaded_by (UUID, FK users)
- uploaded_at (TIMESTAMP)
```

#### system_settings
```sql
- id (VARCHAR, PK)
- phone (VARCHAR)
- email (VARCHAR)
- address (TEXT)
- landing_hero_title (VARCHAR)
- landing_hero_subtitle (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### audit_logs
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- action (VARCHAR)
- entity_type (VARCHAR)
- entity_id (UUID)
- changes (JSONB)
- timestamp (TIMESTAMP)
- ip_address (VARCHAR)
```

#### photo_documentation
```sql
- id (UUID, PK)
- block_id (UUID, FK)
- phase_id (UUID, FK)
- image_url (VARCHAR)
- description (TEXT)
- taken_by (UUID, FK users)
- taken_at (TIMESTAMP)
- tags (VARCHAR[])
```

#### notifications
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- title (VARCHAR)
- message (TEXT)
- type (ENUM: alert, info, warning, success)
- is_read (BOOLEAN)
- created_at (TIMESTAMP)
```

---

## 3. CORE FEATURES SPECIFICATION

### 3.1 AUTHENTICATION & AUTHORIZATION

**Feature**: User Login & Role-Based Access Control

**Functional Requirements**:
- User login with email & password
- JWT token generation (access + refresh tokens)
- Role-based access control (5 roles)
- Session management dengan HTTP-only cookies
- Logout functionality
- Password reset feature

**API Endpoints**:
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/reset-password
GET    /api/auth/me
```

**UI Components**:
- Login form dengan email/password validation
- Forgot password modal
- User profile dropdown menu
- Role indicator

---

### 3.2 DASHBOARD (Main Page)

**Feature**: Executive Dashboard dengan KPI Overview

**Key Metrics Displayed**:
- Total Tickets
- Open / Pending Tickets
- In Progress Tickets
- Resolved / Closed Tickets
- Critical Tickets Alert
- SLA Compliance

**Components**:
- KPI Cards (5 grid)
- Priority Distribution (Pie Chart)
- Ticket Category Distribution (Bar Chart)
- Tickets Over Time (Line Chart)
- Recent Tickets Table

**Real-time Updates**: Via API polling / WebSockets

---

### 3.3 TICKETING PIPELINE

**Feature**: End-to-end Ticket Management

**Sections**:

#### A. Ticket Triage (Functional Team)
- Pending Approval list
- Validation and Assignment to Developer
- Priority adjustment

#### B. Developer / IT Support Workspace
- Assigned tickets tracking
- Progress update (0-100%)
- Solution formulation
- Marking ticket as RESOLVED

#### C. QA Workspace
- Reviewing RESOLVED tickets
- Testing and Validation
- Marking ticket as CLOSED or REJECTED (back to Developer)

**Filters Available**:
- By status
- By priority
- By category
- By assignee
- By date range

---

### 3.4 COLLABORATION & COMMUNICATION

**Feature**: Komentar dan Rekam Jejak Tiket

**Sections**:

#### A. Comments Thread
- Public comments (visible to reporter)
- Internal notes (visible to IT team only)
- File attachments

#### B. Audit Trail (History)
- Tracking setiap perubahan status
- Log perubahan priority / assignee
- Timestamp dan nama user pengubah

---

### 3.5 DEMO PORTAL (ISOLATED ENVIRONMENT)

**Feature**: Lingkungan khusus untuk mendemonstrasikan sistem tanpa merusak data asli.

**Sections**:

#### A. Demo Login
- Preset credentials (`demo@fitrahpro.com`)
- Redirect otomatis ke `/admin/dashboard-demo`

#### B. Mock API Bypasses
- Ticket updates (PATCH) di-mock untuk user ID `demo-1`
- Mock fetching (GET) untuk menghindari error RecordNotFound
- Role Simulator (`dev-switch-role`) untuk simulasi role berbeda (QA, Developer, Functional) di dalam Demo portal.

#### C. System Boundaries
- Operasi create user, update global settings dicegah atau disimulasikan untuk user Demo.
- Tampilan `Dashboard Demo` menggunakan data statis yang impresif (1000+ tiket) untuk menampilkan kapabilitas UI analitik.

---

### 3.7 USER MANAGEMENT

**Feature**: Team & Role Management

**Functionalities**:
- User list dengan detailed info
- Add/edit/deactivate users
- Role assignment
- Department assignment
- Team hierarchy view
- Access control configuration

**User Actions Logged**:
- Login/logout
- Data access
- Data modification
- Document operations
- Approval actions

---

### 3.8 REPORTING & EXPORT

**Feature**: Automated Reporting System

**Report Types**:
1. **Executive Summary**: Key metrics, status, alerts
2. **Detailed Progress Report**: Phase-by-phase breakdown
3. **Financial Report**: Budget analysis, spending summary
4. **Safety Report**: Incidents, risks, mitigation
5. **Weekly Status Report**: What's done, what's pending
6. **Monthly Burndown**: Progress trends

**Export Formats**: PDF, Excel, PowerPoint

**Scheduling**: Manual export + scheduled email reports

---

### 3.9 NOTIFICATIONS & ALERTS

**Feature**: Smart Alert Management

**Alert Types**:
- Budget variance alerts (when >5% deviation)
- Milestone delay alerts
- Document approval pending
- New data from sensors
- Critical safety incidents
- Upcoming milestones

**Delivery Channels**:
- In-app notifications (bell icon)
- Email notifications
- SMS alerts (untuk critical events)

**Notification Center**:
- Notification history
- Mark as read
- Filter & search
- Notification preferences per user

---

## 4. USER INTERFACE FLOWS

### 4.1 Login Flow
```
1. User lands on /login
2. Enter email & password
3. Submit → API validation
4. JWT token generated
5. Redirect to dashboard
6. Session established
```

### 4.2 Create/Update Milestone Flow
```
1. Manager clicks "Add Milestone"
2. Form modal opens
3. Fill form (name, date, assignee, etc)
4. Save → API call
5. Real-time update in timeline
6. Notification sent to assignee
7. Audit log recorded
```

### 4.3 Upload Document Flow
```
1. User goes to Document Management
2. Click "Upload Document"
3. Drag-drop or select file
4. Fill metadata (type, category, description)
5. Upload → Cloud storage
6. Database record created
7. Approval workflow initiated
```

### 4.4 Monitor Budget Flow
```
1. Finance manager opens Financial Analytics
2. View budget vs actual chart
3. Click on category for details
4. See transaction list for category
5. Export report if needed
6. Set up budget variance alerts
```

---

## 5. API SPECIFICATION

### 5.1 Authentication APIs
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}
Response: { "accessToken", "refreshToken", "user" }

POST /api/auth/logout
Response: { "success": true }

GET /api/auth/me
Response: { "user": {...} }
```

### 5.2 Projects APIs
```
GET    /api/projects              - List all projects
GET    /api/projects/:id          - Get project details
POST   /api/projects              - Create new project
PUT    /api/projects/:id          - Update project
DELETE /api/projects/:id          - Delete project
GET    /api/projects/:id/stats    - Get project statistics
```

### 5.3 Blocks APIs
```
GET    /api/blocks?project_id=:id
POST   /api/blocks
PUT    /api/blocks/:id
DELETE /api/blocks/:id
GET    /api/blocks/:id/photos
```

### 5.4 Phases & Milestones APIs
```
GET    /api/phases?project_id=:id
POST   /api/phases
PUT    /api/phases/:id
GET    /api/milestones?phase_id=:id
POST   /api/milestones
PUT    /api/milestones/:id
```

### 5.5 Financial APIs
```
GET    /api/budget/summary?project_id=:id
GET    /api/budget/details
GET    /api/spending/history
GET    /api/budget/variance-analysis
```

### 5.6 Documents APIs
```
GET    /api/documents?project_id=:id
POST   /api/documents/upload
GET    /api/documents/:id/versions
PUT    /api/documents/:id/approve
DELETE /api/documents/:id
```

### 5.7 Metrics APIs
```
GET    /api/metrics/latest?type=:metric_type
POST   /api/metrics               - Record new metric
GET    /api/metrics/history       - Historical data
GET    /api/metrics/alerts        - Active alerts
```

### 5.8 WebSocket Events
```
ws://api.example.com/socket

Events:
- metric_update           (real-time metric data)
- milestone_completed     (milestone achievement)
- budget_variance_alert   (budget alert)
- document_approved       (doc approval notification)
- user_joined            (user online status)
```

---

## 6. SECURITY SPECIFICATIONS

### 6.1 Authentication
- JWT tokens dengan 15-minute expiry (access) & 7-day expiry (refresh)
- HTTP-only cookies untuk token storage
- HTTPS only
- Password hashing dengan bcrypt

### 6.2 Authorization
- Role-based access control (RBAC)
- Row-level security untuk documents
- API endpoint protection dengan middleware
- Rate limiting per user

### 6.3 Data Protection
- AES-256 encryption untuk sensitive documents
- Encrypted password fields
- GDPR-compliant data handling
- Regular security audits

### 6.4 Audit & Logging
- All data modifications logged
- User action tracking
- IP address logging
- Tamper detection

---

## 7. PERFORMANCE SPECIFICATIONS

### Load Requirements
- Support 500+ concurrent users
- Dashboard load time: < 2 seconds
- API response time: < 500ms (avg)
- WebSocket latency: < 500ms

### Caching Strategy
- Browser caching untuk static assets
- Server-side caching (Redis) untuk frequently accessed data
- Real-time data: No caching (always fresh)

### Database Optimization
- Indexed queries untuk common filters
- Query optimization & explain plans
- Connection pooling
- Regular vacuum & analyze

---

## 8. DEPLOYMENT SPECIFICATIONS

### Hosting
- **Frontend**: Vercel (serverless)
- **Backend**: Vercel Functions
- **Database**: PostgreSQL (managed service)
- **Storage**: Vercel Blob (documents)
- **CDN**: Vercel CDN (global distribution)

### CI/CD Pipeline
- GitHub Actions for automated testing
- Automated deployment on push to main branch
- Staging environment for testing
- Blue-green deployment strategy
- Automated rollback on failure

### Monitoring & Uptime
- Real-time monitoring dengan Sentry/New Relic
- Uptime monitoring
- Performance tracking
- Error rate monitoring
- Alert notifications

---

## 9. TESTING SPECIFICATIONS

### Unit Tests
- Business logic testing
- API endpoint testing
- Database query testing
- Coverage target: > 80%

### Integration Tests
- API integration testing
- Database integration testing
- Third-party service integration

### UAT Testing
- User acceptance testing scenarios
- End-to-end testing
- Load testing
- Security testing

---

## 10. DEPENDENCIES & INTEGRATIONS

### External Services
- Possible: Email service (SendGrid/AWS SES)
- Possible: SMS service (Twilio)
- Possible: Storage service (AWS S3 / Vercel Blob)
- Possible: Monitoring (Sentry)
- Possible: Analytics (PostHog/Mixpanel)

### Internal Integrations
- Navicat untuk database management
- Figma untuk design collaboration

---

## 11. DATA MIGRATION & SETUP

### Initial Data Load
- Existing project data migration
- Historical metrics import
- Document archive migration
- User account setup

### Database Initialization
- Schema creation
- Index creation
- Trigger setup
- Initial data seeding

---

## 12. COMPLIANCE & REGULATIONS

- Indonesian Construction Standards
- Data protection (GDPR-like)
- Financial reporting standards
- Safety compliance

---

## DOCUMENT CONTROL

- **Version**: 2.0
- **Last Updated**: 2026
- **Status**: Ready for Design & Implementation
- **Owner**: Technical Lead
