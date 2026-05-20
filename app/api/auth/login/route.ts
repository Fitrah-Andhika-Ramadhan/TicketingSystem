import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import bcryptjs from 'bcryptjs';

// Hardcoded admin users - permanent credentials that never depend on database
const HARDCODED_USERS = [
  {
    id: '1',
    email: 'admin@fitrahpro.com',
    // bcrypt hash of 'FitrahPro@2026'
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    passwordPlain: 'FitrahPro@2026',
    name: 'Admin User',
    role: 'SUPER_ADMIN',
    department: 'Management',
    phoneNumber: '+62812345678',
    isActive: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('[VibeDesk] Login attempt:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    // 1. Check hardcoded users first (always works, no database needed)
    const hardcodedUser = HARDCODED_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (hardcodedUser) {
      // Accept plain password match OR bcrypt match
      const isValid =
        password === hardcodedUser.passwordPlain ||
        (await bcryptjs.compare(password, hardcodedUser.passwordHash).catch(() => false));

      if (!isValid) {
        return NextResponse.json(
          { error: 'Email atau password salah' },
          { status: 401 }
        );
      }

      if (!hardcodedUser.isActive) {
        return NextResponse.json(
          { error: 'Akun tidak aktif' },
          { status: 403 }
        );
      }

      const token = generateToken({
        userId: hardcodedUser.id,
        email: hardcodedUser.email,
        role: hardcodedUser.role,
      });

      const { passwordHash, passwordPlain, ...userWithoutPassword } = hardcodedUser;

      const response = NextResponse.json({
        success: true,
        user: userWithoutPassword,
        token,
      });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
      });

      console.log('[VibeDesk] Login success (hardcoded):', email);
      return response;
    }

    // 2. Fallback: try database (for users created via admin panel)
    try {
      const { prisma } = await import('@/lib/prisma');
      const dbUser = await prisma.user.findUnique({ where: { email } });

      if (!dbUser) {
        return NextResponse.json(
          { error: 'Email atau password salah' },
          { status: 401 }
        );
      }

      if (!dbUser.isActive) {
        return NextResponse.json(
          { error: 'Akun tidak aktif' },
          { status: 403 }
        );
      }

      const isValid = await bcryptjs.compare(password, dbUser.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Email atau password salah' },
          { status: 401 }
        );
      }

      const token = generateToken({
        userId: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
      });

      const { password: _, ...userWithoutPassword } = dbUser;

      const response = NextResponse.json({
        success: true,
        user: userWithoutPassword,
        token,
      });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
      });

      console.log('[VibeDesk] Login success (database):', email);
      return response;
    } catch (dbError) {
      console.error('[VibeDesk] Database login fallback failed:', dbError);
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('[VibeDesk] Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
