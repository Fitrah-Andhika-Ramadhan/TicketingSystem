import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const t = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        createdByUser: true,
        assignedUser: true,
        comments: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        history: {
          orderBy: {
            changedAt: 'desc'
          }
        }
      }
    });

    if (!t) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    const mappedTicket = {
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
    };

    return NextResponse.json({
      success: true,
      data: mappedTicket,
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

    const currentTicket = await prisma.ticket.findUnique({
      where: { id: params.id }
    });

    if (!currentTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    const historyEntries: any[] = [];
    const changerId = decoded?.userId || '1';

    // Ensure changer user exists in database first
    const userExists = await prisma.user.findUnique({
      where: { id: changerId }
    });
    if (!userExists) {
      await prisma.user.create({
        data: {
          id: changerId,
          email: decoded?.email || 'admin@fitrahpro.com',
          name: 'Admin User',
          password: 'FitrahPro@2026_hashed',
          role: 'SUPER_ADMIN',
          department: 'Management',
          isActive: true
        }
      });
    }

    // Handle Comment Addition
    if (body.comment) {
      await prisma.comment.create({
        data: {
          ticketId: params.id,
          userId: changerId,
          content: body.comment.content,
          isInternal: body.comment.isInternal || false
        }
      });

      historyEntries.push({
        action: 'comment_added',
        newValue: `Comment added: "${body.comment.content.substring(0, 30)}..."`,
        changedBy: changerId
      });
    }

    // Update individual fields
    if (body.status && body.status !== currentTicket.status) {
      historyEntries.push({
        action: 'status_changed',
        oldValue: currentTicket.status,
        newValue: body.status,
        changedBy: changerId
      });
      updateData.status = body.status as any;
    }

    if (body.priority && body.priority !== currentTicket.priority) {
      historyEntries.push({
        action: 'priority_changed',
        oldValue: currentTicket.priority,
        newValue: body.priority,
        changedBy: changerId
      });
      updateData.priority = body.priority as any;
    }

    if (body.assignedTo !== undefined && body.assignedTo !== currentTicket.assignedTo) {
      if (body.assignedTo) {
        // Ensure assigned user exists
        const assignedUserExists = await prisma.user.findUnique({
          where: { id: body.assignedTo }
        });
        if (!assignedUserExists) {
          await prisma.user.create({
            data: {
              id: body.assignedTo,
              email: body.assignedTo === '1' ? 'admin@fitrahpro.com' : `agent${body.assignedTo}@natagroup.com`,
              name: body.assignedTo === '1' ? 'Admin User' : `Support Agent ${body.assignedTo}`,
              password: 'FitrahPro@2026_hashed',
              role: body.assignedTo === '1' ? 'SUPER_ADMIN' : 'MANAGER',
              department: 'Support',
              isActive: true
            }
          });
        }
      }

      historyEntries.push({
        action: 'assigned_to_changed',
        oldValue: currentTicket.assignedTo,
        newValue: body.assignedTo || null,
        changedBy: changerId
      });
      updateData.assignedTo = body.assignedTo || null;
    }

    if (body.title && body.title !== currentTicket.title) {
      updateData.title = body.title;
    }
    if (body.description && body.description !== currentTicket.description) {
      updateData.description = body.description;
    }

    if (historyEntries.length > 0) {
      updateData.history = {
        create: historyEntries
      };
    }

    updateData.updatedAt = new Date();

    const t = await prisma.ticket.update({
      where: { id: params.id },
      data: updateData,
      include: {
        createdByUser: true,
        assignedUser: true,
        comments: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        history: {
          orderBy: {
            changedAt: 'desc'
          }
        }
      }
    });

    const mappedTicket = {
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
    };

    return NextResponse.json({
      success: true,
      data: mappedTicket,
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

    const currentTicket = await prisma.ticket.findUnique({
      where: { id: params.id }
    });

    if (!currentTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    await prisma.ticket.delete({
      where: { id: params.id }
    });

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
