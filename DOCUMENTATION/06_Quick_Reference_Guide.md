# QUICK REFERENCE GUIDE
## Nata Group - Metro Paragon Residence Monitoring System

---

## PROJECT AT A GLANCE

**Project Name**: Metro Paragon Residence Project Monitoring & Management System  
**Client**: Nata Group  
**Timeline**: 12 weeks (3 months)  
**Team**: Development team + Design team + Project manager  
**Status**: Ready for Implementation  

---

## KEY STAKEHOLDERS

| Role | Responsibilities |
|------|------------------|
| **Project Director/Admin** | Overall system strategy, user management, approval decisions |
| **Development Lead** | Technical architecture, code review, deployment |
| **Design Lead** | UI/UX design, component design, design system maintenance |
| **Backend Developer** | API development, database design, integrations |
| **Frontend Developer** | UI implementation, component development, frontend testing |
| **QA Lead** | Test planning, test execution, bug tracking |
| **DevOps Engineer** | Infrastructure, CI/CD, deployment, monitoring |

---

## CORE FEATURES (7 Pillars)

1. **Dashboard & Monitoring** - Real-time KPI overview
2. **Progress Tracking** - Block, phase, milestone management
3. **Financial Analytics** - Budget monitoring & reporting
4. **Document Management** - SPR & technical document storage
5. **Live Data** - Real-time metrics from field
6. **User Management** - RBAC & team coordination
7. **Reporting** - Executive reports & exports

---

## TECHNOLOGY STACK (Quick)

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes, TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Real-time** | Socket.io (WebSockets) |
| **Storage** | Vercel Blob (documents) |
| **Hosting** | Vercel (serverless) |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Sentry, PostHog |

---

## PROJECT STRUCTURE (Key Folders)

```
src/
├── app/                 # Pages & API routes
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utilities & helpers
├── services/           # Business logic
├── store/              # State management (Zustand)
├── types/              # TypeScript types
└── middleware.ts       # Next.js middleware

prisma/
├── schema.prisma       # Database schema
├── migrations/         # Database migrations
└── seed.ts            # Initial data

docs/
├── BRD_Nata_Group.md
├── FSD_Nata_Group.md
├── Brainstorming_Design_Direction.md
├── Figma_Design_Specifications.md
└── Technical_Implementation_Roadmap.md
```

---

## API ENDPOINTS OVERVIEW

### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh-token
```

### Projects & Blocks
```
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id

