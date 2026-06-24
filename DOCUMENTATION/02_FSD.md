# FUNCTIONAL SPECIFICATION DOCUMENT (FSD)
## Nata Group - Metro Paragon Residence Monitoring System

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
- password_hash (VARCHAR)
- full_name (VARCHAR)
- role (ENUM: admin, manager, supervisor, viewer, finance)
- department (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### projects
```sql
- id (UUID, PK)
- name (VARCHAR)
- description (TEXT)
- location (VARCHAR)
- start_date (DATE)
- planned_end_date (DATE)
- actual_end_date (DATE)
- total_budget (DECIMAL)
- status (ENUM: planning, active, completed, on-hold)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### blocks
```sql
- id (UUID, PK)
- project_id (UUID, FK)
- block_name (VARCHAR)
- unit_count (INTEGER)
- description (TEXT)
- status (ENUM: planning, foundation, structure, finishing, completed)
- completion_percentage (INTEGER: 0-100)
- planned_start (DATE)
- planned_end (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### phases
```sql
- id (UUID, PK)
- project_id (UUID, FK)
- phase_name (VARCHAR)
- phase_number (INTEGER)
- description (TEXT)
- status (ENUM: pending, in-progress, completed, delayed)
- planned_start (DATE)
- planned_end (DATE)
- actual_start (DATE)
- actual_end (DATE)
- created_at (TIMESTAMP)
```

#### milestones
```sql
- id (UUID, PK)
- phase_id (UUID, FK)
- milestone_name (VARCHAR)
- description (TEXT)
- status (ENUM: pending, in-progress, completed, delayed)
- planned_date (DATE)
- actual_date (DATE)
- priority (ENUM: critical, high, medium, low)
- assigned_to (UUID, FK users)
- created_at (TIMESTAMP)
```

#### budget_lines
```sql
- id (UUID, PK)
- project_id (UUID, FK)
- category (VARCHAR: materials, labor, equipment, others)
- description (VARCHAR)
- allocated_amount (DECIMAL)
- spent_amount (DECIMAL)
- status (ENUM: pending, in-progress, completed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### documents
```sql
- id (UUID, PK)
- project_id (UUID, FK)
- file_name (VARCHAR)
- file_path (VARCHAR)
- file_type (VARCHAR: spr, drawing, report, other)
- document_version (INTEGER)
- uploaded_by (UUID, FK users)
- uploaded_at (TIMESTAMP)
- is_approved (BOOLEAN)
- approved_by (UUID, FK users)
- approved_at (TIMESTAMP)
- metadata (JSONB)
```

#### metrics_data
```sql
- id (UUID, PK)
- project_id (UUID, FK)
- metric_type (VARCHAR: temperature, safety_incidents, equipment_status, workers_count, etc)
- metric_value (VARCHAR/NUMERIC)
- recorded_by (VARCHAR)
- recorded_at (TIMESTAMP)
- source (VARCHAR: sensor, manual_input, api)
- metadata (JSONB)
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
- Overall project completion (%)
- Budget status (spent vs allocated)
- Timeline status (on-track/delayed)
- Active phases count
- Total units/blocks
- Current active workers
- Pending approvals count
- Recent alerts/notifications

**Components**:
- KPI Cards (4x2 grid)
- Progress bar chart
- Timeline visualization
- Recent activity feed
- Alerts & notifications widget

**Real-time Updates**: Via WebSocket, max 30-second refresh

---

### 3.3 PROJECT MONITORING

**Feature**: Real-time Progress Tracking

**Sections**:

#### A. Progress Overview
- Project-wide progress meter (%)
- Block-by-block breakdown
- Phase status summary
- Visual timeline

#### B. Block Management
- List view dengan filtering & sorting
- Card view dengan progress indicators
- Drill-down untuk detail per block
- Photo gallery per block
- Worker assignment view

#### C. Phase & Milestone Tracking
- Gantt chart untuk phases
- Milestone checklist
- Status indicators (color-coded)
- Completion percentage per phase
- Historical timeline view

**Filters Available**:
- By status
- By priority
- By responsible person
- By date range
- By block/phase

---

### 3.4 FINANCIAL ANALYTICS

**Feature**: Budget Monitoring & Financial Reporting

**Sections**:

#### A. Budget Dashboard
- Budget vs Actual chart (bar/line chart)
- Category breakdown pie chart
- Variance analysis (red/yellow/green indicators)
- Remaining budget projection
- Cost per unit calculation

#### B. Spending Report
- Detailed transaction list
- Monthly/quarterly aggregation
- Department-wise breakdown
- Supplier/vendor analysis
- Cash flow projection

#### C. Variance Analysis
- Budget deviation alerts (>5% threshold)
- Root cause analysis
- Forecast vs Actual
- Trend analysis

**Export Options**: PDF, Excel, CSV

---

### 3.5 DOCUMENT MANAGEMENT (SPR)

**Feature**: Centralized Document Storage & Versioning

**Sections**:

#### A. Document Upload
- Drag-drop upload interface
- Multi-file support
- Document categorization (SPR, drawing, report, other)
- Automatic metadata extraction
- File preview (PDF, images, documents)

#### B. Document Library
- Tree view organization by type/phase
- Search functionality (full-text search)
- Filter by:
  - Document type
  - Upload date
  - Status (approved/pending)
  - Responsible person

#### C. Version Control
- Version history tracking
- Compare versions (diff view)
- Rollback capability
- Change log per document

#### D. Approval Workflow
- Request approval functionality
- Approval status tracking
- Comment & annotation
- Sign-off capability
- Audit trail

**Access Control**: 
- Public documents (shared view)
- Private documents (role-based)
- Document expiration alerts

---

### 3.6 LIVE DATA & MONITORING

**Feature**: Real-time Data from Field

**Data Sources**:
- IoT sensors (temperature, humidity, etc.)
- Manual field input forms
- Third-party API integrations
- Photo uploads from field

**Metrics Tracked**:
- Environmental data (temperature, weather)
- Safety incidents count
- Equipment status & utilization
- Worker count on-site
- Material delivery status

**Alert System**:
- Threshold-based alerts
- Anomaly detection
- Email notifications untuk critical alerts
- Alert dashboard dengan filtering
- Alert history & resolution tracking

**Real-time Visualization**:
- Live metric dashboard
- Time-series charts
- Gauges & indicators
- Map view untuk lokasi-specific data

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
