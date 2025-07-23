import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, isTokenBlacklisted } from '../utils/jwt';
import { UserModel } from '../models/User';
import { logger } from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        roles: string[];
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and adds user info to request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Check if token is blacklisted
    if (await isTokenBlacklisted(decoded.jti)) {
      res.status(401).json({
        success: false,
        message: 'Token has been revoked'
      });
      return;
    }

    // Get user from database to ensure they still exist and are active
    const user = await UserModel.findById(decoded.sub);
    
    if (!user || !user.is_active) {
      res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
      return;
    }

    // Add user info to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Optional authentication middleware
 * Adds user info to request if token is provided and valid, but doesn't require it
 */
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      next();
      return;
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Check if token is blacklisted
    if (await isTokenBlacklisted(decoded.jti)) {
      next();
      return;
    }

    // Get user from database
    const user = await UserModel.findById(decoded.sub);
    
    if (user && user.is_active) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles
      };
    }

    next();
  } catch (error) {
    // Don't fail on optional authentication errors
    logger.warn('Optional authentication failed:', error);
    next();
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (requiredRoles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const userRoles = req.user.roles;
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // Check if user has any of the required roles
    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

/**
 * Admin authorization middleware
 */
export const requireAdmin = authorize('admin');

/**
 * User or admin authorization middleware
 */
export const requireUserOrAdmin = authorize(['user', 'admin']);