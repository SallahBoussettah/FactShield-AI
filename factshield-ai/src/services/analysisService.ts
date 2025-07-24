import { post, uploadFile } from './apiClient';
import type { AnalysisResult } from '../types/upload';

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

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
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
  claims: Array<{
    id: string;
    text: string;
    confidence: number;
    credibilityScore: number;
    sources: Array<{
      url: string;
      title: string;
      reliability: number;
    }>;
  }>;
  summary: string;
  processingTime: number;
}

export interface TextAnalysisResponse {
  analysisId: string;
  textLength: number;
  claims: Array<{
    id: string;
    text: string;
    confidence: number;
    credibilityScore: number;
    sources: Array<{
      url: string;
      title: string;
      reliability: number;
    }>;
  }>;
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
  claims: Array<{
    id: string;
    text: string;
    confidence: number;
    credibilityScore: number;
    sources: Array<{
      url: string;
      title: string;
      reliability: number;
    }>;
  }>;
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
 * Convert API response to AnalysisResult format
 */
const convertToAnalysisResult = (
  response: UrlAnalysisResponse | TextAnalysisResponse | DocumentAnalysisResponse,
  fileName?: string
): AnalysisResult => {
  return {
    id: response.analysisId,
    fileName: fileName || 
      ('fileName' in response ? response.fileName : 
       ('url' in response ? `Analysis of ${response.url}` : 'Text Analysis')),
    claims: response.claims.map(claim => ({
      id: claim.id,
      text: claim.text,
      confidence: claim.confidence,
      credibilityScore: claim.credibilityScore,
      sources: claim.sources
    })),
    summary: response.summary
  };
};

/**
 * Analyze content from URL
 */
export const analyzeUrl = async (request: UrlAnalysisRequest): Promise<AnalysisResult> => {
  try {
    const response = await post<ApiResponse<UrlAnalysisResponse>>('/analyze/url', request);
    return convertToAnalysisResult(response.data);
  } catch (error) {
    console.error('URL analysis failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze URL');
  }
};

/**
 * Analyze raw text content
 */
export const analyzeText = async (request: TextAnalysisRequest): Promise<AnalysisResult> => {
  try {
    const response = await post<ApiResponse<TextAnalysisResponse>>('/analyze/text', request);
    return convertToAnalysisResult(response.data);
  } catch (error) {
    console.error('Text analysis failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze text');
  }
};

/**
 * Analyze uploaded document
 */
export const analyzeDocument = async (
  file: File, 
  options?: DocumentAnalysisOptions
): Promise<AnalysisResult> => {
  try {
    const additionalData = options ? { options: JSON.stringify(options) } : undefined;
    const response = await uploadFile<ApiResponse<DocumentAnalysisResponse>>(
      '/analyze/document', 
      file, 
      additionalData
    );
    return convertToAnalysisResult(response.data, file.name);
  } catch (error) {
    console.error('Document analysis failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze document');
  }
};

/**
 * Translate text
 */
export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  try {
    const response = await post<ApiResponse<TranslationResponse>>('/analyze/translate', request);
    return response.data;
  } catch (error) {
    console.error('Translation failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to translate text');
  }
};

/**
 * Detect language of text
 */
export const detectLanguage = async (request: LanguageDetectionRequest): Promise<LanguageDetectionResponse> => {
  try {
    const response = await post<ApiResponse<LanguageDetectionResponse>>('/analyze/detect-language', request);
    return response.data;
  } catch (error) {
    console.error('Language detection failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to detect language');
  }
};

/**
 * Check URL accessibility
 */
export const checkUrlAccessibility = async (url: string): Promise<UrlAccessibilityResponse> => {
  try {
    const response = await post<ApiResponse<UrlAccessibilityResponse>>('/analyze/url/check', { url });
    return response.data;
  } catch (error) {
    console.error('URL accessibility check failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to check URL accessibility');
  }
};

/**
 * Utility function to validate file before upload
 */
export const validateFile = (
  file: File,
  maxSize: number = 10 * 1024 * 1024, // 10MB
  allowedTypes: string[] = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'application/rtf'
  ]
): string | null => {
  // Check file size
  if (file.size > maxSize) {
    return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const allowedExtensions = ['.pdf', '.txt', '.doc', '.docx', '.csv', '.rtf'];
    return `File type not supported. Allowed types: ${allowedExtensions.join(', ').toUpperCase()}`;
  }

  return null;
};

/**
 * Utility function to validate URL
 */
export const validateUrl = (url: string): string | null => {
  if (!url.trim()) {
    return 'URL is required';
  }

  try {
    const urlObj = new URL(url);
    
    // Check if protocol is http or https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return 'URL must use HTTP or HTTPS protocol';
    }

    // Check if hostname exists
    if (!urlObj.hostname) {
      return 'Invalid URL format';
    }

    return null;
  } catch {
    return 'Please enter a valid URL (e.g., https://news-website.com)';
  }
};