GET    /api/blocks
POST   /api/blocks
PUT    /api/blocks/:id
```

### Progress & Milestones
```
GET    /api/phases
POST   /api/phases
GET    /api/milestones
POST   /api/milestones
PUT    /api/milestones/:id
```

### Financial
```
GET    /api/budget/summary
GET    /api/budget/details
GET    /api/spending/history
```

### Documents
```
GET    /api/documents
POST   /api/documents/upload
GET    /api/documents/:id/versions
PUT    /api/documents/:id/approve
```

### Metrics & Alerts
```
GET    /api/metrics/latest
POST   /api/metrics
GET    /api/metrics/alerts
```

### Users
```
GET    /api/users
POST   /api/users
PUT    /api/users/:id
GET    /api/users/:id/activity-logs
```

---

## DATABASE TABLES (12 Core Tables)

| Table | Purpose |
|-------|---------|
| `users` | User accounts & auth |
| `projects` | Main project info |
| `blocks` | Blocks/units within project |
| `phases` | Project phases |
| `milestones` | Phase milestones |
| `budget_lines` | Budget items & tracking |
| `documents` | SPR & technical docs |
| `metrics_data` | Real-time sensor data |
| `photo_documentation` | Progress photos |
| `notifications` | User notifications |
| `audit_logs` | Activity tracking |
| (WebSocket) | Real-time connection data |

---

## KEY SCREENS (12 Main Pages)

### Admin/Management View
1. **Dashboard** - KPI overview & alerts
2. **Projects** - List & detail views
3. **Progress Tracking** - Gantt timeline, blocks, milestones
4. **Financial** - Budget vs actual, variance analysis
5. **Documents** - SPR library & versioning
6. **Live Data** - Real-time metrics & alerts
7. **Users** - Team management & RBAC
8. **Reports** - Executive reports & export

### Additional Views
9. **Settings** - Account, preferences, system config
10. **Activity Logs** - Audit trail
11. **Notifications** - Alert management
12. **Mobile Views** - Responsive versions

---

## COLOR PALETTE (4 Main Colors)

```
Navy Blue    #1F2937   - Primary color, headers, backgrounds
Orange       #F97316   - Accent, CTAs, highlights
Green        #22C55E   - Success, completed status
Red/Yellow   #EF4444/#FBBF24 - Alerts, warnings
```

---

## DESIGN PRINCIPLES (Remember These!)

1. **Clear & Fast** - Data should be immediately understandable
2. **Professional** - Enterprise-grade appearance
3. **Data-Focused** - Charts & metrics are primary
4. **Real-time** - Live updates visible
5. **Accessible** - WCAG 2.1 AA compliant
6. **Responsive** - Mobile-ready layouts

---

## COMPONENT LIBRARY (shadcn/ui + Custom)

### Ready-to-Use Components:
- Buttons, Cards, Forms, Inputs
- Tables, Modals, Dropdowns
- Charts (Recharts), Progress bars
- Badges, Spinners, Toasts
- Navigation (Sidebar, Top nav)
- Data tables with sorting/filtering

---

## DEVELOPMENT WORKFLOW

### Getting Started:
```bash
# 1. Clone repo
git clone <repo-url>
cd nata-group-monitoring

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local

# 4. Setup database
pnpm prisma migrate dev

# 5. Seed data (optional)
pnpm prisma db seed

# 6. Run dev server
pnpm dev

