import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

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

  // Test 1: Connection to 'vibedesk' database
  let dbVibedeskSuccess = false;
  let dbVibedeskError = null;
  try {
    await prisma.user.count();
    dbVibedeskSuccess = true;
  } catch (e: any) {
    dbVibedeskError = e.message || String(e);
  }

  // Test 2: Connection to system 'mysql' database (to check if credentials work)
  let dbSystemSuccess = false;
  let dbSystemError = null;
  if (dbUrl) {
    try {
      // Replace '/vibedesk?' with '/mysql?' in connection string
      const systemDbUrl = dbUrl.replace(/\/vibedesk(\?|$)/, '/mysql$1');
      const tempPrisma = new PrismaClient({
        datasources: {
          db: { url: systemDbUrl }
        }
      });
      // Execute a raw query to check connectivity
      await tempPrisma.$queryRaw`SELECT 1`;
      dbSystemSuccess = true;
      await tempPrisma.$disconnect();
    } catch (e: any) {
      dbSystemError = e.message || String(e);
    }
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
      testVibedeskDb: {
        success: dbVibedeskSuccess,
        error: dbVibedeskError,
      },
      testSystemDb: {
        success: dbSystemSuccess,
        error: dbSystemError,
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
