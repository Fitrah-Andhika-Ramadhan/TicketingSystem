import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { readDB, writeDB, TicketComment, TicketHistory } from '@/lib/db-mock';

// Get ticket details
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
    const ticket = db.tickets.find(t => t.id === params.id);

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

    const decoded = verifyToken(token);
    const body = await request.json();
    const db = readDB();
    const ticketIndex = db.tickets.findIndex(t => t.id === params.id);

    if (ticketIndex === -1) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    const ticket = db.tickets[ticketIndex];
    const history: TicketHistory[] = ticket.history || [];

    // Handle Comment Addition
    if (body.comment) {
      const newComment: TicketComment = {
        id: 'c-' + Date.now(),
        content: body.comment.content,
        userId: decoded?.userId || '1',
        userName: decoded?.email ? decoded.email.split('@')[0] : 'Admin',
        isInternal: body.comment.isInternal || false,
        createdAt: new Date().toISOString(),
      };
      ticket.comments = [newComment, ...(ticket.comments || [])];
      
      history.push({
        id: 'h-' + Date.now(),
        action: 'comment_added',
        oldValue: null,
        newValue: `Comment added: "${body.comment.content.substring(0, 30)}..."`,
        changedAt: new Date().toISOString(),
      });
    }

    // Update individual fields
    if (body.status && body.status !== ticket.status) {
      history.push({
        id: 'h-' + Date.now() + '-status',
        action: 'status_changed',
        oldValue: ticket.status,
        newValue: body.status,
        changedAt: new Date().toISOString(),
      });
      ticket.status = body.status;
    }

    if (body.priority && body.priority !== ticket.priority) {
      history.push({
        id: 'h-' + Date.now() + '-priority',
        action: 'priority_changed',
        oldValue: ticket.priority,
        newValue: body.priority,
        changedAt: new Date().toISOString(),
      });
      ticket.priority = body.priority;
    }

    if (body.assignedTo && body.assignedTo !== ticket.assignedTo) {
      const assignedName = body.assignedTo === '1' ? 'Admin User' : 'Support Agent';
      history.push({
        id: 'h-' + Date.now() + '-assignment',
        action: 'assigned_to_changed',
        oldValue: ticket.assignedName,
        newValue: assignedName,
        changedAt: new Date().toISOString(),
      });
      ticket.assignedTo = body.assignedTo;
      ticket.assignedName = assignedName;
    }

    if (body.title && body.title !== ticket.title) ticket.title = body.title;
    if (body.description && body.description !== ticket.description) ticket.description = body.description;

    ticket.updatedAt = new Date().toISOString();
    ticket.history = history;

    db.tickets[ticketIndex] = ticket;
    writeDB(db);

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

// Delete ticket
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
    const index = db.tickets.findIndex(t => t.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    db.tickets.splice(index, 1);
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    console.error('Delete ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
