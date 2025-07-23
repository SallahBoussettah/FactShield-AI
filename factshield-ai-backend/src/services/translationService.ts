import { HfInference } from '@huggingface/inference';
import { logger } from '../utils/logger';

export interface LanguageDetectionResult {
  language: string;
  confidence: number;
  alternatives: Array<{
    language: string;
    confidence: number;
  }>;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  processingTime: number;
}

export interface TranslationOptions {
  targetLanguage?: string;
  preserveFormatting?: boolean;
  maxLength?: number;
  detectLanguage?: boolean;
}

export interface BatchTranslationResult {
  translations: TranslationResult[];
  totalProcessingTime: number;
  successCount: number;
  failureCount: number;
}

class TranslationService {
  private hf: HfInference;
  private readonly defaultOptions: Required<TranslationOptions> = {
    targetLanguage: 'en',
    preserveFormatting: false,
    maxLength: 10000,
    detectLanguage: true
  };

  // Language codes mapping
  private readonly languageCodes = new Map([
    ['en', 'English'],
    ['es', 'Spanish'],
    ['fr', 'French'],
    ['de', 'German'],
    ['it', 'Italian'],
    ['pt', 'Portuguese'],
    ['ru', 'Russian'],
    ['ja', 'Japanese'],
    ['ko', 'Korean'],
    ['zh', 'Chinese'],
    ['ar', 'Arabic'],
    ['hi', 'Hindi'],
    ['nl', 'Dutch'],
    ['sv', 'Swedish'],
    ['no', 'Norwegian'],
    ['da', 'Danish'],
    ['fi', 'Finnish'],
    ['pl', 'Polish'],
    ['tr', 'Turkish'],
    ['he', 'Hebrew']
  ]);

