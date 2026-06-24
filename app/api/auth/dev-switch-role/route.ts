import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { role } = body;

    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'FUNCTIONAL_TEAM', 'DEVELOPER', 'QA', 'VIEWER'];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Try to update DB, but fallback to static user if DB fails (e.g. demo mode)
    let updatedUser: any;
    try {
      if (decoded.userId !== '1' && decoded.userId !== 'demo-1') {
        updatedUser = await prisma.user.update({
          where: { id: decoded.userId },
          data: { role: role as Role },
          select: { id: true, name: true, email: true, role: true, department: true }
        });
      } else {
        throw new Error('Static user'); // Force fallback
      }
    } catch (dbError) {
      // Fallback for demo / static user
      updatedUser = {
        id: decoded.userId || '1',
        name: 'User',
        email: 'user@demo.com',
        role: role,
        department: 'Demo'
      };
      if (decoded.userId === '1') {
        updatedUser.name = 'Admin User';
        updatedUser.email = 'admin@fitrahpro.com';
        updatedUser.department = 'Management';
      } else if (decoded.userId === 'demo-1') {
        updatedUser.name = 'Admin Demo';
        updatedUser.email = 'demo@fitrahpro.com';
        updatedUser.department = 'Management';
      }
    }

    // Generate new token
    const newToken = generateToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        user: updatedUser,
        token: newToken,
      }
    });

    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Switch role error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
