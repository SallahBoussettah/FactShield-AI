import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { urlFetchingService, UrlFetchOptions } from '../services/urlFetchingService';
import { documentProcessingService } from '../services/documentProcessingService';
import { claimExtractionService } from '../services/claimExtractionService';
import { factCheckingService } from '../services/factCheckingService';
import { translationService } from '../services/translationService';
import { logger } from '../utils/logger';

// Temporary interfaces for analysis results (will be expanded in later tasks)
interface Claim {
  id: string;
  text: string;
  confidence: number;
  credibilityScore: number;
  sources: Source[];
}

interface Source {
  url: string;
  title: string;
  reliability: number;
}

interface AnalysisResult {
  id: string;
  fileName: string;
  claims: Claim[];
  summary: string;
}

/**
 * Analyze content from URL
 * POST /api/analyze/url
 */
export const analyzeUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: errors.array()
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const { url, options = {} } = req.body;
    const userId = (req as any).user?.id; // From auth middleware

    logger.info(`URL analysis request from user ${userId || 'anonymous'}: ${url}`);

    // Configure fetch options
    const fetchOptions: UrlFetchOptions = {
      timeout: options.timeout || 30000,
      followRedirects: options.followRedirects !== false,
      maxRedirects: options.maxRedirects || 5,
      maxContentLength: 10 * 1024 * 1024 // 10MB limit
    };

    // Fetch and parse URL content
    const urlContent = await urlFetchingService.fetchAndParseUrl(url, fetchOptions);

    // Prepare text for analysis (translate if needed)
    const preparedText = await translationService.prepareTextForAnalysis(urlContent.extractedText);

    // Extract claims from the content
    const claimExtractionResult = await claimExtractionService.extractClaims(
      preparedText.processedText,
      {
        maxClaims: options.maxClaims || 10,
        minConfidence: options.minConfidence || 0.6,
        includeOpinions: options.includeOpinions || false
      }
    );

    // Fact-check the extracted claims
    const factCheckResults = await factCheckingService.factCheckClaims(
      claimExtractionResult.claims,
      {
        maxSources: options.maxSources || 3,
        minSourceReliability: options.minSourceReliability || 0.6
      }
    );

    // Convert to the expected format
    const claims: Claim[] = factCheckResults.map(result => ({
      id: result.claimId,
      text: result.originalClaim,
      confidence: claimExtractionResult.claims.find(c => c.id === result.claimId)?.confidence || 0.5,
      credibilityScore: result.credibilityScore,
      sources: result.sources.map(source => ({
        url: source.url,
        title: source.title,
        reliability: source.reliability
      }))
    }));

    const analysisResult: AnalysisResult = {
      id: Date.now().toString(),
      fileName: `Analysis of ${urlContent.url}`,
      claims: claims,
      summary: `Successfully analyzed content from ${urlContent.url}. Extracted ${urlContent.extractedText.length} characters and found ${claims.length} claims for fact-checking.`
    };

    // Prepare response
    const response = {
      success: true,
      data: {
        analysisId: analysisResult.id,
        url: urlContent.url,
        title: urlContent.title,
        extractedText: urlContent.extractedText.substring(0, 1000) + '...', // Truncate for response
        metadata: {
          author: urlContent.metadata.author,
          publishDate: urlContent.metadata.publishDate,
          domain: urlContent.metadata.domain,
          wordCount: urlContent.metadata.wordCount,
          language: urlContent.metadata.language,
          originalLanguage: preparedText.originalLanguage,
          wasTranslated: preparedText.wasTranslated,
          translationConfidence: preparedText.translationConfidence
        },
        claims: analysisResult.claims,
        summary: analysisResult.summary,
        processingTime: claimExtractionResult.processingTime
      },
      message: 'URL analysis completed successfully'
    };

    logger.info(`URL analysis completed for ${url}: ${urlContent.extractedText.length} characters extracted`);
    res.status(200).json(response);

  } catch (error) {
    logger.error('URL analysis error:', error);

    // Handle specific error types
    let errorCode = 'PROCESSING_FAILED';
    let statusCode = 500;
    let errorMessage = 'Failed to analyze URL';

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('Invalid URL') || error.message.includes('URL must use')) {
        errorCode = 'INVALID_URL';
        statusCode = 400;
      } else if (error.message.includes('timeout') || error.message.includes('took too long')) {
        errorCode = 'REQUEST_TIMEOUT';
        statusCode = 408;
      } else if (error.message.includes('Network error') || error.message.includes('unable to reach')) {
        errorCode = 'NETWORK_ERROR';
        statusCode = 502;
      } else if (error.message.includes('HTTP 4')) {
        errorCode = 'URL_NOT_ACCESSIBLE';
        statusCode = 400;
      } else if (error.message.includes('Insufficient content')) {
        errorCode = 'INSUFFICIENT_CONTENT';
        statusCode = 400;
      }
    }

    res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Check URL accessibility
 * POST /api/analyze/url/check
 */
