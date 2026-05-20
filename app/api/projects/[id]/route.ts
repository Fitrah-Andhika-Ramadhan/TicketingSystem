import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get project detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const p = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        phases: true,
      },
    });

    if (!p) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Mix standard mock sub-fields for UI compatibility
    const projectDetail = {
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
      documents: [
        { id: 'd1', title: 'Master Plan', docType: 'BLUEPRINT', uploadedAt: new Date().toISOString() },
        { id: 'd2', title: 'SPR Document', docType: 'SPR', uploadedAt: new Date().toISOString() },
      ],
      milestones: [
        { id: 'm1', title: 'Structural Completion', dueDate: new Date().toISOString(), status: 'Completed', priority: 'High' },
      ],
      analytics: [],
    };

    return NextResponse.json({
      success: true,
      data: projectDetail,
    });
  } catch (error) {
    console.error('Get project detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const currentProject = await prisma.project.findUnique({
      where: { id: params.id }
    });

    if (!currentProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.location) updateData.location = body.location;
    if (body.status) updateData.status = body.status;
    if (body.progress !== undefined) updateData.progress = Number(body.progress);
    if (body.budgetAmount !== undefined) updateData.budgetAmount = Number(body.budgetAmount);
    if (body.spentAmount !== undefined) updateData.spentAmount = Number(body.spentAmount);

    if (body.phases && Array.isArray(body.phases)) {
      for (const phase of body.phases) {
        if (phase.id && phase.progress !== undefined) {
          // If the phase ID is a mock ID starting with 'p', update by order or handle appropriately
          await prisma.phase.update({
            where: { id: phase.id },
            data: { progress: Number(phase.progress) }
          }).catch(err => {
            console.warn(`Could not update phase ID: ${phase.id}`, err);
          });
        }
      }
    }

    const p = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      data: mappedProject,
    });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentProject = await prisma.project.findUnique({
      where: { id: params.id }
    });

    if (!currentProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
