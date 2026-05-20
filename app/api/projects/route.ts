import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all projects
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const dbProjects = await prisma.project.findMany({
      include: {
        phases: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const projects = dbProjects.map(p => ({
      id: p.id,
      name: p.name,
      location: p.location,
      description: p.description || undefined,
      status: p.status,
      progress: p.progress,
      budgetAmount: p.budgetAmount,
      spentAmount: p.spentAmount,
      startDate: p.startDate.toISOString(),
      estimatedCompletion: p.estimatedCompletion?.toISOString(),
      endDate: p.endDate?.toISOString(),
      phases: p.phases.map(ph => ({
        id: ph.id,
        name: ph.name,
        progress: ph.progress,
      })),
    }));

    // Auto-seed one project if db is empty
    if (projects.length === 0) {
      const defaultProject = await prisma.project.create({
        data: {
          name: 'VibeDesk Initial Setup',
          location: 'Jakarta, Indonesia',
          description: 'Pembangunan platform VibeDesk.',
          status: 'In Progress',
          progress: 65,
          budgetAmount: 500000000,
          spentAmount: 325000000,
          startDate: new Date('2023-01-15'),
          estimatedCompletion: new Date('2025-12-31'),
          phases: {
            create: [
              { name: 'Foundation & Basement', progress: 100 },
              { name: 'Main Structure', progress: 85 },
              { name: 'Finishing & Interior', progress: 40 },
              { name: 'Testing & Handover', progress: 0 },
            ],
          },
        },
        include: {
          phases: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: [{
          id: defaultProject.id,
          name: defaultProject.name,
          location: defaultProject.location,
          description: defaultProject.description || undefined,
          status: defaultProject.status,
          progress: defaultProject.progress,
          budgetAmount: defaultProject.budgetAmount,
          spentAmount: defaultProject.spentAmount,
          startDate: defaultProject.startDate.toISOString(),
          estimatedCompletion: defaultProject.estimatedCompletion?.toISOString(),
          endDate: defaultProject.endDate?.toISOString(),
          phases: defaultProject.phases.map(ph => ({
            id: ph.id,
            name: ph.name,
            progress: ph.progress,
          })),
        }],
      });
    }

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new project
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, location, description, startDate, endDate, budgetAmount } = body;

    if (!name || !location || !startDate || !budgetAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const p = await prisma.project.create({
      data: {
        name,
        location,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        estimatedCompletion: endDate ? new Date(endDate) : null,
        budgetAmount: Number(budgetAmount),
        spentAmount: 0,
        status: 'Planning',
        progress: 0,
        phases: {
          create: [
            { name: 'Foundation', progress: 0 },
            { name: 'Structure', progress: 0 },
            { name: 'Finishing', progress: 0 },
          ],
        },
      },
      include: {
        phases: true,
      },
    });

    const mappedProject = {
      id: p.id,
      name: p.name,
      location: p.location,
      description: p.description || undefined,
      status: p.status,
      progress: p.progress,
      budgetAmount: p.budgetAmount,
      spentAmount: p.spentAmount,
      startDate: p.startDate.toISOString(),
      estimatedCompletion: p.estimatedCompletion?.toISOString(),
      endDate: p.endDate?.toISOString(),
      phases: p.phases.map(ph => ({
        id: ph.id,
        name: ph.name,
        progress: ph.progress,
      })),
    };

    return NextResponse.json(
      { success: true, data: mappedProject },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
