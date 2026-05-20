import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1] || null;
  
  let verificationError = null;
  let decoded = null;
  
  if (token) {
    try {
      decoded = verifyToken(token);
      if (!decoded) {
        verificationError = 'verifyToken returned null (invalid signature or expired)';
      }
    } catch (e: any) {
      verificationError = e.message || String(e);
    }
  } else {
    verificationError = 'No token provided in Authorization header';
  }

  // Test Database Connection
  let dbConnectionSuccess = false;
  let dbError = null;
  let userCount = 0;
  
  try {
    userCount = await prisma.user.count();
    dbConnectionSuccess = true;
  } catch (e: any) {
    dbError = {
      message: e.message || String(e),
      code: e.code || null,
      meta: e.meta || null,
    };
  }

  return NextResponse.json({
    success: true,
    diagnostics: {
      env: {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        HAS_JWT_SECRET: !!process.env.JWT_SECRET,
        JWT_SECRET_PREVIEW: process.env.JWT_SECRET ? `${process.env.JWT_SECRET.substring(0, 3)}...` : 'not set',
        DATABASE_URL_SET: !!process.env.DATABASE_URL,
        DATABASE_URL_PREVIEW: process.env.DATABASE_URL ? (process.env.DATABASE_URL.includes('@') ? 'Has @ character' : 'Safe URL') : 'not set',
      },
      database: {
        success: dbConnectionSuccess,
        userCount,
        error: dbError,
      },
      request: {
        hasAuthorizationHeader: !!authHeader,
        authHeaderType: authHeader ? authHeader.split(' ')[0] : null,
        tokenLength: token ? token.length : 0,
      },
      tokenVerification: {
        decoded,
        error: verificationError,
      }
    }
  });
}
