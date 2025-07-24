import { Request, Response } from 'express';
import { claimExtractionService } from '../services/claimExtractionService';
import { factCheckingService } from '../services/factCheckingService';
import { urlFetchingService } from '../services/urlFetchingService';
import { translationService } from '../services/translationService';
import { analysisOrchestrator } from '../services/analysisOrchestrator';
import { logger } from '../utils/logger';

// Types for API requests and responses
export interface UrlAnalysisRequest {
  url: string;
  options?: {
    timeout?: number;
    followRedirects?: boolean;
    maxRedirects?: number;
    maxClaims?: number;
    minConfidence?: number;
    includeOpinions?: boolean;
    maxSources?: number;
    minSourceReliability?: number;
  };
}

export interface TextAnalysisRequest {
  text: string;
  source?: string;
  options?: {
    maxClaims?: number;
    minConfidence?: number;
    includeOpinions?: boolean;
    language?: string;
    maxSources?: number;
    minSourceReliability?: number;
  };
}

export interface DocumentAnalysisOptions {
  maxClaims?: number;
  minConfidence?: number;
  includeOpinions?: boolean;
  maxSources?: number;
  minSourceReliability?: number;
}

export interface TranslationRequest {
  text: string;
  targetLanguage?: string;
  detectLanguage?: boolean;
}

export interface LanguageDetectionRequest {
  text: string;
}

// Response types
export interface Claim {
  id: string;
  text: string;
  confidence: number;
  credibilityScore: number;
  sources: Array<{
    url: string;
    title: string;
    reliability: number;
  }>;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  claims: Claim[];
  summary: string;
}

export interface UrlAnalysisResponse {
  analysisId: string;
  url: string;
  title: string;
  extractedText: string;
  metadata: {
    author?: string;
    publishDate?: string;
    domain: string;
    wordCount: number;
    language?: string;
    originalLanguage: string;
    wasTranslated: boolean;
    translationConfidence?: number;
  };
  claims: Claim[];
  summary: string;
  processingTime: number;
}

export interface TextAnalysisResponse {
  analysisId: string;
  textLength: number;
  claims: Claim[];
  summary: string;
  processingTime: number;
  originalLanguage: string;
  wasTranslated: boolean;
  translationConfidence?: number;
}

export interface DocumentAnalysisResponse {
  analysisId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: string;
  extractedText: string;
  claims: Claim[];
  summary: string;
  processingTime: number;
  metadata: {
    wordCount: number;
    characterCount: number;
    pageCount?: number;
    language?: string;
    author?: string;
    title?: string;
    originalLanguage: string;
    wasTranslated: boolean;
    translationConfidence?: number;
  };
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  processingTime: number;
}

export interface LanguageDetectionResponse {
  language: string;
  languageName: string;
  confidence: number;
  alternatives: Array<{
    language: string;
    languageName: string;
    confidence: number;
  }>;
}

export interface UrlAccessibilityResponse {
  url: string;
  accessible: boolean;
  status?: number;
  error?: string;
}

/**
 * Analyze content from URL
 */
