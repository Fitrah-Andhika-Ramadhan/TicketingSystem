import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock user database for demo purposes
const mockUsers = [
  {
    id: '1',
    email: 'fitrahramdhan31@gmail.com',
    password: '$2a$10$Y9HS7OMm7hxNwI5Z0K9v.uJZz5K5K5K5K5K5K5K5K5K5K5K5K5K5K', // NataGroup@2024 hashed
    name: 'Admin User',
    role: 'SUPER_ADMIN',
    department: 'Management',
    phoneNumber: '+62812345678',
    isActive: true,
    lastLogin: new Date(),
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
    // Find user in mock database
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // For demo, accept the password as-is
    // In production, you'd verify against hashed password
    if (password !== 'NataGroup@2024') {
      return null;
    }

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
 * Create new user (mock version)
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
    const newUser = {
      id: String(Date.now()),
      email: data.email,
      name: data.name,
      password: data.password,
      role: data.role || 'VIEWER',
      department: data.department || '',
      phoneNumber: data.phoneNumber || '',
      isActive: true,
      lastLogin: new Date(),
    };

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