export const checkUrlAccessibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: errors.array()
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const { url } = req.body;
    
    logger.info(`URL accessibility check: ${url}`);

    const result = await urlFetchingService.checkUrlAccessibility(url);

    res.status(200).json({
      success: true,
      data: {
        url,
        accessible: result.accessible,
        status: result.status,
        error: result.error
      },
      message: result.accessible ? 'URL is accessible' : 'URL is not accessible'
    });

  } catch (error) {
    logger.error('URL accessibility check error:', error);

    res.status(500).json({
      success: false,
      error: {
        code: 'CHECK_FAILED',
        message: 'Failed to check URL accessibility',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Analyze raw text content
 * POST /api/analyze/text
 */
export const analyzeText = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: errors.array()
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const { text, source, options = {} } = req.body;
    const userId = (req as any).user?.id;

    logger.info(`Text analysis request from user ${userId || 'anonymous'}: ${text.length} characters`);

    // Basic text validation
    if (text.length < 50) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_CONTENT',
          message: 'Text must be at least 50 characters long'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (text.length > 50000) {
      res.status(400).json({
        success: false,
        error: {
          code: 'TEXT_TOO_LONG',
          message: 'Text must be less than 50,000 characters'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Prepare text for analysis (translate if needed)
    const preparedText = await translationService.prepareTextForAnalysis(text);

    // Extract claims from the text
    const claimExtractionResult = await claimExtractionService.extractClaims(preparedText.processedText, {
      maxClaims: options.maxClaims || 10,
      minConfidence: options.minConfidence || 0.6,
      includeOpinions: options.includeOpinions || false,
      language: options.language || preparedText.originalLanguage
    });

    // Fact-check the extracted claims
    const factCheckResults = await factCheckingService.factCheckClaims(
      claimExtractionResult.claims,
      {
        maxSources: options.maxSources || 3,
        minSourceReliability: options.minSourceReliability || 0.6
      }
    );

    // Convert to the expected format
    const claims: Claim[] = factCheckResults.map(result => ({
      id: result.claimId,
      text: result.originalClaim,
      confidence: claimExtractionResult.claims.find(c => c.id === result.claimId)?.confidence || 0.5,
      credibilityScore: result.credibilityScore,
      sources: result.sources.map(source => ({
        url: source.url,
        title: source.title,
        reliability: source.reliability
      }))
    }));

    const analysisResult: AnalysisResult = {
      id: Date.now().toString(),
      fileName: source || 'Text Analysis',
      claims: claims,
      summary: `Successfully analyzed ${text.length} characters of text. Found ${claims.length} claims for fact-checking.`
    };

    const response = {
      success: true,
      data: {
        analysisId: analysisResult.id,
        textLength: text.length,
        claims: analysisResult.claims,
        summary: analysisResult.summary,
        processingTime: claimExtractionResult.processingTime,
        originalLanguage: preparedText.originalLanguage,
        wasTranslated: preparedText.wasTranslated,
        translationConfidence: preparedText.translationConfidence
      },
      message: 'Text analysis completed successfully'
    };

    logger.info(`Text analysis completed: ${text.length} characters processed`);
    res.status(200).json(response);

  } catch (error) {
    logger.error('Text analysis error:', error);

    res.status(500).json({
      success: false,
      error: {
        code: 'PROCESSING_FAILED',
        message: 'Failed to analyze text content',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Analyze uploaded document
 * POST /api/analyze/document
 */
export const analyzeDocument = async (req: Request, res: Response): Promise<void> => {
  let tempFilePath: string | null = null;
  
  try {
    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE_UPLOADED',
          message: 'No file was uploaded'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const file = req.file;
    const userId = (req as any).user?.id;
    const options = req.body.options ? JSON.parse(req.body.options) : {};

    logger.info(`Document analysis request from user ${userId || 'anonymous'}: ${file.originalname} (${file.size} bytes)`);

    tempFilePath = file.path;

    // Check if file type is supported
    if (!documentProcessingService.isFileTypeSupported(file.mimetype, file.originalname)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'UNSUPPORTED_FILE_TYPE',
          message: `Unsupported file type: ${file.mimetype}. Supported types: PDF, TXT, DOC, DOCX, CSV, RTF`
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Process the document
    const processedDocument = await documentProcessingService.processDocument(
      file.path,
      file.originalname,
      file.mimetype,
      file.size,
      options
    );

    // Prepare text for analysis (translate if needed)
    const preparedText = await translationService.prepareTextForAnalysis(processedDocument.extractedText);

    // Extract claims from the document content
    const claimExtractionResult = await claimExtractionService.extractClaims(
      preparedText.processedText,
      {
        maxClaims: options.maxClaims || 10,
        minConfidence: options.minConfidence || 0.6,
        includeOpinions: options.includeOpinions || false,
        language: processedDocument.metadata.language || preparedText.originalLanguage
      }
    );

    // Fact-check the extracted claims
    const factCheckResults = await factCheckingService.factCheckClaims(
      claimExtractionResult.claims,
      {
        maxSources: options.maxSources || 3,
        minSourceReliability: options.minSourceReliability || 0.6
      }
    );

    // Convert to the expected format
    const claims: Claim[] = factCheckResults.map(result => ({
      id: result.claimId,
      text: result.originalClaim,
      confidence: claimExtractionResult.claims.find(c => c.id === result.claimId)?.confidence || 0.5,
      credibilityScore: result.credibilityScore,
      sources: result.sources.map(source => ({
        url: source.url,
        title: source.title,
        reliability: source.reliability
      }))
    }));

    const analysisResult: AnalysisResult = {
      id: processedDocument.id,
      fileName: processedDocument.fileName,
      claims: claims,
      summary: `Successfully processed and analyzed document "${processedDocument.fileName}". Extracted ${processedDocument.metadata.wordCount} words and found ${claims.length} claims for fact-checking.`
    };

    const response = {
      success: true,
      data: {
        analysisId: analysisResult.id,
        fileName: processedDocument.fileName,
        fileSize: processedDocument.metadata.fileSize,
        fileType: processedDocument.metadata.fileType,
        status: 'completed',
        extractedText: processedDocument.extractedText.substring(0, 1000) + '...', // Truncate for response
        claims: analysisResult.claims,
        summary: analysisResult.summary,
        processingTime: processedDocument.processingTime + claimExtractionResult.processingTime,
        metadata: {
          wordCount: processedDocument.metadata.wordCount,
          characterCount: processedDocument.metadata.characterCount,
          pageCount: processedDocument.metadata.pageCount,
          language: processedDocument.metadata.language,
          author: processedDocument.metadata.author,
          title: processedDocument.metadata.title,
          originalLanguage: preparedText.originalLanguage,
          wasTranslated: preparedText.wasTranslated,
          translationConfidence: preparedText.translationConfidence
        }
      },
      message: 'Document analysis completed successfully'
    };

    logger.info(`Document analysis completed for ${file.originalname}: ${processedDocument.metadata.wordCount} words extracted in ${processedDocument.processingTime}ms`);
    res.status(200).json(response);

  } catch (error) {
    logger.error('Document analysis error:', error);

    // Handle specific error types
    let errorCode = 'PROCESSING_FAILED';
    let statusCode = 500;
    let errorMessage = 'Failed to analyze document';

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('File size exceeds')) {
        errorCode = 'FILE_TOO_LARGE';
        statusCode = 400;
      } else if (error.message.includes('Unsupported file')) {
        errorCode = 'UNSUPPORTED_FILE_TYPE';
        statusCode = 400;
      } else if (error.message.includes('Insufficient text content')) {
        errorCode = 'INSUFFICIENT_CONTENT';
        statusCode = 400;
      } else if (error.message.includes('File not found')) {
        errorCode = 'FILE_NOT_FOUND';
        statusCode = 400;
      }
    }

    res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      timestamp: new Date().toISOString()
    });
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      await documentProcessingService.cleanupFile(tempFilePath);
    }
  }
};

/**
 * Translate text
 * POST /api/analyze/translate
 */
export const translateText = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: errors.array()
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const { text, targetLanguage = 'en', detectLanguage = true } = req.body;
    const userId = (req as any).user?.id;

    logger.info(`Translation request from user ${userId || 'anonymous'}: ${text.length} characters to ${targetLanguage}`);

    // Validate text length
    if (text.length > 10000) {
      res.status(400).json({
        success: false,
        error: {
          code: 'TEXT_TOO_LONG',
          message: 'Text must be less than 10,000 characters for translation'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Perform translation
    const result = await translationService.translateText(text, {
      targetLanguage,
      detectLanguage
    });

    const response = {
      success: true,
      data: {
        originalText: result.originalText,
        translatedText: result.translatedText,
        sourceLanguage: result.sourceLanguage,
        targetLanguage: result.targetLanguage,
        confidence: result.confidence,
        processingTime: result.processingTime
      },
      message: 'Translation completed successfully'
    };

    logger.info(`Translation completed: ${result.sourceLanguage} -> ${result.targetLanguage} in ${result.processingTime}ms`);
    res.status(200).json(response);

  } catch (error) {
    logger.error('Translation error:', error);

    res.status(500).json({
      success: false,
      error: {
        code: 'TRANSLATION_FAILED',
        message: 'Failed to translate text',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Detect language of text
 * POST /api/analyze/detect-language
 */
export const detectLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: errors.array()
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const { text } = req.body;
    const userId = (req as any).user?.id;

    logger.info(`Language detection request from user ${userId || 'anonymous'}: ${text.length} characters`);

    // Detect language
    const result = await translationService.detectLanguage(text);

    const response = {
      success: true,
      data: {
        language: result.language,
        languageName: translationService.getLanguageName(result.language),
        confidence: result.confidence,
        alternatives: result.alternatives.map(alt => ({
          language: alt.language,
          languageName: translationService.getLanguageName(alt.language),
          confidence: alt.confidence
        }))
      },
      message: 'Language detection completed successfully'
    };

    logger.info(`Language detected: ${result.language} (confidence: ${result.confidence})`);
    res.status(200).json(response);

  } catch (error) {
    logger.error('Language detection error:', error);

    res.status(500).json({
      success: false,
      error: {
        code: 'DETECTION_FAILED',
        message: 'Failed to detect language',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      timestamp: new Date().toISOString()
    });
  }
};