# 7. Open browser
http://localhost:3000
```

### Common Commands:
```bash
pnpm dev              # Run dev server
pnpm build            # Build for production
pnpm start            # Run production build
pnpm test             # Run tests
pnpm lint             # Lint code
pnpm type-check       # Check TypeScript
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
```

---

## TESTING REQUIREMENTS

### Test Coverage Targets:
- Unit tests: > 80%
- Integration tests: Key flows
- E2E tests: Critical user journeys
- Performance: < 2s page load

### Test Tools:
- **Unit**: Jest + React Testing Library
- **E2E**: Playwright or Cypress
- **API**: Jest with mock servers
- **Performance**: Lighthouse, Web Vitals

---

## GIT WORKFLOW

### Branch Naming:
```
main                          # Production
staging                       # Pre-production
feature/feature-name          # New features
bugfix/bug-description        # Bug fixes
refactor/component-name       # Refactoring
docs/documentation-topic      # Documentation
```

### Commit Messages:
```
[FEATURE] Add dashboard KPI cards
[BUGFIX] Fix budget chart calculation
[REFACTOR] Reorganize component structure
[DOCS] Update API documentation
[TEST] Add unit tests for auth service
```

### Pull Request Process:
1. Create feature branch from staging
2. Make commits with descriptive messages
3. Open PR with description
4. Code review by team lead
5. Merge to staging (auto-test)
6. After approval, merge to main

---

## SECURITY CHECKLIST

- [ ] All passwords hashed with bcrypt
- [ ] JWT tokens with proper expiry
- [ ] HTTPS only
- [ ] CSRF protection enabled
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS protection (React escaping)
- [ ] Rate limiting on API
- [ ] Input validation on all forms
- [ ] Audit logging enabled
- [ ] Sensitive data encrypted

---

## PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Page Load Time | < 2 seconds |
| API Response | < 500ms average |
| WebSocket Latency | < 500ms |
| Uptime | 99.5% |
| Error Rate | < 0.5% |
| Database Query | < 100ms |

---

## DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] All tests passing
- [ ] Code review completed
- [ ] Migrations tested in staging
- [ ] Secrets configured
- [ ] Database backup ready
- [ ] Monitoring configured
- [ ] Error tracking ready
- [ ] Performance baseline established
- [ ] Rollback plan documented
- [ ] User communication planned

---

## TROUBLESHOOTING QUICK GUIDE

### "Database Connection Error"
```
Check:
- DATABASE_URL in .env
- PostgreSQL server running
- Network connectivity
- Connection pooling limits
```

### "CORS Error"
```
Solution:
- Add domain to CORS whitelist
- Check API_URL config
- Enable credentials in fetch
```

### "Upload Not Working"
```
Check:
- BLOB_READ_WRITE_TOKEN set
- File size limits
- Storage quota
- Network connectivity
```

### "Real-time Not Updating"
```
Check:
- WebSocket connection status
- Socket.io server running
- Browser console for errors
- Network tab for 101 upgrade
```

### "Slow Dashboard Load"
```
Solutions:
- Check database query performance
- Enable Redis caching
- Implement lazy loading
- Optimize chart rendering
```

---

## CONTACT & SUPPORT

### Internal
- **Development Lead**: [Name] - architecture, code decisions
- **Design Lead**: [Name] - design questions, design system
- **Project Manager**: [Name] - timeline, scope, stakeholders

### External
- **Client Contact**: Nata Group
- **Hosting Support**: Vercel Support
- **Database Support**: Database Provider Support

---

## IMPORTANT LINKS

| Resource | Link |
|----------|------|
| GitHub Repository | [link] |
| Vercel Dashboard | [link] |
| Figma Design | [link] |
| Database (Navicat) | [link] |
| Sentry Monitoring | [link] |
| API Documentation | /docs/API.md |
| Setup Guide | /docs/SETUP.md |
| Architecture Docs | /docs/ARCHITECTURE.md |

---

## PHASE TIMELINE SUMMARY

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1. Foundation | Week 1-2 | Auth system, DB setup |
| 2. Core Features | Week 3-4 | Dashboard, Projects, Progress |
| 3. Financial & Docs | Week 5-6 | Financial module, Docs system |
| 4. Real-time & Advanced | Week 7-8 | WebSocket, Mobile optimization |
| 5. Integration & Testing | Week 9-10 | All tests passing, integrations done |
| 6. Deployment & Launch | Week 11-12 | Production ready, live system |

---

## FREQUENTLY ASKED QUESTIONS

**Q: Can I run locally without internet?**
A: No, real-time features require internet. Development should have stable connection.

**Q: How do I reset the database?**
A: `pnpm prisma migrate reset` - ⚠️ WARNING: Deletes all data

**Q: Where are uploaded documents stored?**
A: Vercel Blob storage (cloud) - files are not stored locally

**Q: How do I add a new user role?**
A: Update enum in Prisma schema, create migration, update RBAC logic

**Q: Can I customize the color scheme?**
A: Yes, update tailwind.config.ts and global design tokens in globals.css

**Q: How do I debug WebSocket issues?**
A: Check browser DevTools Network tab, look for 101 WebSocket Upgrade response

---

## RESOURCES FOR TEAM MEMBERS

### For Frontend Developers:
- React Documentation: https://react.dev
- Next.js Guide: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com

### For Backend Developers:
- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction
- Prisma ORM: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs

### For DevOps:
- Vercel Deployment: https://vercel.com/docs
- GitHub Actions: https://docs.github.com/en/actions
- Docker (optional): https://docs.docker.com

### For QA/Testers:
- Jest Testing: https://jestjs.io
- Playwright: https://playwright.dev
- Manual Testing Guide: /docs/TEST_CASES.md

---

**Last Updated**: 2026  
**Version**: 1.0  
**Next Review**: After Phase 2 completion
