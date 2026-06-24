import { NextRequest, NextResponse } from 'next/server';
import { generateToken, createUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, role = 'VIEWER', department, phoneNumber } = body;

    // Validation
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    // Real user creation in Supabase via Prisma
    const user = await createUser({
      email,
      name,
      password,
      role,
      department,
      phoneNumber
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      { success: true, user, token },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
