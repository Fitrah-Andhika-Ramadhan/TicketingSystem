const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (caution: this removes all data)
  console.log('Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.document.deleteMany();
  await prisma.analytics.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.block.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Data cleared');

  // Create users
  console.log('Creating users...');
  const hashedPassword = await bcryptjs.hash('NataGroup@2024', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'fitrahramdhan31@gmail.com',
      name: 'Admin Nata Group',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      department: 'Management',
      phoneNumber: '+62812345678',
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@natagroup.com',
      name: 'Project Manager',
      password: hashedPassword,
      role: 'MANAGER',
      department: 'Project Management',
      phoneNumber: '+62812345679',
    },
  });

  const contractorUser = await prisma.user.create({
    data: {
      email: 'contractor@natagroup.com',
      name: 'Contractor Lead',
      password: hashedPassword,
      role: 'CONTRACTOR',
      department: 'Construction',
      phoneNumber: '+62812345680',
    },
  });

  const viewerUser = await prisma.user.create({
    data: {
      email: 'viewer@natagroup.com',
      name: 'Document Viewer',
      password: hashedPassword,
      role: 'VIEWER',
      department: 'Sales',
      phoneNumber: '+62812345681',
    },
  });

  console.log(`✓ Created ${4} users`);

  // Create project
  console.log('Creating project...');
  const project = await prisma.project.create({
    data: {
      name: 'Metro Paragon Residence',
      location: 'Jakarta Selatan, Indonesia',
      description: 'Modern residential complex with 2000+ units across multiple blocks',
      status: 'IN_PROGRESS',
      startDate: new Date('2023-01-15'),
      endDate: new Date('2026-12-31'),
      budgetAmount: 500000000, // 500M IDR
      projectManager: 'Budi Hartono',
      contractor: 'PT. Konstruksi Maju',
    },
  });

  console.log(`✓ Created project: ${project.name}`);

  // Create phases
  console.log('Creating phases...');
  const phases = await Promise.all([
    prisma.phase.create({
      data: {
        projectId: project.id,
        name: 'Phase 1: Foundation & Infrastructure',
        description: 'Land preparation, foundation work, and basic infrastructure',
        order: 1,
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-12-31'),
        progress: 100,
        status: 'COMPLETED',
      },
    }),
    prisma.phase.create({
      data: {
        projectId: project.id,
        name: 'Phase 2: Structure & Skeleton',
        description: 'Building structure and steel framework',
        order: 2,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-09-30'),
        progress: 85,
        status: 'IN_PROGRESS',
      },
    }),
    prisma.phase.create({
      data: {
        projectId: project.id,
        name: 'Phase 3: Internal Finishing',
        description: 'Internal walls, plumbing, electrical work',
        order: 3,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2025-09-30'),
        progress: 45,
        status: 'IN_PROGRESS',
      },
    }),
    prisma.phase.create({
      data: {
        projectId: project.id,
        name: 'Phase 4: Final Finishing & Handover',
        description: 'Final touches, inspection, and unit handover',
        order: 4,
        startDate: new Date('2025-08-01'),
        endDate: new Date('2026-12-31'),
        progress: 0,
        status: 'NOT_STARTED',
      },
    }),
  ]);

  console.log(`✓ Created ${phases.length} phases`);

  // Create blocks
  console.log('Creating blocks...');
  const blocks = await Promise.all([
    prisma.block.create({
      data: {
        projectId: project.id,
        phaseId: phases[1].id,
        name: 'Block A - Tower 1',
        blockCode: 'BLK-A1',
        unitCount: 150,
        floorCount: 25,
        progress: 90,
        status: 'STRUCTURE',
      },
    }),
    prisma.block.create({
      data: {
        projectId: project.id,
        phaseId: phases[1].id,
        name: 'Block B - Tower 2',
        blockCode: 'BLK-B1',
        unitCount: 150,
        floorCount: 25,
        progress: 85,
        status: 'STRUCTURE',
      },
    }),
    prisma.block.create({
      data: {
        projectId: project.id,
        phaseId: phases[2].id,
        name: 'Block C - Tower 3',
        blockCode: 'BLK-C1',
        unitCount: 200,
        floorCount: 30,
        progress: 50,
        status: 'FINISHING',
      },
    }),
    prisma.block.create({
      data: {
        projectId: project.id,
        phaseId: phases[0].id,
        name: 'Block D - Commercial Zone',
        blockCode: 'BLK-D1',
        unitCount: 100,
        floorCount: 15,
        progress: 100,
        status: 'COMPLETED',
      },
    }),
  ]);

  console.log(`✓ Created ${blocks.length} blocks`);

  // Create units
  console.log('Creating units...');
  let unitCount = 0;
  for (const block of blocks.slice(0, 2)) {
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 3; j++) {
        await prisma.unit.create({
          data: {
            blockId: block.id,
            projectId: project.id,
            unitCode: `${block.blockCode}-${i}${j}`,
            unitType: j === 1 ? 'Studio' : j === 2 ? '2BR' : '3BR',
            floor: i,
            saleStatus: i % 3 === 0 ? 'SOLD' : i % 2 === 0 ? 'RESERVED' : 'AVAILABLE',
            buyerName: i % 3 === 0 ? `Buyer ${i}` : null,
            buyerEmail: i % 3 === 0 ? `buyer${i}@email.com` : null,
            progress: i % 3 === 0 ? 90 : i % 2 === 0 ? 60 : 30,
            status: i % 3 === 0 ? 'FINAL_FINISHING' : i % 2 === 0 ? 'INTERNAL_FINISHING' : 'STRUCTURE',
          },
        });
        unitCount++;
      }
    }
  }

  console.log(`✓ Created ${unitCount} units`);

  // Create milestones
  console.log('Creating milestones...');
  const milestones = await Promise.all([
    prisma.milestone.create({
      data: {
        projectId: project.id,
        title: 'Phase 2 Structure Completion',
        description: 'Complete structural work for Phase 2',
        dueDate: new Date('2024-09-30'),
        completedAt: null,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
      },
    }),
    prisma.milestone.create({
      data: {
        projectId: project.id,
        title: 'Block A Final Inspection',
        description: 'Final inspection for Block A',
        dueDate: new Date('2024-12-15'),
        completedAt: null,
        status: 'PENDING',
        priority: 'CRITICAL',
      },
    }),
    prisma.milestone.create({
      data: {
        projectId: project.id,
        title: '50% Unit Handover',
        description: 'Handover of 50% of completed units',
        dueDate: new Date('2025-06-30'),
        completedAt: null,
        status: 'PENDING',
        priority: 'HIGH',
      },
    }),
  ]);

  console.log(`✓ Created ${milestones.length} milestones`);

  // Create analytics data
  console.log('Creating analytics...');
  const analyticsData = [];
  const baseDate = new Date('2024-01-01');
  for (let i = 0; i < 90; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    
    analyticsData.push({
      projectId: project.id,
      date: date,
      workersOnSite: Math.floor(Math.random() * 500) + 100,
      safetyIncidents: Math.random() > 0.95 ? 1 : 0,
      equipmentUsage: Math.random() * 80 + 20,
      dailyCost: Math.random() * 50000000 + 20000000,
      dailyRevenue: Math.random() * 30000000 + 5000000,
      overallProgress: Math.min(30 + (i * 0.5), 100),
      qualityScore: Math.random() * 10 + 90,
      defectCount: Math.floor(Math.random() * 5),
    });
  }

  await prisma.analytics.createMany({ data: analyticsData });
  console.log(`✓ Created ${analyticsData.length} analytics records`);

  // Create documents
  console.log('Creating documents...');
  const documents = await Promise.all([
    prisma.document.create({
      data: {
        projectId: project.id,
        title: 'SPR Metro Paragon - Phase 2',
        description: 'Surat Pernyataan Rencana for Phase 2',
        fileType: 'PDF',
        fileUrl: '/documents/spr-phase2.pdf',
        fileSize: 2.5,
        docType: 'SPR',
        uploadedBy: adminUser.id,
      },
    }),
    prisma.document.create({
      data: {
        projectId: project.id,
        title: 'Architecture Blueprint - Block A',
        description: 'Complete architecture blueprint for Block A',
        fileType: 'PDF',
        fileUrl: '/documents/blueprint-block-a.pdf',
        fileSize: 15.8,
        docType: 'BLUEPRINT',
        uploadedBy: managerUser.id,
      },
    }),
    prisma.document.create({
      data: {
        projectId: project.id,
        title: 'Construction Contract',
        description: 'Main construction contract with contractor',
        fileType: 'PDF',
        fileUrl: '/documents/contract-main.pdf',
        fileSize: 5.2,
        docType: 'CONTRACT',
        uploadedBy: adminUser.id,
      },
    }),
  ]);

  console.log(`✓ Created ${documents.length} documents`);

  // Create activities
  console.log('Creating activities...');
  const activities = [
    {
      projectId: project.id,
      phaseId: phases[1].id,
      blockId: blocks[0].id,
      userId: managerUser.id,
      title: 'Block A Structure Milestone',
      description: 'Reached 90% completion on structural work',
      activityType: 'PROGRESS_UPDATED',
    },
    {
      projectId: project.id,
      phaseId: null,
      blockId: null,
      userId: adminUser.id,
      title: 'Project Budget Updated',
      description: 'Q2 2024 budget adjusted',
      activityType: 'BUDGET_UPDATED',
    },
    {
      projectId: project.id,
      phaseId: phases[2].id,
      blockId: blocks[2].id,
      userId: contractorUser.id,
      title: 'Safety Incident Report',
      description: 'Minor incident reported and resolved',
      activityType: 'SAFETY_INCIDENT',
    },
  ];

  await prisma.activity.createMany({ data: activities });
  console.log(`✓ Created ${activities.length} activities`);

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
