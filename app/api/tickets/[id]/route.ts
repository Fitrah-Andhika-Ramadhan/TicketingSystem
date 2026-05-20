import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Mock ticket details
const mockTicketDetails: any = {
  '1': {
    id: '1',
    ticketNumber: 'TICKET-001',
    title: 'Login page not loading',
    description: 'Users unable to access login page on mobile devices. This is blocking new user registrations.',
    category: 'BUG',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdBy: '1',
    createdByName: 'Admin User',
    createdByEmail: 'fitrahramdhan31@gmail.com',
    assignedTo: '1',
    assignedName: 'Admin User',
    createdAt: new Date('2026-04-08'),
    updatedAt: new Date('2026-04-09'),
    resolutionTime: null,
    dueDate: new Date('2026-04-10'),
    comments: [
      {
        id: 'c1',
        content: 'Started investigating the issue',
        userId: '1',
        userName: 'Admin User',
        isInternal: false,
        createdAt: new Date('2026-04-09'),
      },
      {
        id: 'c2',
        content: 'Found bug in mobile responsive CSS',
        userId: '1',
        userName: 'Admin User',
        isInternal: true,
        createdAt: new Date('2026-04-09'),
      },
    ],
    attachments: [],
    history: [
      {
        id: 'h1',
        action: 'created',
        oldValue: null,
        newValue: 'TICKET-001 created',
        changedAt: new Date('2026-04-08'),
      },
      {
        id: 'h2',
        action: 'status_changed',
        oldValue: 'OPEN',
        newValue: 'IN_PROGRESS',
        changedAt: new Date('2026-04-09'),
      },
    ],
  },
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

    const ticket = mockTicketDetails[params.id];

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update ticket
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
    const ticket = mockTicketDetails[params.id];

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Update ticket fields
    if (body.status) ticket.status = body.status;
    if (body.priority) ticket.priority = body.priority;
    if (body.assignedTo) ticket.assignedTo = body.assignedTo;
    if (body.title) ticket.title = body.title;
    if (body.description) ticket.description = body.description;

    ticket.updatedAt = new Date();

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
