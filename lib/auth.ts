import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Hash password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * Compare plain password with hashed password
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(plainPassword, hashedPassword);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Hardcoded admin credentials (permanent fallback - always works)
const STATIC_USERS = [
  {
    id: '1',
    email: 'admin@fitrahpro.com',
    password: 'FitrahPro@2026',
    name: 'Admin User',
    role: 'SUPER_ADMIN',
    department: 'Management',
    phoneNumber: '+62812345678',
    isActive: true,
  },
];

/**
 * Authenticate user with email and password.
 * Checks static/hardcoded credentials first (always available),
 * then falls back to Prisma database if not matched.
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: any; token: string } | null> {
  // 1. Check static credentials first (fast, always works, no DB needed)
  const staticUser = STATIC_USERS.find(u => u.email === email);
  if (staticUser) {
    if (password !== staticUser.password) {
      return null;
    }
    if (!staticUser.isActive) {
      return null;
    }
    const token = generateToken({
      userId: staticUser.id,
      email: staticUser.email,
      role: staticUser.role,
    });
    const { password: _, ...userWithoutPassword } = staticUser;
    return { user: userWithoutPassword, token };
  }

  // 2. Fall back to Prisma database for other users
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      return null;
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.error('Authentication error (DB):', error);
    return null;
  }
}


/**
 * Create new user in the database
 */
export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  role?: string;
  department?: string;
  phoneNumber?: string;
}) {
  try {
    const hashedPassword = await bcryptjs.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: (data.role || 'VIEWER') as any,
        department: data.department || '',
        phoneNumber: data.phoneNumber || '',
        isActive: true,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    console.error('User creation error:', error);
    throw error;
  }
}

/**
 * Verify admin role
 */
export function isAdmin(role: string): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}

/**
 * Verify manager role
 */
export function isManager(role: string): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'MANAGER';
}

/**
 * Check role permissions
 */
export function hasPermission(
  userRole: string,
  requiredRole: string
): boolean {
  const roleHierarchy: Record<string, number> = {
    SUPER_ADMIN: 5,
    ADMIN: 4,
    MANAGER: 3,
    CONTRACTOR: 2,
    VIEWER: 1,
  };

  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
}

/**
 * Log audit trail (mock version)
 */
export async function logAudit(data: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    console.log('[AUDIT]', data);
  } catch (error) {
    console.error('Audit logging error:', error);
  }
}
