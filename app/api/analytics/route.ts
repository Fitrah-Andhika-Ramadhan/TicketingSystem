import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await prisma.ticket.findMany({
      select: {
        status: true,
        priority: true,
        createdAt: true,
      }
    });

    // Basic Metrics
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => ['OPEN', 'IN_PROGRESS', 'IN_REVIEW'].includes(t.status)).length;
    const closedTickets = tickets.filter(t => ['RESOLVED', 'CLOSED'].includes(t.status)).length;
    const criticalTickets = tickets.filter(t => t.priority === 'CRITICAL').length;

    // Trend over the last 30 days
    const trendDataMap: Record<string, any> = {};
    const today = new Date();
    
    // Initialize last 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      trendDataMap[dateStr] = {
        date: dateStr,
        created: 0,
        resolved: 0
      };
    }

    tickets.forEach(t => {
      const dateStr = t.createdAt.toISOString().split('T')[0];
      if (trendDataMap[dateStr]) {
        trendDataMap[dateStr].created += 1;
        if (['RESOLVED', 'CLOSED'].includes(t.status)) {
          trendDataMap[dateStr].resolved += 1;
        }
      }
    });

    const trendData = Object.values(trendDataMap);

    return NextResponse.json({
      success: true,
      data: {
        totalTickets,
        openTickets,
        closedTickets,
        criticalTickets,
        trendData,
        // Detailed metrics mapping for frontend mapping
        tickets
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
