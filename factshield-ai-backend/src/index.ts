import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import multer from 'multer';

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { logger } from './utils/logger';
import { connectDatabase } from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173' // Vite default port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import routes
import authRoutes from './routes/auth';
import analysisRoutes from './routes/analysis';

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analysisRoutes);

app.get('/api', (req, res) => {
  res.json({
    message: 'FactShield AI Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      analyze: '/api/analyze'
    }
  });
});

// Multer error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: 'File size exceeds 10MB limit'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({
        success: false,
        error: {
          code: 'TOO_MANY_FILES',
          message: 'Only one file allowed per request'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      res.status(400).json({
        success: false,
        error: {
          code: 'UNEXPECTED_FILE',
          message: 'Unexpected file field'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }
  }
  
  if (error.message && error.message.includes('Unsupported file type')) {
    res.status(400).json({
      success: false,
      error: {
        code: 'UNSUPPORTED_FILE_TYPE',
        message: error.message
      },
      timestamp: new Date().toISOString()
    });
    return;
  }
  
  next(error);
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    app.listen(PORT, () => {
      logger.info(`🚀 FactShield AI Backend server running on port ${PORT}`);
      logger.info(`📊 Health check available at http://localhost:${PORT}/health`);
      logger.info(`🔗 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();

export default app;