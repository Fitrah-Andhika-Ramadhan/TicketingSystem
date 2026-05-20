import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Mock project data
const mockProjectDetail = {
  id: '1',
  name: 'Metro Paragon Residence',
  location: 'Jakarta, Indonesia',
  status: 'In Progress',
  progress: 65,
  budgetAmount: 500000000,
  spentAmount: 325000000,
  startDate: new Date('2023-01-15'),
  estimatedCompletion: new Date('2025-12-31'),
  phases: [
    { id: 'p1', name: 'Foundation & Basement', progress: 100, status: 'Completed' },
    { id: 'p2', name: 'Main Structure', progress: 85, status: 'In Progress' },
    { id: 'p3', name: 'Finishing & Interior', progress: 40, status: 'In Progress' },
    { id: 'p4', name: 'Testing & Handover', progress: 0, status: 'Planned' },
  ],
  documents: [
    { id: 'd1', title: 'Master Plan', docType: 'BLUEPRINT', uploadedAt: new Date() },
    { id: 'd2', title: 'SPR Document', docType: 'SPR', uploadedAt: new Date() },
  ],
  milestones: [
    { id: 'm1', title: 'Structural Completion', dueDate: new Date(), status: 'Completed', priority: 'High' },
  ],
  analytics: [],
};

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

    if (params.id !== '1') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mockProjectDetail,
    });
  } catch (error) {
    console.error('Get project detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Mock update - just return updated project
    const updatedProject = {
      ...mockProjectDetail,
      ...body,
    };

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
