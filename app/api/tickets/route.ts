import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

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

    const dbTickets = await prisma.ticket.findMany({
      where: {
        status: status ? (status as any) : undefined,
        priority: priority ? (priority as any) : undefined,
      },
      include: {
        createdByUser: true,
        assignedUser: true,
        comments: {
          include: {
            user: true
          }
        },
        history: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const tickets = dbTickets.map(t => ({
      id: t.id,
      ticketNumber: t.ticketNumber,
      title: t.title,
      description: t.description,
      category: t.category,
      priority: t.priority,
      status: t.status,
      createdBy: t.createdBy,
      createdByName: t.createdByUser?.name || 'Admin User',
      createdByEmail: t.createdByUser?.email || 'admin@fitrahpro.com',
      assignedTo: t.assignedTo,
      assignedName: t.assignedUser?.name || null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      resolutionTime: t.resolutionTime,
      dueDate: t.dueDate?.toISOString(),
      comments: t.comments.map(c => ({
        id: c.id,
        content: c.content,
        userId: c.userId,
        userName: c.user?.name || 'User',
        isInternal: c.isInternal,
        createdAt: c.createdAt.toISOString()
      })),
      attachments: t.attachments || [],
      history: t.history.map(h => ({
        id: h.id,
        action: h.action,
        oldValue: h.oldValue,
        newValue: h.newValue,
        changedAt: h.changedAt.toISOString()
      }))
    }));

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

    console.log('[v0] POST ticket - token received:', token ? (token.substring(0, 10) + '...') : 'none');

    if (!token) {
      console.error('[v0] POST ticket - No token provided');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error('[v0] POST ticket - Token verification failed. The JWT_SECRET might have changed or token is expired.');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category, priority, dueDate } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const creatorId = decoded?.userId || '1';

    // Ensure creator user exists in database first
    const userExists = await prisma.user.findUnique({
      where: { id: creatorId }
    });

    if (!userExists) {
      await prisma.user.create({
        data: {
          id: creatorId,
          email: decoded?.email || 'admin@fitrahpro.com',
          name: 'Admin User',
          password: await bcryptjs.hash('FitrahPro@2026', 10),
          role: 'SUPER_ADMIN',
          department: 'Management',
          isActive: true
        }
      });
    }

    const totalTickets = await prisma.ticket.count();
    const ticketNumber = `TICKET-${String(totalTickets + 1).padStart(3, '0')}`;

    const newDbTicket = await prisma.ticket.create({
      data: {
        ticketNumber,
        title,
        description,
        category: category as any,
        priority: (priority || 'MEDIUM') as any,
        status: 'OPEN',
        createdBy: creatorId,
        dueDate: dueDate ? new Date(dueDate) : null,
        history: {
          create: {
            action: 'created',
            newValue: `${ticketNumber} created`,
            changedBy: creatorId
          }
        }
      },
      include: {
        createdByUser: true,
        assignedUser: true,
        comments: {
          include: {
            user: true
          }
        },
        history: true
      }
    });

    const mappedTicket = {
      id: newDbTicket.id,
      ticketNumber: newDbTicket.ticketNumber,
      title: newDbTicket.title,
      description: newDbTicket.description,
      category: newDbTicket.category,
      priority: newDbTicket.priority,
      status: newDbTicket.status,
      createdBy: newDbTicket.createdBy,
      createdByName: newDbTicket.createdByUser.name,
      createdByEmail: newDbTicket.createdByUser.email,
      assignedTo: newDbTicket.assignedTo,
      assignedName: newDbTicket.assignedUser?.name || null,
      createdAt: newDbTicket.createdAt.toISOString(),
      updatedAt: newDbTicket.updatedAt.toISOString(),
      resolutionTime: newDbTicket.resolutionTime,
      dueDate: newDbTicket.dueDate?.toISOString(),
      comments: [],
      attachments: [],
      history: newDbTicket.history.map(h => ({
        id: h.id,
        action: h.action,
        oldValue: h.oldValue,
        newValue: h.newValue,
        changedAt: h.changedAt.toISOString()
      }))
    };

    return NextResponse.json(
      { success: true, data: mappedTicket },
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
