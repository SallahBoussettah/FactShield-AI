import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/User';
import { generateToken, verifyToken, blacklistToken, refreshToken as refreshJWT } from '../utils/jwt';
import { logger } from '../utils/logger';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
      return;
    }

    // Create new user
    const user = await UserModel.create({
      name,
      email,
      password,
      roles: ['user'] // Default role
    });

    // Generate JWT token
    const safeUser = UserModel.toSafeUser(user);
    const token = generateToken(safeUser);

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: safeUser,
        token,
        expiresAt: Date.now() + 3600000 // 1 hour from now
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email, password, rememberMe = false } = req.body;

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Check if user is active
    if (!user.is_active) {
      res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await UserModel.comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Update last login timestamp
    await UserModel.updateLastLogin(user.id);

    // Generate JWT token
    const safeUser = UserModel.toSafeUser(user);
    const token = generateToken(safeUser, rememberMe);

    // Calculate expiration time
    const expiresAt = rememberMe 
      ? Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      : Date.now() + (60 * 60 * 1000); // 1 hour

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: safeUser,
        token,
        expiresAt
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

/**
 * Refresh JWT token
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }

    // Refresh the token
    const newToken = await refreshJWT(token);
    
    // Get user info from the new token
    const decoded = verifyToken(newToken);
    const user = await UserModel.findById(decoded.sub);
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const safeUser = UserModel.toSafeUser(user);

    logger.info(`Token refreshed for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: safeUser,
        token: newToken,
        expiresAt: Date.now() + 3600000 // 1 hour from now
      }
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
};

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }

    // Verify and decode token to get JTI
    const decoded = verifyToken(token);
    
    // Add token to blacklist
    await blacklistToken(decoded.jti, new Date(decoded.exp * 1000));

    logger.info(`User logged out: ${decoded.email}`);

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
};

/**
 * Forgot password
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email } = req.body;

    // Check if user exists
    const user = await UserModel.findByEmail(email);
    
    // Always return success to prevent email enumeration
    // In a real implementation, you would send a password reset email here
    logger.info(`Password reset requested for: ${email}`);
    
    // TODO: Implement email sending functionality
    // - Generate password reset token
    // - Store token in database with expiration
    // - Send email with reset link
    
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, password reset instructions have been sent'
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password reset request'
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Get fresh user data from database
    const user = await UserModel.findById(req.user.id);
    
    if (!user || !user.is_active) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const safeUser = UserModel.toSafeUser(user);

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: safeUser
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving profile'
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { name, email } = req.body;
    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) {
      // Check if email is already taken by another user
      if (await UserModel.emailExists(email, req.user.id)) {
        res.status(409).json({
          success: false,
          message: 'Email is already taken'
        });
        return;
      }
      updateData.email = email;
    }

    // Update user
    const updatedUser = await UserModel.update(req.user.id, updateData);
    
    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const safeUser = UserModel.toSafeUser(updatedUser);

    logger.info(`Profile updated for user: ${updatedUser.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: safeUser
      }
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile'
    });
  }
};