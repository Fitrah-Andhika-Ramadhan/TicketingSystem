# Nata Group Metro Paragon Residence - Monitoring System Setup Guide

A comprehensive real-time monitoring and analytics platform for construction project management.

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ and pnpm installed
- PostgreSQL database (local or remote)
- Git

### 1. Clone & Install Dependencies
```bash
pnpm install
```

### 2. Configure Database
Edit `.env.local` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/nata_group_monitoring"
```

### 3. Setup Database Schema
```bash
# Create database tables
pnpm run db:push

# Seed with sample data (optional)
pnpm run db:seed
```

### 4. Start Development Server
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

Login with these credentials to test the system:

- **Email**: `admin@natagroup.com`
- **Password**: `NataGroup@2024`
- **Role**: Super Admin

Other test accounts:
- **Manager**: `manager@natagroup.com`
- **Contractor**: `contractor@natagroup.com`
- **Viewer**: `viewer@natagroup.com`

All use password: `NataGroup@2024`

---

## Complete Setup Guide

### 1. PostgreSQL Database Setup

#### Option A: Local PostgreSQL (Windows/Mac/Linux)

**Windows with pgAdmin:**
```bash
# Using pgAdmin GUI
1. Create new database: nata_group_monitoring
2. Create user with password
3. Grant all privileges to user
4. Update DATABASE_URL in .env.local
```

**Using psql (Command Line):**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE nata_group_monitoring;

# Create user
CREATE USER nata_group WITH PASSWORD 'YourSecurePassword';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nata_group_monitoring TO nata_group;

# Update .env.local
DATABASE_URL="postgresql://nata_group:YourSecurePassword@localhost:5432/nata_group_monitoring"
```

**MacOS (with Homebrew):**
```bash
# Install PostgreSQL
brew install postgresql

# Start service
brew services start postgresql

# Create database (same as above)
createdb nata_group_monitoring
createuser nata_group
```

#### Option B: Docker (Recommended)

```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: nata_group
      POSTGRES_PASSWORD: nata_group_123
      POSTGRES_DB: nata_group_monitoring
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# Start services
docker-compose up -d

# Update .env.local
DATABASE_URL="postgresql://nata_group:nata_group_123@localhost:5432/nata_group_monitoring"
```

#### Option C: Cloud Database (Neon, Supabase, AWS RDS)

**Neon (Recommended - Free)**
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create project
3. Copy connection string
4. Update `DATABASE_URL` in `.env.local`

### 2. Install Dependencies

```bash
# Install all packages
pnpm install

# Or with npm
npm install

# Or with yarn
yarn install
```

### 3. Database Migrations

```bash
# Push schema to database (creates tables)
pnpm run db:push

# Or run full migration flow
pnpm run db:migrate
```

### 4. Seed Sample Data

```bash
# Populate database with demo projects and users
pnpm run db:seed

# Output:
# ✓ Created 4 users
# ✓ Created 1 project
# ✓ Created 4 phases
# ✓ Created 4 blocks
# ✓ Created 120 units
# ✓ Created 3 milestones
# ✓ Created 90 analytics records
# ✓ Created 3 documents
# ✓ Created 3 activities
# ✅ Database seeding completed successfully!
```

### 5. Configure Environment Variables

Copy and customize `.env.local`:

```env
# ===== DATABASE =====
DATABASE_URL="postgresql://user:password@localhost:5432/nata_group_monitoring"

# ===== AUTHENTICATION =====
NEXTAUTH_SECRET="generate-32-char-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="another-32-char-random-string"
JWT_EXPIRATION="7d"

# ===== APPLICATION =====
NODE_ENV="development"
NEXT_PUBLIC_APP_NAME="Nata Group Monitoring"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ===== FILE UPLOAD =====
MAX_FILE_SIZE_MB=50
ALLOWED_FILE_TYPES="pdf,xlsx,xls,doc,docx,jpg,jpeg,png,gif"

# ===== LOGGING =====
LOG_LEVEL="debug"
```

Generate secure random strings:
```bash
# macOS/Linux
openssl rand -base64 32

# Or online: https://www.random.org/strings/
```

### 6. Start Development Server

```bash
pnpm run dev
```

**Output:**
```
> next dev

  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Visit [http://localhost:3000](http://localhost:3000) → Redirects to login page

---

## Project Structure

```
nata-group-monitoring/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── projects/          # Project management endpoints
│   ├── dashboard/             # Main dashboard page
│   ├── projects/              # Projects listing
│   ├── documents/             # Document management
│   ├── analytics/             # Analytics dashboard
│   ├── login/                 # Login page
│   └── layout.tsx             # Root layout
│
├── components/
│   ├── Navbar.tsx             # Navigation bar
│   ├── Sidebar.tsx            # Sidebar menu
│   ├── ui/                    # shadcn/ui components
│   └── ...
│
├── lib/
│   ├── auth.ts               # Authentication utilities
│   ├── middleware.ts         # API middleware
│   └── ...
│
├── prisma/
│   └── schema.prisma         # Database schema
│
├── scripts/
│   ├── init-db.sql          # SQL initialization
│   └── seed.js              # Database seeding
│
├── public/                   # Static assets
├── .env.example              # Environment template
├── .env.local                # Local environment (git ignored)
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## Features

