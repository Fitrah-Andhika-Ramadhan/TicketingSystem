import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        department: true,
        phoneNumber: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Also include static admin users
    const staticUsers = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@fitrahpro.com',
        role: 'SUPER_ADMIN',
        isActive: true,
        department: 'Management',
        phoneNumber: '+62812345678',
      },
      {
        id: 'demo-1',
        name: 'Admin Demo',
        email: 'demo@fitrahpro.com',
        role: 'SUPER_ADMIN',
        isActive: true,
        department: 'Management',
        phoneNumber: '+62812345678',
      }
    ];

    const allUsers = [...staticUsers, ...users];

    return NextResponse.json({ success: true, data: allUsers });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, department, role, phoneNumber } = body;

    const hashedPassword = await bcrypt.hash('fitrahdindaaja@123', 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        department,
        role: role || 'VIEWER',
        phoneNumber,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error('Failed to create user:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Failed to create user' }, { status: 500 });
  }
}
