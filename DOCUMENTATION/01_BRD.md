# BUSINESS REQUIREMENTS DOCUMENT (BRD)
## VibeDesk - Ticketing & IT Support Management System

---

## 1. EXECUTIVE SUMMARY

**Project Name:** VibeDesk IT Support & Ticketing System  
**Client:** Internal / Public Demo  
**Project Type:** Real-time Ticketing, Support & Project Management Web Platform  
**Objective:** Membangun platform web terpadu untuk manajemen tiket IT, dukungan operasional (support), monitoring SLA, manajemen pengetahuan (knowledge base), dan pelaporan (reporting) secara real-time. Terdapat lingkungan "Demo" tersendiri untuk menampilkan fitur-fitur kepada calon klien tanpa menyentuh data asli.

---

## 2. BUSINESS OBJECTIVES

### Primary Goals:
1. **Efficient Ticket Management**: Memudahkan penerimaan, tracking, dan resolusi tiket kendala IT.
2. **SLA Monitoring**: Memastikan setiap tiket diselesaikan sesuai batas waktu (SLA) yang disepakati.
3. **Demo & Production Environment Separation**: Menyediakan portal Demo (Mock Data) yang aman tanpa mengganggu Production DB.
4. **Knowledge Base Management**: Centralized repository untuk solusi dari kendala yang sering terjadi.
5. **Stakeholder Analytics**: Dashboard pelaporan real-time terkait performa tim support dan volume tiket.

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
  - Jumlah Tiket (Open, In Progress, Resolved, Pending)
  - SLA Compliance Rate
  - Kinerja Tim (Response time & Resolution time)
  - Ticket distribution by category/priority
- Role Switcher khusus lingkungan Demo (Simulasi Role)

#### B. TICKETING PIPELINE & TRIAGE
- Visualisasi pipeline tiket (Kanban / List view)
- Prioritization (Critical, High, Medium, Low)
- Auto-assignment / Manual assignment tiket
- Update status dan progress resolution
- Komentar dan komunikasi internal/eksternal pada tiket

#### C. FINANCIAL ANALYTICS
- Budget vs Actual spending dashboard
- Cost breakdown by category (materials, labor, equipment, etc.)
- Monthly/quarterly financial reports
- Variance analysis (budget deviation alerts)
- Cash flow projection

#### D. DEMO & PRODUCTION ISOLATION
- Routing khusus Demo (e.g. `/demo-login`, `/admin/dashboard-demo`, `/functional`)
- Mock Database Bypasses pada API untuk user Demo (ID `demo-1`)
- Kemampuan mengubah role simulasi (`dev-switch-role`)
- Reset state data demo tanpa menghapus database utama

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

### 1. Super Admin / Admin
- **Goals**: Mengelola keseluruhan sistem dan user, melihat metrik tingkat tinggi
- **Needs**: Complete dashboard, user management, system settings, global queue
- **Access**: Full access to all features

### 2. Functional Team (Helpdesk)
- **Goals**: Triage dan analisis kendala dari user
- **Needs**: Ticket queue, assignment tools, initial response tracking
- **Access**: Panel Triage, tiket pending & active

### 3. Developer / IT Support
- **Goals**: Menyelesaikan masalah teknis yang dilaporkan
- **Needs**: Code access, ticket details, update progress/status
- **Access**: Assigned tickets, update progress, internal notes

### 4. Quality Assurance (QA)
- **Goals**: Memverifikasi penyelesaian tiket
- **Needs**: Review resolved tickets, test cases, reopen tickets if failed
- **Access**: Review dashboard, QA approval workflow

### 5. Viewer / End User
- **Goals**: Mengajukan tiket baru dan memantau status
- **Needs**: Ticket submission form, personal ticket tracking
- **Access**: Limited dashboard, own tickets only

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
- **Tickets**: Induk data masalah/kendala
- **Users**: Admin, Functional Team, Developer, QA, Viewer
- **Comments**: Diskusi dalam tiket (Public/Internal)
- **Ticket History**: Audit trail perubahan tiket
- **Attachments**: File terkait tiket
- **System Settings**: Konfigurasi web seperti nomor telepon, teks landing page
- **Knowledge Base**: Artikel panduan dan solusi (Future)

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
