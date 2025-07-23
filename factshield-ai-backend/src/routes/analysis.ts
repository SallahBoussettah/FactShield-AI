import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import {
  analyzeUrl,
  checkUrlAccessibility,
  analyzeText,
  analyzeDocument,
  translateText,
  detectLanguage
} from '../controllers/analysisController';
import { optionalAuthenticate } from '../middleware/auth';
import {
  validateUrlAnalysis,
  validateTextAnalysis,
  validateUrlCheck,
  validateTranslation,
  validateLanguageDetection
} from '../utils/validation';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use uploads directory
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only allow 1 file per request
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedMimeTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'application/rtf'
    ];
    
    const allowedExtensions = ['.pdf', '.txt', '.doc', '.docx', '.csv', '.rtf'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed types: PDF, TXT, DOC, DOCX, CSV, RTF`));
    }
  }
});

// Rate limiting for analysis endpoints
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    // Different limits based on authentication
    const user = (req as any).user;
    if (user) {
      return user.role === 'premium' ? 1000 : 100; // Premium users get higher limits
    }
    return 10; // Anonymous users get lower limits
  },
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many analysis requests. Please try again later or upgrade your account for higher limits.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID for authenticated users, IP for anonymous
    const user = (req as any).user;
    return user ? `user:${user.id}` : `ip:${req.ip}`;
  }
});

// Stricter rate limiting for URL accessibility checks
const urlCheckLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 checks per 15 minutes
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many URL check requests. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route   POST /api/analyze/url
 * @desc    Analyze content from URL
 * @access  Public (with rate limiting)
 */
router.post('/url', 
  analysisLimiter, 
  optionalAuthenticate, // Optional authentication
  validateUrlAnalysis(), 
  analyzeUrl
);

/**
 * @route   POST /api/analyze/url/check
 * @desc    Check URL accessibility without full analysis
 * @access  Public (with rate limiting)
 */
router.post('/url/check', 
  urlCheckLimiter, 
  validateUrlCheck(), 
  checkUrlAccessibility
);

/**
 * @route   POST /api/analyze/text
 * @desc    Analyze raw text content
 * @access  Public (with rate limiting)
 */
router.post('/text', 
  analysisLimiter, 
  optionalAuthenticate, // Optional authentication
  validateTextAnalysis(), 
  analyzeText
);

/**
 * @route   POST /api/analyze/document
 * @desc    Upload and analyze document
 * @access  Public (with rate limiting)
 */
router.post('/document', 
  analysisLimiter,
  optionalAuthenticate, // Optional authentication
  upload.single('file'), // Handle file upload
  analyzeDocument
);

/**
 * @route   POST /api/analyze/translate
 * @desc    Translate text
 * @access  Public (with rate limiting)
 */
router.post('/translate',
  analysisLimiter,
  optionalAuthenticate, // Optional authentication
  validateTranslation(),
  translateText
);

/**
 * @route   POST /api/analyze/detect-language
 * @desc    Detect language of text
 * @access  Public (with rate limiting)
 */
router.post('/detect-language',
  analysisLimiter,
  optionalAuthenticate, // Optional authentication
  validateLanguageDetection(),
  detectLanguage
);

export default router;