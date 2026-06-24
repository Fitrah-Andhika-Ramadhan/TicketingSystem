import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Role is required' },
        { status: 400 }
      );
    }

    // Hanya mensimulasikan role dengan token baru untuk user demo
    const demoUser = {
      id: 'demo-1',
      email: 'demo@fitrahpro.com',
      name: 'Demo User',
      role: role,
      department: 'Operations',
    };

    const token = generateToken({
      id: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
    });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: demoUser,
      },
    });
  } catch (error) {
    console.error('Demo switch role error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
