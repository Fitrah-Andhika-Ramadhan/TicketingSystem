import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TicketCategory, Priority, TicketStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Get all tickets or filter by search parameters
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    const decoded = verifyToken(token);
    if (!token || !decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const where: any = {};
    
    // Non-admin users can only see their own tickets
    if (decoded.role === 'VIEWER') {
      where.createdBy = decoded.userId;
    }
    
    if (status) {
      where.status = status as TicketStatus;
    }
    if (priority) {
      where.priority = priority as Priority;
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        createdByUser: {
          select: { name: true, email: true }
        },
        assignedUser: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedTickets = tickets.map(t => ({
      ...t,
      createdByName: t.createdByUser?.name || 'Admin User',
      createdByEmail: t.createdByUser?.email || 'admin@fitrahpro.com',
      assignedName: t.assignedUser?.name || null,
    }));

    return NextResponse.json({
      success: true,
      data: formattedTickets,
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
    const { title, description, category, priority, dueDate, attachments } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate next ticket number
    const count = await prisma.ticket.count();
    const ticketNumber = `TICKET-${String(count + 1).padStart(3, '0')}`;
    const userId = decoded?.userId || '1';

    const attachmentRecords = Array.isArray(attachments) ? attachments.map((fileUrl, idx) => ({
      fileName: `attachment-${idx + 1}`,
      fileUrl,
      fileSize: 0,
      fileType: 'image',
      uploadedBy: userId,
    })) : [];

    const newTicket = await prisma.ticket.create({
      data: {
        ticketNumber,
        title,
        description,
        category: category as TicketCategory,
        priority: (priority || 'MEDIUM') as Priority,
        status: 'PENDING_APPROVAL',
        createdBy: userId,
        dueDate: dueDate ? new Date(dueDate) : null,
        attachments: {
          create: attachmentRecords
        }
      },
      include: {
        createdByUser: {
          select: { name: true, email: true }
        },
        attachments: true
      }
    });

    // Create initial history record
    await prisma.ticketHistory.create({
      data: {
        ticketId: newTicket.id,
        action: 'created',
        newValue: `${ticketNumber} created`,
        changedBy: userId,
      }
    });

    const formattedTicket = {
      ...newTicket,
      createdByName: newTicket.createdByUser?.name || 'Admin User',
      createdByEmail: newTicket.createdByUser?.email || 'admin@fitrahpro.com',
      assignedName: null,
      comments: [],
      attachments: [],
      history: [
        {
          id: 'h-' + Date.now(),
          action: 'created',
          oldValue: null,
          newValue: `${ticketNumber} created`,
          changedAt: new Date().toISOString(),
        }
      ]
    };

    return NextResponse.json(
      { success: true, data: formattedTicket },
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
