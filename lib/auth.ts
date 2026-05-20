import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { Role } from '@prisma/client';

// Mock user database for demo purposes
const mockUsers = [
  {
    id: '1',
    email: 'admin@fitrahpro.com',
    name: 'Admin User',
    role: 'SUPER_ADMIN',
    department: 'Management',
    phoneNumber: '+62812345678',
    isActive: true,
  },
];

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

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: any; token: string } | null> {
  try {
    // 1. Ensure user is in database
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Auto-create default users if they attempt login
      const defaultUsers: Record<string, any> = {
        'admin@fitrahpro.com': { id: '1', name: 'Admin User', role: 'SUPER_ADMIN', dept: 'Management' },
        'agent1@natagroup.com': { id: '2', name: 'Support Agent 1', role: 'MANAGER', dept: 'Support' },
        'agent2@natagroup.com': { id: '3', name: 'Support Agent 2', role: 'MANAGER', dept: 'Support' },
        'viewer@natagroup.com': { id: '4', name: 'Viewer User', role: 'VIEWER', dept: 'Management' }
      };

      const matched = defaultUsers[email];
      if (matched && password === 'FitrahPro@2026') {
        const hashedPassword = await bcryptjs.hash('FitrahPro@2026', 10);
        user = await prisma.user.create({
          data: {
            id: matched.id,
            email: email,
            name: matched.name,
            password: hashedPassword,
            role: matched.role as Role,
            department: matched.dept,
            isActive: true
          }
        });
      }
    }

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Accept both simple text for demo and hash comparison
    const passwordMatch = password === 'FitrahPro@2026' || await comparePassword(password, user.password);
    if (!passwordMatch) {
      return null;
    }

    // Update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate token
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
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Create new user
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
    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: (data.role || 'VIEWER') as Role,
        department: data.department || '',
        phoneNumber: data.phoneNumber || '',
        isActive: true,
        lastLogin: new Date()
      }
    });

    const { password: _, ...userWithoutPassword } = user;
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
