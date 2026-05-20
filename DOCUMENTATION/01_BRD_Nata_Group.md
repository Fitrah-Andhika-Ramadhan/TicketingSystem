# BUSINESS REQUIREMENTS DOCUMENT (BRD)
## Nata Group - Metro Paragon Residence Project Monitoring System

---

## 1. EXECUTIVE SUMMARY

**Project Name:** Metro Paragon Residence Project Monitoring & Management System  
**Client:** Nata Group  
**Project Type:** Real-time Construction & Project Management Web Platform  
**Objective:** Membangun platform web yang mengintegrasikan monitoring real-time progress pembangunan, analytics biaya, timeline milestone, manajemen dokumen SPR, dan live data dari lapangan.

---

## 2. BUSINESS OBJECTIVES

### Primary Goals:
1. **Real-time Project Visibility**: Memberikan akses real-time kepada management untuk monitoring progress pembangunan
2. **Data-Driven Decision Making**: Menggunakan analytics untuk mengoptimalkan keputusan bisnis
3. **Document Management**: Centralized storage dan tracking dokumen SPR (Surat Perintah Rancang/Technical Drawings)
4. **Budget Control**: Monitoring pengeluaran vs budget allocation secara real-time
5. **Stakeholder Communication**: Dashboard yang dapat dibagikan dengan stakeholders

### Secondary Goals:
- Meningkatkan efisiensi operasional
- Mengurangi risiko overrun budget dan timeline
- Standardisasi proses reporting
- Audit trail lengkap untuk compliance

---

## 3. SCOPE & FEATURES

### Phase 1 - Core Features:

#### A. DASHBOARD & MONITORING
- Dashboard overview dengan KPI utama:
  - Progress pembangunan (% completion)
  - Timeline status (on-track, delayed, ahead)
  - Budget status (vs allocation)
  - Jumlah unit/blok dalam progress
  - Active workers/resources count

#### B. PROGRESS TRACKING
- Visual progress meter per blok/fase
- Milestone timeline dengan status (completed, in-progress, pending)
- Photo documentation dari lapangan
- Phase-based progress tracking
- Historical trend analysis

#### C. FINANCIAL ANALYTICS
- Budget vs Actual spending dashboard
- Cost breakdown by category (materials, labor, equipment, etc.)
- Monthly/quarterly financial reports
- Variance analysis (budget deviation alerts)
- Cash flow projection

#### D. DOKUMEN MANAGEMENT (SPR)
- Upload/categorize technical documents
- Version control untuk dokumen
- Access control per role
- Search & filter functionality
- Document approval workflow

#### E. LIVE DATA INTEGRATION
- Data sources: Sensors, IoT devices, field reports
- Real-time metric updates (temperature, safety incidents, equipment status)
- Alert system untuk anomalies
- Historical data logging

#### F. USER MANAGEMENT
- Role-based access control (Admin, Manager, Supervisor, Viewer)
- User authentication & authorization
- Activity logging & audit trail
- Team management

### Phase 2 - Advanced Features (Future):
- Mobile app untuk field team
- Integration dengan drone/aerial photography
- AI-powered risk prediction
- Automated report generation
- Integration dengan accounting software

---

## 4. USER PERSONAS & REQUIREMENTS

### 1. Project Director/Admin
- **Goals**: Full visibility, strategic decision making
- **Needs**: Complete dashboard, analytics, reports, user management
- **Access**: All features, full data access

### 2. Project Manager
- **Goals**: Day-to-day monitoring, timeline management
- **Needs**: Progress tracking, milestone management, team coordination
- **Access**: Dashboard, progress, some analytics, team management

### 3. Site Supervisor
- **Goals**: Field coordination, daily progress update
- **Needs**: Photo upload, daily reports, worker tracking
- **Access**: Progress input, photo upload, basic dashboard view

### 4. Finance Manager
- **Goals**: Budget monitoring, financial reporting
- **Needs**: Financial analytics, spending reports, variance analysis
- **Access**: Financial section, budget data, reports

### 5. External Stakeholders (Investors/Partners)
- **Goals**: Project overview for decision making
- **Needs**: High-level dashboard, key metrics, reports
- **Access**: Limited dashboard view, no sensitive data

---

## 5. TECHNICAL REQUIREMENTS

### Technology Stack:
- **Frontend**: Next.js 16 (React 19) - Modern UI framework
- **Backend**: Next.js API Routes + Server Components
- **Database**: PostgreSQL (managed via Navicat)
- **Real-time**: WebSockets untuk live data updates
- **Authentication**: JWT + HTTP-only cookies
- **Storage**: Cloud storage untuk dokumen (Vercel Blob/S3)
- **Deployment**: Vercel

### Non-Functional Requirements:
- **Performance**: Page load < 2 seconds, real-time update latency < 500ms
- **Availability**: 99.5% uptime
- **Scalability**: Support untuk 500+ concurrent users
- **Security**: End-to-end encryption untuk dokumen sensitif, audit logging
- **Compliance**: GDPR-compliant data handling

---

## 6. DATA MODEL OVERVIEW

### Core Entities:
- **Projects**: Metro Paragon Residence
- **Blocks/Units**: Individual blocks/units dalam project
- **Phases**: Pembagian fase konstruksi
- **Milestones**: Key achievement targets
- **Budget Lines**: Budget allocation per kategori
- **Documents**: SPR dan dokumen teknis
- **Users**: Team members dengan roles
- **Metrics/Data Points**: Real-time measurement data
- **Audit Logs**: Activity tracking

---

## 7. SUCCESS CRITERIA & KPIs

### Metrics:
1. **System Availability**: 99.5% uptime
2. **Data Accuracy**: 100% match dengan field reality
3. **Update Frequency**: Real-time updates (max 5 min delay)
4. **User Adoption**: 95% of management team actively using
5. **Budget Tracking Accuracy**: < 2% variance
6. **Document Management**: 100% dokumen terverifikasi

### Business Metrics:
- Reduced project delays: Target 50% reduction
- Cost overrun prevention: Target 0% overrun
- Decision-making speed: 40% faster project decisions

---

## 8. ASSUMPTIONS & CONSTRAINTS

### Assumptions:
- Data dari lapangan tersedia (sensors/manual input)
- Internet connectivity reliable di lokasi proyek
- Team familiar dengan sistem berbasis web
- Budget untuk development dan infrastructure tersedia

### Constraints:
- Timeline: 4 bulan development & deployment
- Budget: Sesuai dengan alokasi management
- Resources: Tim internal untuk data collection
- Regulatory: Sesuai dengan regulasi konstruksi Indonesia

---

## 9. RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Data accuracy issues | High | Implement validation, field verification |
| Integration delays | Medium | Start integration early, parallel development |
| User adoption | Medium | Training, support team, phased rollout |
| System downtime | High | Redundancy, monitoring, SLA agreement |
| Data security breach | Critical | Encryption, access control, security audit |

---

## 10. PROJECT TIMELINE

- **Phase 1 Development**: 2 months
- **Testing & UAT**: 3-4 weeks
- **Training & Deployment**: 2 weeks
- **Go-Live**: Month 3
- **Stabilization & Optimization**: Month 4

---

## 11. BUDGET ESTIMATE

| Category | Estimate |
|----------|----------|
| Development | 40% |
| Infrastructure & Hosting | 15% |
| Data Integration | 20% |
| Testing & QA | 15% |
| Training & Documentation | 10% |

---

## APPROVAL SIGN-OFF

- **Document Owner**: Project Manager
- **Last Updated**: 2026
- **Version**: 1.0
- **Status**: Ready for FSD Phase
