import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('[Forgot Password] Request received for:', email);

    let userExists = false;

    // Check in Mock DB
    if (process.env.NEXT_PUBLIC_USE_MOCK_DB === 'true') {
      const mockEmails = [
        'admin@fitrahpro.com',
        'agent1@natagroup.com',
        'agent2@natagroup.com',
        'viewer@natagroup.com'
      ];
      userExists = mockEmails.includes(email.toLowerCase());
    } else {
      // Check in real Database
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });
      userExists = !!user;
    }

    if (!userExists) {
      // Return 404 if user not found
      return NextResponse.json(
        { error: 'User with this email does not exist' },
        { status: 404 }
      );
    }

    // Generate short-lived JWT token for password reset (15 minutes)
    const token = jwt.sign(
      { email: email.toLowerCase(), purpose: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `${APP_URL}/reset-password?token=${token}`;
    console.log('[Forgot Password] Generated reset link:', resetLink);

    // In a full production system, we would send this link via email here.
    // For convenience in this setup, we return the reset link in the response.
    return NextResponse.json({
      success: true,
      message: 'Password reset link generated successfully.',
      resetLink: resetLink, // Provided directly for easy reset without email server
    });
  } catch (error: any) {
    console.error('[Forgot Password] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
