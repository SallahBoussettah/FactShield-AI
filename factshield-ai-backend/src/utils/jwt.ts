import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { logger } from './logger';
import { query } from '../config/database';

export interface JWTPayload {
  sub: string; // User ID
  email: string;
  name: string;
  roles: string[];
  iat: number;
  exp: number;
  jti: string; // JWT ID for blacklisting
}

/**
 * Generate JWT token for user
 */
export const generateToken = (user: Omit<User, 'password_hash'>, rememberMe = false): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  // Token expires in 1 hour by default, 30 days if remember me is checked
  const expiresIn = rememberMe ? '30d' : '1h';
  
  // Generate unique JWT ID for blacklisting
  const jti = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    sub: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    jti
  };

  return jwt.sign(payload, secret, { 
    expiresIn,
    issuer: 'factshield-ai',
    audience: 'factshield-ai-users'
  });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'factshield-ai',
      audience: 'factshield-ai-users'
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    logger.error('JWT verification failed:', error);
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): number => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    throw new Error('Invalid token format');
  }
};

/**
 * Check if token is blacklisted
 */
export const isTokenBlacklisted = async (jti: string): Promise<boolean> => {
  try {
    const result = await query(
      'SELECT id FROM token_blacklist WHERE token_jti = $1 AND expires_at > NOW()',
      [jti]
    ) as any;

    return result.rows && result.rows.length > 0;
  } catch (error) {
    logger.error('Error checking token blacklist:', error);
    return false; // Assume not blacklisted on error
  }
};

/**
 * Add token to blacklist
 */
export const blacklistToken = async (jti: string, expiresAt: Date): Promise<void> => {
  try {
    await query(
      'INSERT INTO token_blacklist (token_jti, expires_at) VALUES ($1, $2) ON CONFLICT (token_jti) DO NOTHING',
      [jti, expiresAt]
    );
    
    logger.info(`Token blacklisted: ${jti}`);
  } catch (error) {
    logger.error('Error blacklisting token:', error);
    throw error;
  }
};

/**
 * Clean up expired blacklisted tokens
 */
export const cleanupExpiredTokens = async (): Promise<void> => {
  try {
    const result = await query(
      'DELETE FROM token_blacklist WHERE expires_at <= NOW()'
    ) as any;
    
    if (result.rowCount > 0) {
      logger.info(`Cleaned up ${result.rowCount} expired blacklisted tokens`);
    }
  } catch (error) {
    logger.error('Error cleaning up expired tokens:', error);
  }
};

/**
 * Refresh token (generate new token with same user data)
 */
export const refreshToken = async (oldToken: string): Promise<string> => {
  try {
    const decoded = verifyToken(oldToken);
    
    // Check if token is blacklisted
    if (await isTokenBlacklisted(decoded.jti)) {
      throw new Error('Token has been revoked');
    }

    // Get fresh user data from database
    const { UserModel } = await import('../models/User');
    const user = await UserModel.findById(decoded.sub);
    
    if (!user || !user.is_active) {
      throw new Error('User not found or inactive');
    }

    // Blacklist the old token
    await blacklistToken(decoded.jti, new Date(decoded.exp * 1000));

    // Generate new token
    const safeUser = UserModel.toSafeUser(user);
    return generateToken(safeUser);
    
  } catch (error) {
    logger.error('Token refresh failed:', error);
    throw error;
  }
};