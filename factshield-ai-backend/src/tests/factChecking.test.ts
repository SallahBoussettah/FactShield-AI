import { factCheckingService } from '../services/factCheckingService';
import { ExtractedClaim } from '../services/claimExtractionService';

describe('Fact Checking Service', () => {
  const mockClaim: ExtractedClaim = {
    id: 'test-claim-1',
    text: 'Climate change is causing global temperatures to rise significantly.',
    confidence: 0.85,
    category: 'factual',
    context: 'This is a test context for the climate change claim.',
    position: { start: 0, end: 65 },
    keywords: ['climate', 'change', 'global', 'temperatures', 'rise']
  };

  describe('Domain Trust Management', () => {
    test('should return trusted domains list', () => {
      const trustedDomains = factCheckingService.getTrustedDomains();
      
      expect(trustedDomains.size).toBeGreaterThan(0);
      expect(trustedDomains.has('snopes.com')).toBe(true);
      expect(trustedDomains.has('factcheck.org')).toBe(true);
      expect(trustedDomains.has('reuters.com')).toBe(true);
    });

    test('should check if domain is trusted', () => {
      expect(factCheckingService.isDomainTrusted('snopes.com')).toBe(true);
      expect(factCheckingService.isDomainTrusted('factcheck.org')).toBe(true);
      expect(factCheckingService.isDomainTrusted('unknown-site.com')).toBe(false);
    });

    test('should return domain reliability scores', () => {
      expect(factCheckingService.getDomainReliability('snopes.com')).toBeGreaterThan(0.9);
      expect(factCheckingService.getDomainReliability('factcheck.org')).toBeGreaterThan(0.9);
      expect(factCheckingService.getDomainReliability('unknown-site.com')).toBe(0.5);
    });

    test('should handle case-insensitive domain checks', () => {
      expect(factCheckingService.isDomainTrusted('SNOPES.COM')).toBe(true);
      expect(factCheckingService.getDomainReliability('FACTCHECK.ORG')).toBeGreaterThan(0.9);
    });
  });

  describe('Fact Checking Process', () => {
    test('should fact-check a single claim', async () => {
      try {
        const result = await factCheckingService.factCheckClaim(mockClaim);
        
        expect(result).toHaveProperty('claimId', mockClaim.id);
        expect(result).toHaveProperty('originalClaim', mockClaim.text);
        expect(result).toHaveProperty('credibilityScore');
        expect(result).toHaveProperty('credibilityAssessment');
        expect(result).toHaveProperty('sources');
        expect(result).toHaveProperty('verificationStatus');
        expect(result).toHaveProperty('processingTime');
        
        expect(typeof result.credibilityScore).toBe('number');
        expect(result.credibilityScore).toBeGreaterThanOrEqual(0);
        expect(result.credibilityScore).toBeLessThanOrEqual(1);
        
        expect(['verified', 'disputed', 'unverified', 'false']).toContain(result.verificationStatus);
        
        expect(Array.isArray(result.sources)).toBe(true);
        
        // Check credibility assessment structure
        expect(result.credibilityAssessment).toHaveProperty('overallScore');
        expect(result.credibilityAssessment).toHaveProperty('confidence');
        expect(result.credibilityAssessment).toHaveProperty('factors');
        expect(result.credibilityAssessment).toHaveProperty('reasoning');
        expect(result.credibilityAssessment).toHaveProperty('riskLevel');
        
        expect(['low', 'medium', 'high', 'critical']).toContain(result.credibilityAssessment.riskLevel);
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000);

    test('should fact-check multiple claims', async () => {
      const claims: ExtractedClaim[] = [
        mockClaim,
        {
          id: 'test-claim-2',
          text: 'The Earth is flat according to recent scientific studies.',
          confidence: 0.3,
          category: 'factual',
          context: 'This is a test context for a false claim.',
          position: { start: 0, end: 55 },
          keywords: ['Earth', 'flat', 'scientific', 'studies']
        }
      ];

      try {
        const results = await factCheckingService.factCheckClaims(claims);
        
        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBe(claims.length);
        
        results.forEach((result, index) => {
          expect(result.claimId).toBe(claims[index].id);
          expect(result.originalClaim).toBe(claims[index].text);
          expect(typeof result.credibilityScore).toBe('number');
        });
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping batch test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 60000);

    test('should respect fact-checking options', async () => {
      const options = {
        maxSources: 2,
        minSourceReliability: 0.8,
        includeDisputedSources: false
      };

      try {
        const result = await factCheckingService.factCheckClaim(mockClaim, options);
        
        expect(result.sources.length).toBeLessThanOrEqual(options.maxSources);
        
        result.sources.forEach(source => {
          expect(source.reliability).toBeGreaterThanOrEqual(options.minSourceReliability);
        });
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping options test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000);
  });

  describe('Source Analysis', () => {
    test('should generate mock sources for testing', async () => {
      try {
        const result = await factCheckingService.factCheckClaim(mockClaim);
        
        if (result.sources.length > 0) {
          const source = result.sources[0];
          
          expect(source).toHaveProperty('url');
          expect(source).toHaveProperty('title');
          expect(source).toHaveProperty('reliability');
          expect(source).toHaveProperty('domain');
          expect(source).toHaveProperty('relevanceScore');
          expect(source).toHaveProperty('factCheckResult');
          
          expect(typeof source.reliability).toBe('number');
          expect(source.reliability).toBeGreaterThanOrEqual(0);
          expect(source.reliability).toBeLessThanOrEqual(1);
          
          expect(['supports', 'contradicts', 'neutral', 'insufficient_evidence']).toContain(source.factCheckResult);
        }
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping source analysis test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000);
  });

  describe('Credibility Assessment', () => {
    test('should provide detailed credibility factors', async () => {
      try {
        const result = await factCheckingService.factCheckClaim(mockClaim);
        
        const factors = result.credibilityAssessment.factors;
        
        expect(factors).toHaveProperty('sourceReliability');
        expect(factors).toHaveProperty('evidenceStrength');
        expect(factors).toHaveProperty('consensusLevel');
        expect(factors).toHaveProperty('recency');
        expect(factors).toHaveProperty('authorCredibility');
        
        Object.values(factors).forEach(factor => {
          expect(typeof factor).toBe('number');
          expect(factor).toBeGreaterThanOrEqual(0);
          expect(factor).toBeLessThanOrEqual(1);
        });
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping credibility assessment test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000);

    test('should provide human-readable reasoning', async () => {
      try {
        const result = await factCheckingService.factCheckClaim(mockClaim);
        
        expect(typeof result.credibilityAssessment.reasoning).toBe('string');
        expect(result.credibilityAssessment.reasoning.length).toBeGreaterThan(10);
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('rate limit')) {
          console.log('Skipping reasoning test due to rate limiting');
          return;
        }
        throw error;
      }
    }, 30000);
  });

  describe('Error Handling', () => {
    test('should handle claims gracefully on errors', async () => {
      const invalidClaim: ExtractedClaim = {
        id: 'invalid-claim',
        text: '', // Empty text should be handled gracefully
        confidence: 0.5,
        category: 'unknown',
        context: '',
        position: { start: 0, end: 0 },
        keywords: []
      };

      const result = await factCheckingService.factCheckClaim(invalidClaim);
      
      expect(result).toHaveProperty('claimId', invalidClaim.id);
      expect(result).toHaveProperty('verificationStatus');
      expect(result.verificationStatus).toBe('unverified');
    });
  });
});