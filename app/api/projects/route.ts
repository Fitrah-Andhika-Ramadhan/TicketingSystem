import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Mock projects data
const mockProjects = [
  {
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
      { id: 'p1', name: 'Foundation & Basement', progress: 100 },
      { id: 'p2', name: 'Main Structure', progress: 85 },
      { id: 'p3', name: 'Finishing & Interior', progress: 40 },
      { id: 'p4', name: 'Testing & Handover', progress: 0 },
    ],
  },
];

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

    return NextResponse.json({
      success: true,
      data: mockProjects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    if (!name || !location || !startDate || !endDate || !budgetAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newProject = {
      id: String(mockProjects.length + 1),
      name,
      location,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budgetAmount,
      spentAmount: 0,
      status: 'Planning',
      progress: 0,
      phases: [],
    };

    mockProjects.push(newProject);

    return NextResponse.json(
      { success: true, data: newProject },
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
