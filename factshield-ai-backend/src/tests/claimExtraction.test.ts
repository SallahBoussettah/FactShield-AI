import { claimExtractionService } from '../services/claimExtractionService';

describe('Claim Extraction Service', () => {
  // Skip tests if no Hugging Face API key is available
  const skipTests = !process.env.HUGGINGFACE_API_KEY;

  beforeAll(() => {
    if (skipTests) {
      console.log('Skipping Claim Extraction tests - HUGGINGFACE_API_KEY not found');
    }
  });

  describe('Input Validation', () => {
    test('should reject empty text', async () => {
      await expect(claimExtractionService.extractClaims(''))
        .rejects
        .toThrow('Text must be at least 50 characters long');
    });

    test('should reject very short text', async () => {
      await expect(claimExtractionService.extractClaims('Too short'))
        .rejects
        .toThrow('Text must be at least 50 characters long');
    });

    test('should reject very long text', async () => {
      const longText = 'a'.repeat(60000);
      await expect(claimExtractionService.extractClaims(longText))
        .rejects
        .toThrow('Text must be less than 50,000 characters');
    });
  });

  describe('Basic Functionality', () => {
    const sampleText = `
      Climate change is a significant global challenge that affects weather patterns worldwide.
      The Earth's average temperature has increased by approximately 1.1 degrees Celsius since the late 19th century.
      Scientists believe that human activities are the primary cause of recent climate change.
      Renewable energy sources like solar and wind power are becoming more cost-effective.
      Many countries have committed to reducing their carbon emissions by 2030.
    `;

    test('should extract claims from sample text', async () => {
      if (skipTests) return;

      try {
        const result = await claimExtractionService.extractClaims(sampleText);
        
        expect(result).toHaveProperty('claims');
        expect(result).toHaveProperty('totalClaims');
        expect(result).toHaveProperty('processingTime');
        expect(result).toHaveProperty('textLength');
        expect(result).toHaveProperty('language');
        
        expect(Array.isArray(result.claims)).toBe(true);
        expect(result.totalClaims).toBeGreaterThanOrEqual(0);
        expect(result.processingTime).toBeGreaterThan(0);
        expect(result.textLength).toBe(sampleText.length);
        
        // Check claim structure
        if (result.claims.length > 0) {
          const claim = result.claims[0];
          expect(claim).toHaveProperty('id');
          expect(claim).toHaveProperty('text');
          expect(claim).toHaveProperty('confidence');
          expect(claim).toHaveProperty('category');
          expect(claim).toHaveProperty('context');
          expect(claim).toHaveProperty('position');
          expect(claim).toHaveProperty('keywords');
          
          expect(typeof claim.confidence).toBe('number');
          expect(claim.confidence).toBeGreaterThanOrEqual(0);
          expect(claim.confidence).toBeLessThanOrEqual(1);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000); // Increase timeout for API calls

    test('should respect maxClaims option', async () => {
      if (skipTests) return;

      try {
        const result = await claimExtractionService.extractClaims(sampleText, {
          maxClaims: 2
        });
        
        expect(result.claims.length).toBeLessThanOrEqual(2);
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000);

    test('should respect minConfidence option', async () => {
      if (skipTests) return;

      try {
        const result = await claimExtractionService.extractClaims(sampleText, {
          minConfidence: 0.8
        });
        
        result.claims.forEach(claim => {
          expect(claim.confidence).toBeGreaterThanOrEqual(0.8);
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000);
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      if (skipTests) return;

      try {
        const health = await claimExtractionService.getHealthStatus();
        
        expect(health).toHaveProperty('status');
        expect(health).toHaveProperty('details');
        expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping health check due to rate limiting');
          return;
        }
        throw error;
      }
    }, 15000);
  });

  describe('Edge Cases', () => {
    test('should handle text with no clear sentences', async () => {
      if (skipTests) return;

      const fragmentedText = 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12 word13 word14 word15';
      
      try {
        const result = await claimExtractionService.extractClaims(fragmentedText);
        expect(result).toHaveProperty('claims');
        // Should handle gracefully even if no claims are found
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping test due to rate limiting');
          return;
        }
        // Should not throw for valid input
        expect(error).toBeUndefined();
      }
    }, 30000);

    test('should handle text with special characters', async () => {
      if (skipTests) return;

      const specialText = `
        This text contains special characters: @#$%^&*()!
        It also has numbers: 123, 456.78, and percentages: 50%.
        Unicode characters: café, naïve, résumé are also present.
        This should still be processed correctly by the system.
      `;
      
      try {
        const result = await claimExtractionService.extractClaims(specialText);
        expect(result).toHaveProperty('claims');
        expect(result.textLength).toBe(specialText.length);
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000);
  });
});