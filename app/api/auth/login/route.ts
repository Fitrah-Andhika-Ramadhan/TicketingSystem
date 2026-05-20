import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('[v0] Login attempt:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock Login for local development without DB
    const useMockDb = process.env.NEXT_PUBLIC_USE_MOCK_DB === 'true' || process.env.USE_MOCK_DB === 'true';
    if (useMockDb) {
      console.log('[v0] Mocking login for local development');
      // Accept demo passwords
      const allowedPasswords = ['FitrahPro@2026', 'VibeDesk-2026', 'NataGroup@2024', 'FitrahPro-2026', 'FitrahPro.2026'];
      if (allowedPasswords.includes(password)) {
        const mockUser = {
          id: '1',
          email: email.includes('@') ? email : 'admin@fitrahpro.com',
          name: 'Admin User',
          role: 'SUPER_ADMIN',
          department: 'Management',
          isActive: true
        };
        // Standard pre-generated mock JWT
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJhZG1pbkBmaXRyYWhwcm8uY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzc5MjgwMTYzLCJleHAiOjE3Nzk4ODQ5NjN9.mock-signature';
        
        const response = NextResponse.json({
          success: true,
          user: mockUser,
          token: token,
        });

        response.cookies.set('token', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;
      } else {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    const result = await authenticateUser(email, password);
    console.log('[v0] Authentication result:', result ? 'Success' : 'Failed');

    if (!result) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    });

    // Set token in httpOnly cookie
    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