### 1. Real-time Monitoring Dashboard
- **Overall Project Progress**: Aggregate progress across all phases
- **Phase-by-Phase Tracking**: Individual progress for each construction phase
- **Budget Monitoring**: Real-time budget vs. actual spending
- **Timeline Tracking**: Project timeline and milestone status

### 2. Advanced Analytics
- **Workers On Site**: Daily worker count trends
- **Budget Analysis**: Daily cost vs. revenue tracking
- **Quality Metrics**: Quality score trends and defect tracking
- **Safety Incidents**: Track and report safety incidents

### 3. Project Management
- **Multiple Projects**: Manage several concurrent projects
- **Project Phases**: Break down projects into construction phases
- **Building Blocks**: Track progress by building block/unit
- **Units Management**: Individual apartment/unit tracking

### 4. Document Management
- **SPR Documents**: Surat Pernyataan Rencana (Statement of Intent Letters)
- **Blueprints**: Architecture and engineering blueprints
- **Contracts**: Construction and vendor contracts
- **Permits**: Building permits and approvals
- **Reports**: Monthly, quarterly, annual reports
- **Version Control**: Track document versions

### 5. User Management & Security
- **Role-Based Access**: 5 user roles with different permissions
  - Super Admin: Full system access
  - Admin: Administrative functions
  - Manager: Project management
  - Contractor: Field updates
  - Viewer: Read-only access
- **Audit Logging**: Track all user actions
- **Password Security**: Bcrypt hashing

### 6. Reporting & Analytics
- **Daily Progress Reports**: Automated daily summaries
- **Weekly Summaries**: Weekly construction progress
- **Financial Reports**: Budget and cost analysis
- **Safety Reports**: Incident tracking
- **Executive Dashboards**: High-level overview for management

---

## Database Schema Overview

### Core Tables
- **Users**: User accounts and authentication
- **Projects**: Main project information
- **Phases**: Construction phases
- **Blocks**: Building blocks/towers
- **Units**: Individual apartments/houses
- **Milestones**: Project milestones and deadlines

### Analytics & Monitoring
- **Analytics**: Daily metrics (workers, costs, quality, progress)
- **Activity**: User activity and project changes
- **AuditLog**: Compliance and audit trail

### Documents & Reports
- **Documents**: File management and storage
- **Reports**: Generated reports by type
- **Notifications**: User notifications

---

## API Endpoints

### Authentication
```
POST /api/auth/login              # User login
POST /api/auth/register           # User registration
POST /api/auth/logout             # User logout
```

### Projects
```
GET  /api/projects                # List all projects
POST /api/projects                # Create new project
GET  /api/projects/[id]           # Get project details
PATCH /api/projects/[id]          # Update project
```

### Analytics
```
GET  /api/projects/[id]/analytics # Get project analytics
POST /api/projects/[id]/analytics # Add analytics data
```

### Documents
```
GET  /api/projects/[id]/documents # List documents
POST /api/projects/[id]/documents # Upload document
GET  /api/projects/[id]/documents/[docId] # Download document
```

---

## Build & Deployment

### Build for Production
```bash
# Build Next.js application
pnpm run build

# Start production server
pnpm start
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Go to Settings > Environment Variables
```

### Deploy to Other Platforms

**AWS Amplify**
```bash
amplify init
amplify hosting add
amplify publish
```

**Heroku**
```bash
heroku create your-app-name
heroku config:set DATABASE_URL="..."
git push heroku main
```

**Docker Deployment**
```bash
# Build Docker image
docker build -t nata-group-monitoring .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  nata-group-monitoring
```

---

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# Reset Prisma cache
rm -rf node_modules/.prisma
pnpm install

# Regenerate Prisma client
pnpm run db:push
```

### Port 3000 Already in Use
```bash
# Linux/Mac: Find process
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 pnpm run dev
```

### Prisma Migrations Issues
```bash
# View migration status
npx prisma migrate status

# Reset database (caution: loses all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name add_new_feature
```

### Authentication Errors
- Verify `JWT_SECRET` and `NEXTAUTH_SECRET` are set
- Check token expiration: `JWT_EXPIRATION="7d"`
- Ensure password hashing works: Test with seed script

---

## Development Commands

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start

# Lint code
pnpm run lint

# Database commands
pnpm run db:push      # Push schema to database
pnpm run db:migrate   # Run migrations
pnpm run db:seed      # Seed database

# View Prisma Studio (GUI for database)
npx prisma studio
```

---

## Technology Stack

- **Frontend**: React 19, Next.js 16, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Bcrypt
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP**: Axios
- **Real-time**: Socket.io (ready for implementation)

---

## Performance Optimization

```typescript
// Enable React Compiler in next.config.mjs
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};
```

---

## Security Best Practices

✓ Use environment variables for sensitive data
✓ Enable HTTPS in production
✓ Implement rate limiting for APIs
✓ Use CORS protection
✓ Validate all user inputs
✓ Implement audit logging
✓ Regular security updates
✓ Database backups

---

## Support & Documentation

- **Project Documentation**: See `/DOCUMENTATION` folder
- **API Docs**: Check API route comments
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## License

Proprietary - Nata Group 2024

---

## Changelog

### v1.0.0 (2024-04-08)
- Initial release
- Core monitoring dashboard
- Project management
- Document management
- Analytics and reporting
- User authentication and RBAC

---

**Ready to run! Questions? Check `/DOCUMENTATION` folder for detailed guides.**
