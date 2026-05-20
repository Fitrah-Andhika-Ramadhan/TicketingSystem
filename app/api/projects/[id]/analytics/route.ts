import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Generate mock analytics data for 30 days
function generateMockAnalytics(days: number) {
  const analytics = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    analytics.push({
      date,
      workersOnSite: Math.floor(Math.random() * 150) + 50,
      safetyIncidents: Math.floor(Math.random() * 3),
      qualityScore: Math.floor(Math.random() * 30) + 70,
      progressPercentage: 40 + Math.floor(i / days * 25),
      budgetUtilization: Math.floor(Math.random() * 30) + 60,
    });
  }
  return analytics;
}

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

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const analytics = generateMockAnalytics(days);

    // Calculate aggregates
    const totalDays = analytics.length;
    const avgWorkers = totalDays > 0 
      ? Math.round(analytics.reduce((sum, a) => sum + a.workersOnSite, 0) / totalDays)
      : 0;
    const totalIncidents = analytics.reduce((sum, a) => sum + a.safetyIncidents, 0);
    const avgQuality = totalDays > 0
      ? (analytics.reduce((sum, a) => sum + a.qualityScore, 0) / totalDays).toFixed(2)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        analytics,
        aggregates: {
          totalDays,
          avgWorkers,
          totalIncidents,
          avgQuality,
        },
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analytics = {
      projectId: params.id,
      date: today,
      ...body,
    };

    return NextResponse.json(
      { success: true, data: analytics },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
