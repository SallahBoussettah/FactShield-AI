import { body, ValidationChain } from 'express-validator';

/**
 * Email validation
 */
export const validateEmail = (): ValidationChain => {
  return body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters');
};

/**
 * Password validation
 */
export const validatePassword = (): ValidationChain => {
  return body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');
};

/**
 * Name validation
 */
export const validateName = (): ValidationChain => {
  return body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes');
};

/**
 * Registration validation rules
 */
export const validateRegistration = (): ValidationChain[] => {
  return [
    validateName(),
    validateEmail(),
    validatePassword()
  ];
};

/**
 * Login validation rules
 */
export const validateLogin = (): ValidationChain[] => {
  return [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    body('rememberMe')
      .optional()
      .isBoolean()
      .withMessage('Remember me must be a boolean value')
  ];
};

/**
 * Forgot password validation rules
 */
export const validateForgotPassword = (): ValidationChain[] => {
  return [
    validateEmail()
  ];
};

/**
 * UUID validation
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .trim();
};

/**
 * Validate roles array
 */
export const validateRoles = (roles: string[]): boolean => {
  const validRoles = ['user', 'admin', 'moderator'];
  return Array.isArray(roles) && roles.every(role => validRoles.includes(role));
};