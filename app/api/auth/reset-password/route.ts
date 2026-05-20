import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

interface ResetTokenPayload {
  email: string;
  purpose: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    // 1. Verify the JWT token
    let decoded: ResetTokenPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as ResetTokenPayload;
      if (decoded.purpose !== 'password-reset') {
        throw new Error('Invalid token purpose');
      }
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }

    const email = decoded.email.toLowerCase();
    console.log('[Reset Password] Resetting password for:', email);

    // 2. Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // 3. Update password in the database (skip if mock mode)
    if (process.env.NEXT_PUBLIC_USE_MOCK_DB !== 'true') {
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      });
      console.log('[Reset Password] Updated password in SQL for:', email);
    } else {
      console.log('[Reset Password] Mock mode active. Password reset simulation succeeded for:', email);
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully.'
    });
  } catch (error: any) {
    console.error('[Reset Password] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
