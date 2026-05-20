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

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Mix standard mock sub-fields for UI compatibility
    const projectDetail = {
      ...project,
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
    
    const projectExists = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!projectExists) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.progress !== undefined) updateData.progress = Number(body.progress);
    if (body.budgetAmount !== undefined) updateData.budgetAmount = Number(body.budgetAmount);
    if (body.spentAmount !== undefined) updateData.spentAmount = Number(body.spentAmount);
    if (body.phases !== undefined) updateData.phases = body.phases;

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedProject,
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

    const projectExists = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!projectExists) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id: params.id },
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
