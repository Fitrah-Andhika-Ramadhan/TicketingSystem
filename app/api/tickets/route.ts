import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Mock tickets database
let mockTickets = [
  {
    id: '1',
    ticketNumber: 'TICKET-001',
    title: 'Login page not loading',
    description: 'Users unable to access login page on mobile devices',
    category: 'BUG',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdBy: '1',
    createdByName: 'Admin User',
    assignedTo: '1',
    assignedName: 'Admin User',
    createdAt: new Date('2026-04-08'),
    updatedAt: new Date('2026-04-09'),
    resolutionTime: null,
  },
  {
    id: '2',
    ticketNumber: 'TICKET-002',
    title: 'Add dark mode feature',
    description: 'Implement dark mode throughout the application',
    category: 'FEATURE_REQUEST',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdBy: '1',
    createdByName: 'Admin User',
    assignedTo: null,
    assignedName: null,
    createdAt: new Date('2026-04-09'),
    updatedAt: new Date('2026-04-09'),
    resolutionTime: null,
  },
];

// Get all tickets or filter by user
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    let tickets = mockTickets;

    if (status) {
      tickets = tickets.filter(t => t.status === status);
    }
    if (priority) {
      tickets = tickets.filter(t => t.priority === priority);
    }

    return NextResponse.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new ticket
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
    const { title, description, category, priority } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newTicket = {
      id: String(mockTickets.length + 1),
      ticketNumber: `TICKET-${String(mockTickets.length + 1).padStart(3, '0')}`,
      title,
      description,
      category,
      priority: priority || 'MEDIUM',
      status: 'OPEN',
      createdBy: '1',
      createdByName: 'Admin User',
      assignedTo: null,
      assignedName: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      resolutionTime: null,
    };

    mockTickets.push(newTicket);

    return NextResponse.json(
      { success: true, data: newTicket },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
