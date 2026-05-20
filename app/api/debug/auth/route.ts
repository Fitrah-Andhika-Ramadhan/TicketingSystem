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

  // Parse DATABASE_URL safely
  let dbUrlParsed = null;
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      // Basic split check to avoid URL parse errors if socket path contains slashes
      const atIndex = dbUrl.lastIndexOf('@');
      if (atIndex !== -1) {
        const credentialsPart = dbUrl.substring(0, atIndex);
        const hostPart = dbUrl.substring(atIndex + 1);
        
        const credsMatch = credentialsPart.match(/^mysql:\/\/([^:]+):(.*)$/);
        if (credsMatch) {
          const [_, username, password] = credsMatch;
          dbUrlParsed = {
            username,
            passwordLength: password.length,
            passwordFirst3: password.substring(0, 3),
            passwordLast3: password.substring(password.length - 3),
            passwordContainsPercent40: password.includes('%40'),
            passwordContainsAt: password.includes('@'),
            hostPartPreview: hostPart.substring(0, 30) + '...',
          };
        } else {
          dbUrlParsed = { error: 'Failed to split username and password' };
        }
      } else {
        dbUrlParsed = { error: 'No @ delimiter found in connection URL' };
      }
    } catch (e: any) {
      dbUrlParsed = { error: e.message || String(e) };
    }
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
        DATABASE_URL_PARSED: dbUrlParsed,
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
