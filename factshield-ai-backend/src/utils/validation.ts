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

/**
 * Validation rules for URL analysis
 */
export const validateUrlAnalysis = (): ValidationChain[] => [
  body('url')
    .isURL({
      protocols: ['http', 'https'],
      require_protocol: true,
      require_host: true,
      require_valid_protocol: true
    })
    .withMessage('Please provide a valid HTTP or HTTPS URL')
    .isLength({ max: 2048 })
    .withMessage('URL must be less than 2048 characters'),
  
  body('options.timeout')
    .optional()
    .isInt({ min: 5000, max: 60000 })
    .withMessage('Timeout must be between 5000 and 60000 milliseconds'),
  
  body('options.followRedirects')
    .optional()
    .isBoolean()
    .withMessage('followRedirects must be a boolean'),
  
  body('options.maxRedirects')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('maxRedirects must be between 0 and 10'),
  
  body('options.maxClaims')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('maxClaims must be between 1 and 50'),
  
  body('options.minConfidence')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('minConfidence must be between 0 and 1'),
  
  body('options.includeOpinions')
    .optional()
    .isBoolean()
    .withMessage('includeOpinions must be a boolean'),
  
  body('options.maxSources')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('maxSources must be between 1 and 10'),
  
  body('options.minSourceReliability')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('minSourceReliability must be between 0 and 1')
];

/**
 * Validation rules for text analysis
 */
export const validateTextAnalysis = (): ValidationChain[] => [
  body('text')
    .isString()
    .withMessage('Text must be a string')
    .isLength({ min: 50, max: 50000 })
    .withMessage('Text must be between 50 and 50,000 characters')
    .trim(),
  
  body('source')
    .optional()
    .isString()
    .isLength({ max: 200 })
    .withMessage('Source must be less than 200 characters')
    .trim(),
  
  body('options.extractClaims')
    .optional()
    .isBoolean()
    .withMessage('extractClaims must be a boolean'),
  
  body('options.checkCredibility')
    .optional()
    .isBoolean()
    .withMessage('checkCredibility must be a boolean'),
  
  body('options.language')
    .optional()
    .isString()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language must be a valid language code'),
  
  body('options.maxClaims')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('maxClaims must be between 1 and 50'),
  
  body('options.minConfidence')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('minConfidence must be between 0 and 1'),
  
  body('options.includeOpinions')
    .optional()
    .isBoolean()
    .withMessage('includeOpinions must be a boolean'),
  
  body('options.maxSources')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('maxSources must be between 1 and 10'),
  
  body('options.minSourceReliability')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('minSourceReliability must be between 0 and 1')
];

/**
 * Validation rules for URL accessibility check
 */
export const validateUrlCheck = (): ValidationChain[] => [
  body('url')
    .isURL({
      protocols: ['http', 'https'],
      require_protocol: true,
      require_host: true,
      require_valid_protocol: true
    })
    .withMessage('Please provide a valid HTTP or HTTPS URL')
    .isLength({ max: 2048 })
    .withMessage('URL must be less than 2048 characters')
];

/**
 * Validation rules for text translation
 */
export const validateTranslation = (): ValidationChain[] => [
  body('text')
    .isString()
    .withMessage('Text must be a string')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Text must be between 1 and 10,000 characters')
    .trim(),
  
  body('targetLanguage')
    .optional()
    .isString()
    .isLength({ min: 2, max: 5 })
    .withMessage('Target language must be a valid language code'),
  
  body('detectLanguage')
    .optional()
    .isBoolean()
    .withMessage('detectLanguage must be a boolean')
];

/**
 * Validation rules for language detection
 */
export const validateLanguageDetection = (): ValidationChain[] => [
  body('text')
    .isString()
    .withMessage('Text must be a string')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Text must be between 10 and 5,000 characters for language detection')
    .trim()
];