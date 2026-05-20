import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { readDB, writeDB, Ticket } from '@/lib/db-mock';

// Get all tickets or filter by search parameters
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

    const db = readDB();
    let tickets = db.tickets;

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

    const decoded = verifyToken(token);
    const body = await request.json();
    const { title, description, category, priority, dueDate } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = readDB();
    const newId = String(db.tickets.length > 0 ? Math.max(...db.tickets.map(t => Number(t.id))) + 1 : 1);
    
    const newTicket: Ticket = {
      id: newId,
      ticketNumber: `TICKET-${String(newId).padStart(3, '0')}`,
      title,
      description,
      category,
      priority: priority || 'MEDIUM',
      status: 'OPEN',
      createdBy: decoded?.userId || '1',
      createdByName: 'Admin User',
      createdByEmail: decoded?.email || 'admin@natagroup.com',
      assignedTo: null,
      assignedName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolutionTime: null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      comments: [],
      attachments: [],
      history: [
        {
          id: 'h-' + Date.now(),
          action: 'created',
          oldValue: null,
          newValue: `TICKET-${String(newId).padStart(3, '0')} created`,
          changedAt: new Date().toISOString(),
        }
      ],
    };

    db.tickets.push(newTicket);
    writeDB(db);

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
