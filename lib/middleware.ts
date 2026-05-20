import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, hasPermission } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Extract token from request
 */
export function extractToken(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Check cookies
  const tokenCookie = request.cookies.get('token');
  if (tokenCookie?.value) {
    return tokenCookie.value;
  }

  return null;
}

/**
 * Authenticate API request
 */
export function authenticateRequest(request: NextRequest) {
  const token = extractToken(request);

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  return payload;
}

/**
 * Middleware for protected API routes
 */
export async function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = authenticateRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const authRequest = request as AuthenticatedRequest;
    authRequest.user = user;

    return handler(authRequest);
  };
}

/**
 * Middleware for role-based API routes
 */
export async function withRoleAuth(
  requiredRole: string,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = authenticateRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.role, requiredRole)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const authRequest = request as AuthenticatedRequest;
    authRequest.user = user;

    return handler(authRequest);
  };
}
