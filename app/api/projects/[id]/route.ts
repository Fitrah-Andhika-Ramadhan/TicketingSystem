import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { readDB, writeDB, Project } from '@/lib/db-mock';

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

    const db = readDB();
    const project = db.projects.find(p => p.id === params.id);

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
    const db = readDB();
    const index = db.projects.findIndex(p => p.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = db.projects[index];

    // Update fields
    if (body.name) project.name = body.name;
    if (body.location) project.location = body.location;
    if (body.status) project.status = body.status;
    if (body.progress !== undefined) project.progress = Number(body.progress);
    if (body.budgetAmount !== undefined) project.budgetAmount = Number(body.budgetAmount);
    if (body.spentAmount !== undefined) project.spentAmount = Number(body.spentAmount);
    if (body.phases) project.phases = body.phases;

    db.projects[index] = project;
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: project,
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

    const db = readDB();
    const index = db.projects.findIndex(p => p.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    db.projects.splice(index, 1);
    writeDB(db);

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