export const analyzeUrl = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  try {
    const { url, options = {} }: UrlAnalysisRequest = req.body;

    if (!url) {
      res.status(400).json({
        success: false,
        message: 'URL is required',
        data: null
      });
      return;
    }

    logger.info(`Starting URL analysis for: ${url}`);

    // Extract content from URL
    const urlContent = await urlFetchingService.fetchAndParseUrl(url, {
      timeout: options.timeout || 10000,
      followRedirects: options.followRedirects !== false,
      maxRedirects: options.maxRedirects || 5
    });

    // Extract claims from the content
    const claimExtractionResult = await claimExtractionService.extractClaims(
      urlContent.extractedText,
      {
        maxClaims: options.maxClaims || 10,
        minConfidence: options.minConfidence || 0.6,
        includeOpinions: options.includeOpinions || false
      }
    );

    // Generate sources for the full content (not individual claims)
    const { sourceGenerationService } = await import('../services/sourceGenerationService');
    const contentSources = await sourceGenerationService.generateSources(
      urlContent.extractedText,
      {
        maxSources: 3, // Always exactly 3 sources
        minReliability: options.minSourceReliability || 0.7
      }
    );

    // Convert content sources to FactCheckSource format
    const sharedFactCheckSources = contentSources.map((source: any) => ({
      url: source.url,
      title: source.title,
      reliability: source.reliability,
      domain: source.domain,
      publishDate: source.publishDate,
      author: source.author,
      relevanceScore: source.relevanceScore,
      factCheckResult: source.factCheckResult,
      excerpt: source.excerpt
    }));

    // Fact-check the extracted claims with shared sources
    const factCheckResults = await factCheckingService.batchFactCheck(
      claimExtractionResult.claims,
      {
        maxSources: 0, // Don't generate sources for individual claims
        minSourceReliability: options.minSourceReliability || 0.7
      },
      sharedFactCheckSources // Pass the content-level sources
    );

    // Convert to the expected format with shared sources
    const sharedSources = contentSources.map((source: any) => ({
      url: source.url,
      title: source.title,
      reliability: source.reliability
    }));

    const claims: Claim[] = factCheckResults.map((result: any) => ({
      id: result.claimId,
      text: result.originalClaim,
      confidence: claimExtractionResult.claims.find(c => c.id === result.claimId)?.confidence || 0.5,
      credibilityScore: result.credibilityScore,
      sources: sharedSources // All claims share the same sources from full content
    }));

    const processingTime = Date.now() - startTime;

    const response: UrlAnalysisResponse = {
      analysisId: Date.now().toString(),
      url: urlContent.url,
      title: urlContent.title || 'Untitled',
      extractedText: urlContent.extractedText,
      metadata: {
        author: urlContent.metadata.author,
        publishDate: urlContent.metadata.publishDate,
        domain: urlContent.metadata.domain,
        wordCount: urlContent.extractedText.split(/\s+/).length,
        language: urlContent.metadata.language,
        originalLanguage: urlContent.metadata.language || 'en',
        wasTranslated: false,
        translationConfidence: undefined
      },
      claims,
      summary: `Successfully analyzed content from ${urlContent.url}. Extracted ${urlContent.extractedText.length} characters and found ${claims.length} claims for fact-checking.`,
      processingTime
    };

    logger.info(`URL analysis completed in ${processingTime}ms for: ${url}`);

    res.json({
      success: true,
      message: 'URL analysis completed successfully',
      data: response
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error('URL analysis failed:', error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'URL analysis failed',
      data: null,
      processingTime
    });
  }
};

/**
 * Analyze raw text content using comprehensive orchestrator
 */
export const analyzeText = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  try {
    const { text, options = {} }: TextAnalysisRequest = req.body;

    if (!text || text.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Text content is required',
        data: null
      });
      return;
    }

    logger.info(`Starting comprehensive text analysis for ${text.length} characters`);

    // Use the comprehensive analysis orchestrator
    const comprehensiveResult = await analysisOrchestrator.analyzeContent(text, {
      maxClaims: options.maxClaims || 10,
      minConfidence: options.minConfidence || 0.6,
      includeOpinions: options.includeOpinions || false,
      searchDatabases: true,
      verifyUrls: true,
      translateToEnglish: true,
      deepAnalysis: true
    });

    // Convert to expected response format
    const claims: Claim[] = comprehensiveResult.claims.map(claim => ({
      id: claim.id,
      text: claim.text,
      confidence: claim.confidence,
      credibilityScore: claim.factCheckResult.credibilityScore,
      sources: comprehensiveResult.sources.slice(0, 3).map(source => ({
        url: source.url,
        title: source.title,
        reliability: source.reliability
      }))
    }));

    const processingTime = Date.now() - startTime;

    const response: TextAnalysisResponse = {
      analysisId: comprehensiveResult.analysisId,
      textLength: text.length,
      claims,
      summary: comprehensiveResult.overallAssessment.reasoning,
      processingTime,
      originalLanguage: comprehensiveResult.language.detected,
      wasTranslated: comprehensiveResult.language.wasTranslated,
      translationConfidence: comprehensiveResult.language.confidence
    };

    logger.info(`Comprehensive text analysis completed in ${processingTime}ms - ${claims.length} claims, ${comprehensiveResult.sources.length} verified sources`);

    res.json({
      success: true,
      message: 'Text analysis completed successfully',
      data: response
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error('Text analysis failed:', error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Text analysis failed',
      data: null,
      processingTime
    });
  }
};

