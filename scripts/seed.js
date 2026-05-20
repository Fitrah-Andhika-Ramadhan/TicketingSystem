const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

const defaultLandingContent = {
  hero: {
    title: 'VibeDesk',
    subtitle: 'Sistem Manajemen Tiket & SLA Terbaik',
    description: 'Sistem penanganan tiket dan pemantauan Service Level Agreement (SLA) terbaik untuk bisnis digital Anda.',
    ctaText: 'Mulai Sekarang',
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop'
  },
  features: [
    {
      title: 'Smart Ticketing',
      description: 'Manajemen tiket otomatis berbasis kategori dan urgensi.',
      icon: '🎫'
    },
    {
      title: 'Real-time SLA',
      description: 'Pantau waktu respon dan resolusi tiket secara langsung.',
      icon: '⏱️'
    },
    {
      title: 'Kolaborasi Tim',
      description: 'Delegasikan tugas dan diskusikan solusi dalam tim.',
      icon: '👥'
    },
    {
      title: 'Analitik Mendalam',
      description: 'Laporan visual 90 hari untuk efisiensi performa agen.',
      icon: '📈'
    },
    {
      title: 'Keamanan Data',
      description: 'Keamanan data dan kontrol akses tingkat tinggi.',
      icon: '🔒'
    },
    {
      title: 'Skalabilitas Tinggi',
      description: 'Mendukung integrasi ribuan tiket per hari tanpa hambatan.',
      icon: '🚀'
    }
  ],
  stats: {
    projects: 50,
    units: 2,
    yearsExperience: 99,
    satisfaction: 500
  },
  about: {
    title: 'Tentang VibeDesk',
    description: 'Dengan pengalaman bertahun-tahun, VibeDesk menghadirkan solusi teknologi mutakhir untuk mempermudah operasional bisnis dan penanganan dukungan pelanggan di Indonesia.',
    mission: 'Menyediakan platform manajemen operasional & dukungan pelanggan yang mulus bagi seluruh pelaku industri digital.',
    vision: 'Menjadi standar ekosistem platform helpdesk & SLA monitoring terdepan di Asia Tenggara.'
  }
};

const defaultSystemSettings = {
  projectName: 'VibeDesk',
  location: 'Jakarta, Indonesia',
  companyName: 'FitrahPro',
  email: 'support@fitrahpro.com',
  phone: '+62812345678',
  budgetAlertThreshold: 85,
  delayAlertDays: 5,
  notificationsEnabled: true,
  emailNotifications: true
};

const defaultProjectPhases = [
  { id: 'p1', name: 'Foundation & Basement', progress: 100 },
  { id: 'p2', name: 'Main Structure', progress: 85 },
  { id: 'p3', name: 'Finishing & Interior', progress: 40 },
  { id: 'p4', name: 'Testing & Handover', progress: 0 }
];

async function main() {
  console.log('🌱 Starting database seeding on Supabase...');

  // Clear tables in correct dependency order
  console.log('Clearing old data...');
  await prisma.comment.deleteMany();
  await prisma.ticketHistory.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.project.deleteMany();
  await prisma.landingContent.deleteMany();
  await prisma.systemSettings.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Old data cleared');

  // Create admin user
  console.log('Creating users...');
  const hashedPassword = await bcryptjs.hash('FitrahPro@2026', 10);
  const adminUser = await prisma.user.create({
    data: {
      id: '1',
      email: 'admin@fitrahpro.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      department: 'Management',
      phoneNumber: '+62812345678',
      isActive: true,
    }
  });
  console.log(`✓ Admin user created: ${adminUser.email}`);

  // Create LandingContent
  console.log('Creating landing content...');
  await prisma.landingContent.create({
    data: {
      id: 'default-landing',
      hero: defaultLandingContent.hero,
      features: defaultLandingContent.features,
      stats: defaultLandingContent.stats,
      about: defaultLandingContent.about
    }
  });
  console.log('✓ Default landing content seeded');

  // Create SystemSettings
  console.log('Creating system settings...');
  await prisma.systemSettings.create({
    data: {
      id: 'default-settings',
      ...defaultSystemSettings
    }
  });
  console.log('✓ Default system settings seeded');

  // Create Project
  console.log('Creating default project...');
  const project = await prisma.project.create({
    data: {
      id: '1',
      name: 'VibeDesk SLA Monitoring',
      location: 'Jakarta, Indonesia',
      description: 'Pembangunan platform VibeDesk SLA monitoring.',
      status: 'In Progress',
      progress: 65,
      budgetAmount: 500000000,
      spentAmount: 325000000,
      startDate: new Date('2023-01-15T00:00:00.000Z'),
      estimatedCompletion: new Date('2025-12-31T00:00:00.000Z'),
      phases: defaultProjectPhases
    }
  });
  console.log(`✓ Default project created: ${project.name}`);

  // Create Tickets
  console.log('Creating default tickets...');
  const ticket1 = await prisma.ticket.create({
    data: {
      id: '1',
      ticketNumber: 'TICKET-001',
      title: 'Login page not loading',
      description: 'Users unable to access login page on mobile devices. This is blocking new user registrations.',
      category: 'BUG',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      createdBy: adminUser.id,
      assignedTo: adminUser.id,
      createdAt: new Date('2026-04-08T00:00:00.000Z'),
      updatedAt: new Date('2026-04-09T00:00:00.000Z'),
      dueDate: new Date('2026-04-10T00:00:00.000Z'),
    }
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      id: '2',
      ticketNumber: 'TICKET-002',
      title: 'Add dark mode feature',
      description: 'Implement dark mode throughout the application',
      category: 'FEATURE_REQUEST',
      priority: 'MEDIUM',
      status: 'OPEN',
      createdBy: adminUser.id,
      createdAt: new Date('2026-04-09T00:00:00.000Z'),
      updatedAt: new Date('2026-04-09T00:00:00.000Z'),
    }
  });

  // Seed comments on Ticket 1
  await prisma.comment.create({
    data: {
      id: 'c1',
      ticketId: ticket1.id,
      userId: adminUser.id,
      content: 'Started investigating the issue',
      isInternal: false,
      createdAt: new Date('2026-04-09T00:00:00.000Z'),
    }
  });

  await prisma.comment.create({
    data: {
      id: 'c2',
      ticketId: ticket1.id,
      userId: adminUser.id,
      content: 'Found bug in mobile responsive CSS',
      isInternal: true,
      createdAt: new Date('2026-04-09T00:00:00.000Z'),
    }
  });

  // Seed history on Ticket 1
  await prisma.ticketHistory.create({
    data: {
      id: 'h1',
      ticketId: ticket1.id,
      action: 'created',
      newValue: 'TICKET-001 created',
      changedBy: adminUser.id,
      changedAt: new Date('2026-04-08T00:00:00.000Z'),
    }
  });

  await prisma.ticketHistory.create({
    data: {
      id: 'h2',
      ticketId: ticket1.id,
      action: 'status_changed',
      oldValue: 'OPEN',
      newValue: 'IN_PROGRESS',
      changedBy: adminUser.id,
      changedAt: new Date('2026-04-09T00:00:00.000Z'),
    }
  });

  // Seed history on Ticket 2
  await prisma.ticketHistory.create({
    data: {
      id: 'h3',
      ticketId: ticket2.id,
      action: 'created',
      newValue: 'TICKET-002 created',
      changedBy: adminUser.id,
      changedAt: new Date('2026-04-09T00:00:00.000Z'),
    }
  });

  console.log('✓ Tickets and metadata seeded');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
