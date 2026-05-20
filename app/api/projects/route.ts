import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { readDB, writeDB, Project } from '@/lib/db-mock';

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

    const db = readDB();

    return NextResponse.json({
      success: true,
      data: db.projects,
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

    if (!name || !location || !startDate || !budgetAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = readDB();
    const newId = String(db.projects.length > 0 ? Math.max(...db.projects.map(p => Number(p.id))) + 1 : 1);

    const newProject: Project = {
      id: newId,
      name,
      location,
      description,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      estimatedCompletion: endDate ? new Date(endDate).toISOString() : undefined,
      budgetAmount: Number(budgetAmount),
      spentAmount: 0,
      status: 'Planning',
      progress: 0,
      phases: [
        { id: 'p1', name: 'Foundation', progress: 0 },
        { id: 'p2', name: 'Structure', progress: 0 },
        { id: 'p3', name: 'Finishing', progress: 0 },
      ],
    };

    db.projects.push(newProject);
    writeDB(db);

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
