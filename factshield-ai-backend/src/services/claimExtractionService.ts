import { HfInference } from '@huggingface/inference';
import { logger } from '../utils/logger';

export interface ExtractedClaim {
  id: string;
  text: string;
  confidence: number;
  category: 'factual' | 'opinion' | 'prediction' | 'statistical' | 'unknown';
  context: string;
  position: {
    start: number;
    end: number;
  };
  keywords: string[];
}

export interface ClaimExtractionOptions {
  maxClaims?: number;
  minConfidence?: number;
  includeOpinions?: boolean;
  language?: string;
  contextWindow?: number;
}

export interface ClaimExtractionResult {
  claims: ExtractedClaim[];
  totalClaims: number;
  processingTime: number;
  textLength: number;
  language: string;
}

class ClaimExtractionService {
  private hf: HfInference;
  private readonly defaultOptions: Required<ClaimExtractionOptions> = {
    maxClaims: 20,
    minConfidence: 0.5,
    includeOpinions: false,
    language: 'en',
    contextWindow: 100
  };

  // Models for different tasks
  private readonly models = {
    // For claim detection and classification
    claimDetection: 'microsoft/DialoGPT-medium',
    // For text classification
    textClassification: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
    // For question answering (to extract factual claims)
    questionAnswering: 'deepset/roberta-base-squad2',
    // For token classification (NER)
    tokenClassification: 'dbmdz/bert-large-cased-finetuned-conll03-english',
    // For zero-shot classification
    zeroShotClassification: 'facebook/bart-large-mnli'
  };

  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      logger.warn('HUGGINGFACE_API_KEY not found. Using public inference API with rate limits.');
    }
    
    this.hf = new HfInference(apiKey);
  }

  /**
   * Split text into sentences for processing
   */
  private splitIntoSentences(text: string): string[] {
    // Simple sentence splitting - in production, you might want to use a more sophisticated approach
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 10); // Filter out very short sentences
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - remove common words and extract meaningful terms
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word))
      .slice(0, 10); // Limit to top 10 keywords
  }

  /**
   * Classify claim type using zero-shot classification
   */
  private async classifyClaimType(text: string): Promise<{ category: ExtractedClaim['category']; confidence: number }> {
    try {
      const labels = ['factual statement', 'opinion', 'prediction', 'statistical claim', 'unknown'];
      
      const result = await this.hf.zeroShotClassification({
        model: this.models.zeroShotClassification,
        inputs: text,
        parameters: {
          candidate_labels: labels
        }
      });

      // Handle the response structure properly
      const resultData = result as any;
      const topLabel = resultData.labels?.[0] || 'unknown';
      const confidence = resultData.scores?.[0] || 0.5;

      let category: ExtractedClaim['category'] = 'unknown';
      if (topLabel.includes('factual')) category = 'factual';
      else if (topLabel.includes('opinion')) category = 'opinion';
      else if (topLabel.includes('prediction')) category = 'prediction';
      else if (topLabel.includes('statistical')) category = 'statistical';

      return { category, confidence };
    } catch (error) {
      logger.warn('Failed to classify claim type:', error);
      return { category: 'unknown', confidence: 0.5 };
    }
  }

  /**
   * Use question answering to extract factual claims
   */
  private async extractFactualClaims(text: string): Promise<Array<{ text: string; confidence: number; start: number; end: number }>> {
    const factualQuestions = [
      'What facts are stated?',
      'What claims are made?',
      'What assertions are presented?',
      'What statements can be verified?',
      'What data or statistics are mentioned?'
    ];

    const claims: Array<{ text: string; confidence: number; start: number; end: number }> = [];

    try {
      for (const question of factualQuestions) {
        const result = await this.hf.questionAnswering({
          model: this.models.questionAnswering,
          inputs: {
            question,
            context: text
          }
        });

        // Handle the response structure properly
        const resultData = result as any;
        const score = resultData.score || 0;
        const answer = resultData.answer || '';
        const start = resultData.start || 0;
        const end = resultData.end || answer.length;

        if (score > 0.3 && answer.length > 10) {
          claims.push({
            text: answer,
            confidence: score,
            start: start,
            end: end
          });
        }
      }
    } catch (error) {
      logger.warn('Failed to extract factual claims:', error);
    }

    return claims;
  }

  /**
   * Extract claims using sentence-level analysis
   */
  private async extractClaimsFromSentences(
    sentences: string[], 
    originalText: string,
    options: ClaimExtractionOptions
  ): Promise<ExtractedClaim[]> {
    const config = { ...this.defaultOptions, ...options };
    const claims: ExtractedClaim[] = [];
    let currentPosition = 0;

    for (const sentence of sentences) {
      try {
        // Find the position of this sentence in the original text
        const sentenceStart = originalText.indexOf(sentence, currentPosition);
        const sentenceEnd = sentenceStart + sentence.length;
        currentPosition = sentenceEnd;

        // Skip very short sentences
        if (sentence.length < 20) continue;

        // Classify the claim type
        const classification = await this.classifyClaimType(sentence);

        // Skip opinions if not requested
        if (!config.includeOpinions && classification.category === 'opinion') {
          continue;
        }

        // Skip low confidence claims
        if (classification.confidence < config.minConfidence) {
          continue;
        }

        // Extract context around the claim
        const contextStart = Math.max(0, sentenceStart - config.contextWindow);
        const contextEnd = Math.min(originalText.length, sentenceEnd + config.contextWindow);
        const context = originalText.substring(contextStart, contextEnd);

        // Extract keywords
        const keywords = this.extractKeywords(sentence);

        const claim: ExtractedClaim = {
          id: `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: sentence.trim(),
          confidence: classification.confidence,
          category: classification.category,
          context: context.trim(),
          position: {
            start: sentenceStart,
            end: sentenceEnd
          },
          keywords
        };

        claims.push(claim);

        // Stop if we've reached the maximum number of claims
        if (claims.length >= config.maxClaims) {
          break;
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        logger.warn(`Failed to process sentence: ${sentence.substring(0, 50)}...`, error);
        continue;
      }
    }

    return claims;
  }

  /**
   * Detect language of the text
   */
  private async detectLanguage(text: string): Promise<string> {
    try {
      // Use a simple heuristic for now - in production, you might use a language detection model
      const sample = text.substring(0, 500).toLowerCase();
      
      // English indicators
      if (sample.includes(' the ') && sample.includes(' and ') && sample.includes(' is ')) {
        return 'en';
      }
      // Spanish indicators
      if (sample.includes(' el ') && sample.includes(' la ') && sample.includes(' es ')) {
        return 'es';
      }
      // French indicators
      if (sample.includes(' le ') && sample.includes(' la ') && sample.includes(' est ')) {
        return 'fr';
      }
      
      return 'unknown';
    } catch (error) {
      logger.warn('Language detection failed:', error);
      return 'unknown';
    }
  }

  /**
   * Main claim extraction method
   */
  async extractClaims(text: string, options: ClaimExtractionOptions = {}): Promise<ClaimExtractionResult> {
    const startTime = Date.now();
    
    try {
      logger.info(`Starting claim extraction for text of ${text.length} characters`);
      
      // Validate input
      if (!text || text.trim().length < 50) {
        throw new Error('Text must be at least 50 characters long');
      }

      if (text.length > 50000) {
        throw new Error('Text must be less than 50,000 characters');
      }

      const config = { ...this.defaultOptions, ...options };
      
      // Detect language
      const detectedLanguage = await this.detectLanguage(text);
      
      // Split text into sentences
      const sentences = this.splitIntoSentences(text);
      
      if (sentences.length === 0) {
        throw new Error('No valid sentences found in text');
      }

      logger.info(`Processing ${sentences.length} sentences for claim extraction`);

      // Extract claims using multiple approaches
      const sentenceClaims = await this.extractClaimsFromSentences(sentences, text, config);
      
      // Try to extract additional factual claims using QA approach
      let factualClaims: ExtractedClaim[] = [];
      try {
        const qaResults = await this.extractFactualClaims(text);
        factualClaims = qaResults.map((result, index) => ({
          id: `factual_${Date.now()}_${index}`,
          text: result.text,
          confidence: result.confidence,
          category: 'factual' as const,
          context: text.substring(
            Math.max(0, result.start - config.contextWindow),
            Math.min(text.length, result.end + config.contextWindow)
          ),
          position: {
            start: result.start,
            end: result.end
          },
          keywords: this.extractKeywords(result.text)
        }));
      } catch (error) {
        logger.warn('QA-based claim extraction failed:', error);
      }

      // Combine and deduplicate claims
      const allClaims = [...sentenceClaims, ...factualClaims];
      const uniqueClaims = this.deduplicateClaims(allClaims);
      
      // Sort by confidence and limit results
      const finalClaims = uniqueClaims
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, config.maxClaims);

      const processingTime = Date.now() - startTime;

      const result: ClaimExtractionResult = {
        claims: finalClaims,
        totalClaims: finalClaims.length,
        processingTime,
        textLength: text.length,
        language: detectedLanguage
      };

      logger.info(`Claim extraction completed: ${finalClaims.length} claims extracted in ${processingTime}ms`);
      
      return result;

    } catch (error) {
      logger.error('Claim extraction failed:', error);
      throw error;
    }
  }

  /**
   * Remove duplicate claims based on text similarity
   */
  private deduplicateClaims(claims: ExtractedClaim[]): ExtractedClaim[] {
    const uniqueClaims: ExtractedClaim[] = [];
    
    for (const claim of claims) {
      const isDuplicate = uniqueClaims.some(existing => {
        // Simple similarity check - in production, you might use more sophisticated methods
        const similarity = this.calculateTextSimilarity(claim.text, existing.text);
        return similarity > 0.8;
      });
      
      if (!isDuplicate) {
        uniqueClaims.push(claim);
      }
    }
    
    return uniqueClaims;
  }

  /**
   * Calculate simple text similarity
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    try {
      // Test with a simple classification
      const testResult = await this.hf.zeroShotClassification({
        model: this.models.zeroShotClassification,
        inputs: 'This is a test sentence.',
        parameters: {
          candidate_labels: ['test', 'example']
        }
      }) as any;

      return {
        status: 'healthy',
        details: {
          modelsAvailable: Object.keys(this.models).length,
          testResponse: testResult ? 'success' : 'failed'
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }
}

export const claimExtractionService = new ClaimExtractionService();