/**
 * Analyze uploaded document
 */
export const analyzeDocument = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
        data: null
      });
      return;
    }

    const options: DocumentAnalysisOptions = req.body.options ? JSON.parse(req.body.options) : {};

    logger.info(`Starting document analysis for: ${req.file.originalname}`);

    // For now, extract text from buffer (simplified implementation)
    const documentResult = {
      extractedText: req.file.buffer.toString('utf-8'),
      metadata: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        language: 'en'
      }
    };

    // Extract claims from the document text
    const claimExtractionResult = await claimExtractionService.extractClaims(
      documentResult.extractedText,
      {
        maxClaims: options.maxClaims || 10,
        minConfidence: options.minConfidence || 0.6,
        includeOpinions: options.includeOpinions || false
      }
    );

    // Generate sources for the full document content (not individual claims)
    const { sourceGenerationService } = await import('../services/sourceGenerationService');
    const contentSources = await sourceGenerationService.generateSources(
      documentResult.extractedText,
      {
        maxSources: 3, // Always exactly 3 sources
        minReliability: options.minSourceReliability || 0.7
      }
    );

    // Convert content sources to FactCheckSource format
    const sharedFactCheckSources = contentSources.map((source: any) => ({
      url: source.url,
      title: source.title,
      reliability: source.reliability,
      domain: source.domain,
      publishDate: source.publishDate,
      author: source.author,
      relevanceScore: source.relevanceScore,
      factCheckResult: source.factCheckResult,
      excerpt: source.excerpt
    }));

    // Fact-check the extracted claims with shared sources
    const factCheckResults = await factCheckingService.batchFactCheck(
      claimExtractionResult.claims,
      {
        maxSources: 0, // Don't generate sources for individual claims
        minSourceReliability: options.minSourceReliability || 0.7
      },
      sharedFactCheckSources // Pass the content-level sources
    );

    // Convert to the expected format with shared sources
    const sharedSources = contentSources.map((source: any) => ({
      url: source.url,
      title: source.title,
      reliability: source.reliability
    }));

    const claims: Claim[] = factCheckResults.map((result: any) => ({
      id: result.claimId,
      text: result.originalClaim,
      confidence: claimExtractionResult.claims.find(c => c.id === result.claimId)?.confidence || 0.5,
      credibilityScore: result.credibilityScore,
      sources: sharedSources // All claims share the same sources from full content
    }));

    const processingTime = Date.now() - startTime;

    const response: DocumentAnalysisResponse = {
      analysisId: Date.now().toString(),
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      status: 'completed',
      extractedText: documentResult.extractedText,
      claims,
      summary: `Successfully analyzed document "${req.file.originalname}". Extracted ${documentResult.extractedText.length} characters and found ${claims.length} claims for fact-checking.`,
      processingTime,
      metadata: {
        wordCount: documentResult.extractedText.split(/\s+/).length,
        characterCount: documentResult.extractedText.length,
        pageCount: undefined,
        language: documentResult.metadata?.language,
        author: undefined,
        title: undefined,
        originalLanguage: documentResult.metadata?.language || 'en',
        wasTranslated: false,
        translationConfidence: undefined
      }
    };

    logger.info(`Document analysis completed in ${processingTime}ms for: ${req.file.originalname}`);

    res.json({
      success: true,
      message: 'Document analysis completed successfully',
      data: response
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error('Document analysis failed:', error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Document analysis failed',
      data: null,
      processingTime
    });
  }
};

