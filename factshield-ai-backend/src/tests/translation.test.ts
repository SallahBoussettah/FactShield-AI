import { translationService } from '../services/translationService';

describe('Translation Service', () => {
  // Skip tests if no Hugging Face API key is available
  const skipTests = !process.env.HUGGINGFACE_API_KEY;

  beforeAll(() => {
    if (skipTests) {
      console.log('Skipping Translation tests - HUGGINGFACE_API_KEY not found');
    }
  });

  describe('Language Support', () => {
    test('should return supported languages', () => {
      const supportedLanguages = translationService.getSupportedLanguages();
      
      expect(supportedLanguages.size).toBeGreaterThan(0);
      expect(supportedLanguages.has('en')).toBe(true);
      expect(supportedLanguages.has('es')).toBe(true);
      expect(supportedLanguages.has('fr')).toBe(true);
    });

    test('should check if language is supported', () => {
      expect(translationService.isLanguageSupported('en')).toBe(true);
      expect(translationService.isLanguageSupported('es')).toBe(true);
      expect(translationService.isLanguageSupported('xyz')).toBe(false);
    });

    test('should get language names', () => {
      expect(translationService.getLanguageName('en')).toBe('English');
      expect(translationService.getLanguageName('es')).toBe('Spanish');
      expect(translationService.getLanguageName('fr')).toBe('French');
      expect(translationService.getLanguageName('xyz')).toBe('Unknown');
    });

    test('should handle case-insensitive language codes', () => {
      expect(translationService.isLanguageSupported('EN')).toBe(true);
      expect(translationService.getLanguageName('ES')).toBe('Spanish');
    });
  });

  describe('Language Detection', () => {
    test('should detect English text', async () => {
      const englishText = 'This is a sample English text that should be detected as English language.';
      
      const result = await translationService.detectLanguage(englishText);
      
      expect(result).toHaveProperty('language');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('alternatives');
      
      expect(typeof result.confidence).toBe('number');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      
      expect(Array.isArray(result.alternatives)).toBe(true);
      
      // Should detect as English with reasonable confidence
      expect(result.language).toBe('en');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    test('should detect Spanish text', async () => {
      const spanishText = 'Este es un texto de ejemplo en español que debería ser detectado como idioma español.';
      
      const result = await translationService.detectLanguage(spanishText);
      
      expect(result.language).toBe('es');
      expect(result.confidence).toBeGreaterThan(0.3);
    });

    test('should handle mixed or unclear text', async () => {
      const mixedText = 'Hello mundo, this es un mixed texto with multiple languages.';
      
      const result = await translationService.detectLanguage(mixedText);
      
      expect(result).toHaveProperty('language');
      expect(result).toHaveProperty('confidence');
      // Should still return a result, even if confidence is lower
    });

    test('should handle short text', async () => {
      const shortText = 'Hello world';
      
      const result = await translationService.detectLanguage(shortText);
      
      expect(result).toHaveProperty('language');
      expect(result).toHaveProperty('confidence');
    });
  });

  describe('Text Translation', () => {
    test('should handle same-language translation', async () => {
      if (skipTests) return;

      const englishText = 'This is already in English.';
      
      try {
        const result = await translationService.translateText(englishText, {
          targetLanguage: 'en',
          detectLanguage: true
        });
        
        expect(result).toHaveProperty('originalText', englishText);
        expect(result).toHaveProperty('translatedText', englishText);
        expect(result).toHaveProperty('sourceLanguage', 'en');
        expect(result).toHaveProperty('targetLanguage', 'en');
        expect(result).toHaveProperty('confidence', 1.0);
        expect(result).toHaveProperty('processingTime');
        
        expect(typeof result.processingTime).toBe('number');
        expect(result.processingTime).toBeGreaterThan(0);
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping same-language test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000);

    test('should translate text with options', async () => {
      if (skipTests) return;

      const testText = 'Hello, how are you today?';
      
      try {
        const result = await translationService.translateText(testText, {
          targetLanguage: 'es',
          detectLanguage: true,
          maxLength: 1000
        });
        
        expect(result).toHaveProperty('originalText', testText);
        expect(result).toHaveProperty('translatedText');
        expect(result).toHaveProperty('sourceLanguage');
        expect(result).toHaveProperty('targetLanguage', 'es');
        expect(result).toHaveProperty('confidence');
        expect(result).toHaveProperty('processingTime');
        
        expect(typeof result.confidence).toBe('number');
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping translation test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000);

    test('should handle empty text gracefully', async () => {
      await expect(translationService.translateText(''))
        .rejects
        .toThrow('Text cannot be empty');
    });

    test('should handle very long text', async () => {
      const longText = 'a'.repeat(15000);
      
      await expect(translationService.translateText(longText))
        .rejects
        .toThrow('Text exceeds maximum length');
    });
  });

  describe('Text Preparation for Analysis', () => {
    test('should prepare English text without translation', async () => {
      const englishText = 'This is English text that should not be translated.';
      
      const result = await translationService.prepareTextForAnalysis(englishText);
      
      expect(result).toHaveProperty('processedText', englishText);
      expect(result).toHaveProperty('originalLanguage', 'en');
      expect(result).toHaveProperty('wasTranslated', false);
      expect(result).not.toHaveProperty('translationConfidence');
    });

    test('should prepare non-English text with translation', async () => {
      if (skipTests) return;

      const spanishText = 'Hola, ¿cómo estás hoy?';
      
      try {
        const result = await translationService.prepareTextForAnalysis(spanishText);
        
        expect(result).toHaveProperty('processedText');
        expect(result).toHaveProperty('originalLanguage');
        expect(result).toHaveProperty('wasTranslated');
        
        if (result.originalLanguage !== 'en' && result.originalLanguage !== 'unknown') {
          expect(result.wasTranslated).toBe(true);
          expect(result).toHaveProperty('translationConfidence');
          expect(typeof result.translationConfidence).toBe('number');
        }
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping text preparation test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000);

    test('should handle unknown language gracefully', async () => {
      const unknownText = 'xyz abc def ghi jkl mno pqr stu vwx';
      
      const result = await translationService.prepareTextForAnalysis(unknownText);
      
      expect(result).toHaveProperty('processedText', unknownText);
      expect(result).toHaveProperty('originalLanguage');
      expect(result).toHaveProperty('wasTranslated', false);
    });
  });

  describe('Batch Translation', () => {
    test('should translate multiple texts', async () => {
      if (skipTests) return;

      const texts = [
        'Hello world',
        'Good morning',
        'Thank you'
      ];
      
      try {
        const result = await translationService.translateBatch(texts, {
          targetLanguage: 'es'
        });
        
        expect(result).toHaveProperty('translations');
        expect(result).toHaveProperty('totalProcessingTime');
        expect(result).toHaveProperty('successCount');
        expect(result).toHaveProperty('failureCount');
        
        expect(Array.isArray(result.translations)).toBe(true);
        expect(result.translations.length).toBe(texts.length);
        
        expect(typeof result.totalProcessingTime).toBe('number');
        expect(typeof result.successCount).toBe('number');
        expect(typeof result.failureCount).toBe('number');
        
        expect(result.successCount + result.failureCount).toBe(texts.length);
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping batch translation test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 60000);

    test('should handle empty batch', async () => {
      const result = await translationService.translateBatch([]);
      
      expect(result.translations).toHaveLength(0);
      expect(result.successCount).toBe(0);
      expect(result.failureCount).toBe(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle translation errors gracefully', async () => {
      // This test ensures the service doesn't crash on errors
      const result = await translationService.translateText('test', {
        targetLanguage: 'invalid-language-code'
      });
      
      // Should return original text on error
      expect(result.originalText).toBe('test');
      expect(result.translatedText).toBe('test');
      expect(result.confidence).toBe(0.0);
    });
  });
});