  // Translation models for different language pairs
  private readonly translationModels = {
    // Multi-language to English
    toEnglish: 'Helsinki-NLP/opus-mt-mul-en',
    // English to multi-language
    fromEnglish: 'Helsinki-NLP/opus-mt-en-mul',
    // Specific high-quality models
    esEn: 'Helsinki-NLP/opus-mt-es-en',
    frEn: 'Helsinki-NLP/opus-mt-fr-en',
    deEn: 'Helsinki-NLP/opus-mt-de-en',
    zhEn: 'Helsinki-NLP/opus-mt-zh-en',
    // Language detection
    languageDetection: 'papluca/xlm-roberta-base-language-detection'
  };

  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    this.hf = new HfInference(apiKey);
  }

  /**
   * Detect the language of given text
   */
  async detectLanguage(text: string): Promise<LanguageDetectionResult> {
    try {
      logger.info(`Detecting language for text of ${text.length} characters`);

      // Use simple heuristics for common languages first (faster)
      const quickDetection = this.quickLanguageDetection(text);
      if (quickDetection.confidence > 0.8) {
        return quickDetection;
      }

      // Use AI model for more accurate detection
      try {
        const result = await this.hf.textClassification({
          model: this.translationModels.languageDetection,
          inputs: text.substring(0, 500) // Use first 500 chars for detection
        }) as any;

        if (result && result.length > 0) {
          const topResult = result[0];
          const language = this.normalizeLanguageCode(topResult.label);
          
          return {
            language,
            confidence: topResult.score || 0.5,
            alternatives: result.slice(1, 4).map((alt: any) => ({
              language: this.normalizeLanguageCode(alt.label),
              confidence: alt.score || 0
            }))
          };
        }
      } catch (error) {
        logger.warn('AI language detection failed, using heuristic detection:', error);
      }

      // Fallback to heuristic detection
      return quickDetection;

    } catch (error) {
      logger.error('Language detection failed:', error);
      return {
        language: 'unknown',
        confidence: 0.3,
        alternatives: []
      };
    }
  }

  /**
   * Quick language detection using heuristics
   */
  private quickLanguageDetection(text: string): LanguageDetectionResult {
    const sample = text.toLowerCase().substring(0, 1000);
    
    // English indicators
    const englishWords = ['the', 'and', 'is', 'are', 'was', 'were', 'have', 'has', 'will', 'would'];
    const englishCount = englishWords.filter(word => sample.includes(` ${word} `)).length;
    
    // Spanish indicators
    const spanishWords = ['el', 'la', 'es', 'son', 'que', 'de', 'en', 'un', 'una', 'con'];
    const spanishCount = spanishWords.filter(word => sample.includes(` ${word} `)).length;
    
    // French indicators
    const frenchWords = ['le', 'la', 'est', 'sont', 'que', 'de', 'en', 'un', 'une', 'avec'];
    const frenchCount = frenchWords.filter(word => sample.includes(` ${word} `)).length;
    
    // German indicators
    const germanWords = ['der', 'die', 'das', 'ist', 'sind', 'und', 'mit', 'ein', 'eine', 'von'];
    const germanCount = germanWords.filter(word => sample.includes(` ${word} `)).length;

    const scores = [
      { language: 'en', count: englishCount },
      { language: 'es', count: spanishCount },
      { language: 'fr', count: frenchCount },
      { language: 'de', count: germanCount }
    ];

    scores.sort((a, b) => b.count - a.count);
    
    const topScore = scores[0];
    const confidence = topScore.count > 0 ? Math.min(0.9, topScore.count / 10) : 0.3;

    return {
      language: topScore.count > 0 ? topScore.language : 'unknown',
      confidence,
      alternatives: scores.slice(1, 3).map(score => ({
        language: score.language,
        confidence: score.count > 0 ? Math.min(0.8, score.count / 10) : 0.1
      }))
    };
  }

  /**
   * Normalize language codes to standard format
   */
  private normalizeLanguageCode(code: string): string {
    const normalized = code.toLowerCase().substring(0, 2);
    return this.languageCodes.has(normalized) ? normalized : 'unknown';
  }

  /**
   * Select the best translation model for given language pair
   */
  private selectTranslationModel(sourceLanguage: string, targetLanguage: string): string {
    // If translating to English, use specific models when available
    if (targetLanguage === 'en') {
      switch (sourceLanguage) {
        case 'es': return this.translationModels.esEn;
        case 'fr': return this.translationModels.frEn;
        case 'de': return this.translationModels.deEn;
        case 'zh': return this.translationModels.zhEn;
        default: return this.translationModels.toEnglish;
      }
    }
    
    // If translating from English, use general model
    if (sourceLanguage === 'en') {
      return this.translationModels.fromEnglish;
    }
    
    // For other language pairs, use multi-language model
    return this.translationModels.toEnglish;
  }

  /**
   * Split text into chunks for translation
   */
  private splitTextForTranslation(text: string, maxLength: number): string[] {
    if (text.length <= maxLength) {
      return [text];
    }

    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (currentChunk.length + trimmedSentence.length + 1 <= maxLength) {
        currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk + '.');
          currentChunk = trimmedSentence;
        } else {
          // Handle very long sentences by splitting on commas or spaces
          const words = trimmedSentence.split(' ');
          let wordChunk = '';
          
          for (const word of words) {
            if (wordChunk.length + word.length + 1 <= maxLength) {
              wordChunk += (wordChunk ? ' ' : '') + word;
            } else {
              if (wordChunk) {
                chunks.push(wordChunk);
                wordChunk = word;
              } else {
                // Handle extremely long words
                chunks.push(word.substring(0, maxLength));
              }
            }
          }
          
          if (wordChunk) {
            currentChunk = wordChunk;
          }
        }
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk + '.');
    }
    
    return chunks;
  }

  /**
   * Translate text from one language to another
   */
  async translateText(text: string, options: TranslationOptions = {}): Promise<TranslationResult> {
    const startTime = Date.now();
    const config = { ...this.defaultOptions, ...options };
    
    try {
      logger.info(`Starting translation of ${text.length} characters`);

      // Validate input
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
      }

      if (text.length > config.maxLength) {
        throw new Error(`Text exceeds maximum length of ${config.maxLength} characters`);
      }

      let sourceLanguage = 'unknown';
      
      // Detect source language if requested
      if (config.detectLanguage) {
        const detection = await this.detectLanguage(text);
        sourceLanguage = detection.language;
        
        // If already in target language, return as-is
        if (sourceLanguage === config.targetLanguage) {
          return {
            originalText: text,
            translatedText: text,
            sourceLanguage,
            targetLanguage: config.targetLanguage,
            confidence: 1.0,
            processingTime: Date.now() - startTime
          };
        }
      }

      // Select appropriate translation model
      const model = this.selectTranslationModel(sourceLanguage, config.targetLanguage);
      
      // Split text into manageable chunks
      const chunks = this.splitTextForTranslation(text, Math.min(config.maxLength, 1000));
      const translatedChunks: string[] = [];
      
      // Translate each chunk
      for (const chunk of chunks) {
        try {
          const result = await this.hf.translation({
            model,
            inputs: chunk
          }) as any;

          const translatedText = result?.translation_text || result?.generated_text || chunk;
          translatedChunks.push(translatedText);
          
          // Add delay to avoid rate limiting
          if (chunks.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
          
        } catch (error) {
          logger.warn(`Failed to translate chunk: ${chunk.substring(0, 50)}...`, error);
          translatedChunks.push(chunk); // Keep original if translation fails
        }
      }

      const translatedText = translatedChunks.join(' ');
      const processingTime = Date.now() - startTime;

      const result: TranslationResult = {
        originalText: text,
        translatedText,
        sourceLanguage,
        targetLanguage: config.targetLanguage,
        confidence: 0.8, // Default confidence - could be improved with model-specific scoring
        processingTime
      };

      logger.info(`Translation completed: ${sourceLanguage} -> ${config.targetLanguage} in ${processingTime}ms`);
      
      return result;

    } catch (error) {
      logger.error('Translation failed:', error);
      
      // Return original text on failure
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage: 'unknown',
        targetLanguage: config.targetLanguage,
        confidence: 0.0,
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Translate multiple texts in batch
   */
  async translateBatch(texts: string[], options: TranslationOptions = {}): Promise<BatchTranslationResult> {
    const startTime = Date.now();
    const translations: TranslationResult[] = [];
    let successCount = 0;
    let failureCount = 0;

    logger.info(`Starting batch translation of ${texts.length} texts`);

    for (const text of texts) {
      try {
        const result = await this.translateText(text, options);
        translations.push(result);
        
        if (result.confidence > 0.5) {
          successCount++;
        } else {
          failureCount++;
        }
        
        // Add delay between translations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        logger.error(`Failed to translate text: ${text.substring(0, 50)}...`, error);
        
        translations.push({
          originalText: text,
          translatedText: text,
          sourceLanguage: 'unknown',
          targetLanguage: options.targetLanguage || 'en',
          confidence: 0.0,
          processingTime: 0
        });
        
        failureCount++;
      }
    }

    const totalProcessingTime = Date.now() - startTime;

    logger.info(`Batch translation completed: ${successCount} successful, ${failureCount} failed in ${totalProcessingTime}ms`);

    return {
      translations,
      totalProcessingTime,
      successCount,
      failureCount
    };
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): Map<string, string> {
    return new Map(this.languageCodes);
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(languageCode: string): boolean {
    return this.languageCodes.has(languageCode.toLowerCase());
  }

  /**
   * Get language name from code
   */
  getLanguageName(languageCode: string): string {
    return this.languageCodes.get(languageCode.toLowerCase()) || 'Unknown';
  }

  /**
   * Prepare text for analysis by translating to English if needed
   */
  async prepareTextForAnalysis(text: string): Promise<{
    processedText: string;
    originalLanguage: string;
    wasTranslated: boolean;
    translationConfidence?: number;
  }> {
    try {
      // Detect language
      const detection = await this.detectLanguage(text);
      
      // If already in English or unknown, return as-is
      if (detection.language === 'en' || detection.language === 'unknown') {
        return {
          processedText: text,
          originalLanguage: detection.language,
          wasTranslated: false
        };
      }

      // Translate to English for analysis
      const translation = await this.translateText(text, {
        targetLanguage: 'en',
        detectLanguage: false // We already detected it
      });

      return {
        processedText: translation.translatedText,
        originalLanguage: detection.language,
        wasTranslated: true,
        translationConfidence: translation.confidence
      };

    } catch (error) {
      logger.error('Failed to prepare text for analysis:', error);
      
      return {
        processedText: text,
        originalLanguage: 'unknown',
        wasTranslated: false
      };
    }
  }
}

export const translationService = new TranslationService();