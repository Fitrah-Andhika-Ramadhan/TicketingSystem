import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TicketCategory, Priority, TicketStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

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

    // Mock response for demo tickets to prevent DB crash
    if (['1', '2', '3', '4', '5'].includes(params.id)) {
      return NextResponse.json({
        success: true,
        data: {
          id: params.id,
          ticketNumber: `VD-104${6 - Number(params.id)}`,
          title: 'Demo Ticket',
          description: 'This is a demo ticket for simulation.',
          category: 'BUG',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          progress: 50,
          createdByName: 'Admin Demo',
          createdByEmail: 'demo@fitrahpro.com',
          assignedName: 'Admin Demo',
          comments: [],
          history: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        createdByUser: { select: { name: true, email: true } },
        assignedUser: { select: { name: true, email: true } },
        comments: {
          include: {
            user: { select: { name: true, email: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        history: {
          orderBy: { changedAt: 'desc' }
        },
        attachments: true
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    const formattedComments = ticket.comments.map(c => ({
      id: c.id,
      content: c.content,
      userId: c.userId,
      userName: c.user?.name || 'User',
      isInternal: c.isInternal,
      createdAt: c.createdAt.toISOString()
    }));

    const formattedHistory = ticket.history.map(h => ({
      id: h.id,
      action: h.action,
      oldValue: h.oldValue,
      newValue: h.newValue,
      changedAt: h.changedAt.toISOString()
    }));

    const formattedTicket = {
      ...ticket,
      createdByName: ticket.createdByUser?.name || 'Admin User',
      createdByEmail: ticket.createdByUser?.email || 'admin@fitrahpro.com',
      assignedName: ticket.assignedUser?.name || null,
      comments: formattedComments,
      history: formattedHistory,
    };

    return NextResponse.json({
      success: true,
      data: formattedTicket,
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
    const userId = decoded?.userId || '1';
    const body = await request.json();

    // Mock response for demo tickets to prevent DB crash
    if (['1', '2', '3', '4', '5'].includes(params.id)) {
      return NextResponse.json({
        success: true,
        data: {
          id: params.id,
          status: body.status || 'IN_PROGRESS',
          priority: body.priority || 'MEDIUM',
          progress: body.progress || 0,
        }
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: { assignedUser: true }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    
    // Handle Comment Addition
    if (body.comment) {
      await prisma.comment.create({
        data: {
          ticketId: ticket.id,
          userId: userId,
          content: body.comment.content,
          isInternal: body.comment.isInternal || false,
        }
      });

      await prisma.ticketHistory.create({
        data: {
          ticketId: ticket.id,
          action: 'comment_added',
          newValue: `Comment added: "${body.comment.content.substring(0, 30)}..."`,
          changedBy: userId,
        }
      });
    }

    // Update individual fields and create history records
    if (body.status && body.status !== ticket.status) {
      await prisma.ticketHistory.create({
        data: {
          ticketId: ticket.id,
          action: 'status_changed',
          oldValue: ticket.status,
          newValue: body.status,
          changedBy: userId,
        }
      });
      updateData.status = body.status as TicketStatus;
    }

    if (body.priority && body.priority !== ticket.priority) {
      await prisma.ticketHistory.create({
        data: {
          ticketId: ticket.id,
          action: 'priority_changed',
          oldValue: ticket.priority,
          newValue: body.priority,
          changedBy: userId,
        }
      });
      updateData.priority = body.priority as Priority;
    }

    if (body.assignedTo !== undefined && body.assignedTo !== ticket.assignedTo) {
      let assignedName = null;
      if (body.assignedTo) {
        const assignedUser = await prisma.user.findUnique({
          where: { id: body.assignedTo }
        });
        assignedName = assignedUser?.name || 'Support Agent';
      }
      await prisma.ticketHistory.create({
        data: {
          ticketId: ticket.id,
          action: 'assigned_to_changed',
          oldValue: ticket.assignedUser?.name || null,
          newValue: assignedName,
          changedBy: userId,
        }
      });
      updateData.assignedTo = body.assignedTo;
    }

    if (body.title && body.title !== ticket.title) updateData.title = body.title;
    if (body.description && body.description !== ticket.description) updateData.description = body.description;

    if (body.progress !== undefined && body.progress !== ticket.progress) {
      await prisma.ticketHistory.create({
        data: {
          ticketId: ticket.id,
          action: 'progress_changed',
          oldValue: ticket.progress?.toString() || '0',
          newValue: body.progress.toString(),
          changedBy: userId,
        }
      });
      updateData.progress = parseInt(body.progress);
    }
    
    if (body.solution !== undefined) {
      updateData.solution = body.solution;
    }
    
    if (body.recommendation !== undefined) {
      updateData.recommendation = body.recommendation;
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: params.id },
      data: updateData,
      include: {
        createdByUser: { select: { name: true, email: true } },
        assignedUser: { select: { name: true, email: true } },
        comments: {
          include: {
            user: { select: { name: true, email: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        history: {
          orderBy: { changedAt: 'desc' }
        },
        attachments: true
      }
    });

    const formattedComments = updatedTicket.comments.map(c => ({
      id: c.id,
      content: c.content,
      userId: c.userId,
      userName: c.user?.name || 'User',
      isInternal: c.isInternal,
      createdAt: c.createdAt.toISOString()
    }));

    const formattedHistory = updatedTicket.history.map(h => ({
      id: h.id,
      action: h.action,
      oldValue: h.oldValue,
      newValue: h.newValue,
      changedAt: h.changedAt.toISOString()
    }));

    const formattedTicket = {
      ...updatedTicket,
      createdByName: updatedTicket.createdByUser?.name || 'Admin User',
      createdByEmail: updatedTicket.createdByUser?.email || 'admin@fitrahpro.com',
      assignedName: updatedTicket.assignedUser?.name || null,
      comments: formattedComments,
      history: formattedHistory,
    };

    return NextResponse.json({
      success: true,
      data: formattedTicket,
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

    const ticketExists = await prisma.ticket.findUnique({
      where: { id: params.id },
    });

    if (!ticketExists) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    await prisma.ticket.delete({
      where: { id: params.id },
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