/**
 * Translate text
 */
export const translateText = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  try {
    const { text, targetLanguage = 'en', detectLanguage = true }: TranslationRequest = req.body;

    if (!text || text.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Text is required for translation',
        data: null
      });
      return;
    }

    logger.info(`Starting translation for ${text.length} characters to ${targetLanguage}`);

    const translationResult = await translationService.translateText(text, {
      targetLanguage,
      detectLanguage: detectLanguage
    });

    const processingTime = Date.now() - startTime;

    const response: TranslationResponse = {
      originalText: text,
      translatedText: translationResult.translatedText,
      sourceLanguage: translationResult.sourceLanguage,
      targetLanguage: translationResult.targetLanguage,
      confidence: translationResult.confidence,
      processingTime
    };

    logger.info(`Translation completed in ${processingTime}ms`);

    res.json({
      success: true,
      message: 'Translation completed successfully',
      data: response
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error('Translation failed:', error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Translation failed',
      data: null,
      processingTime
    });
  }
};

/**
 * Detect language of text
 */
export const detectLanguage = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  try {
    const { text }: LanguageDetectionRequest = req.body;

    if (!text || text.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Text is required for language detection',
        data: null
      });
      return;
    }

    logger.info(`Starting language detection for ${text.length} characters`);

    const detectionResult = await translationService.detectLanguage(text);

    const processingTime = Date.now() - startTime;

    const response: LanguageDetectionResponse = {
      language: detectionResult.language,
      languageName: detectionResult.language, // Use language code as name for now
      confidence: detectionResult.confidence,
      alternatives: detectionResult.alternatives.map(alt => ({
        language: alt.language,
        languageName: alt.language,
        confidence: alt.confidence
      }))
    };

    logger.info(`Language detection completed in ${processingTime}ms`);

    res.json({
      success: true,
      message: 'Language detection completed successfully',
      data: response
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error('Language detection failed:', error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Language detection failed',
      data: null,
      processingTime
    });
  }
};

/**
 * Check URL accessibility
 */
export const checkUrlAccessibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({
        success: false,
        message: 'URL is required',
        data: null
      });
      return;
    }

    logger.info(`Checking URL accessibility: ${url}`);

    const accessibilityResult = await urlFetchingService.checkUrlAccessibility(url);

    const response: UrlAccessibilityResponse = {
      url,
      accessible: accessibilityResult.accessible,
      status: accessibilityResult.status,
      error: accessibilityResult.error
    };

    res.json({
      success: true,
      message: 'URL accessibility check completed',
      data: response
    });

  } catch (error) {
    logger.error('URL accessibility check failed:', error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'URL accessibility check failed',
      data: null
    });
  }
};

/**
 * Get service health status
 */
export const getHealthStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      claimExtractionHealth,
      factCheckingHealth
    ] = await Promise.all([
      claimExtractionService.getHealthStatus(),
      factCheckingService.getHealthStatus()
    ]);

    const overallStatus = 
      claimExtractionHealth.status === 'healthy' && factCheckingHealth.status === 'healthy'
        ? 'healthy'
        : claimExtractionHealth.status === 'unhealthy' || factCheckingHealth.status === 'unhealthy'
        ? 'unhealthy'
        : 'degraded';

    res.json({
      success: true,
      message: 'Health status retrieved successfully',
      data: {
        status: overallStatus,
        services: {
          claimExtraction: claimExtractionHealth,
          factChecking: factCheckingHealth
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Health status check failed:', error);

    res.status(500).json({
      success: false,
      message: 'Health status check failed',
      data: {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
};