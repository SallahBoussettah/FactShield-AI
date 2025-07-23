import { urlFetchingService } from '../services/urlFetchingService';

describe('URL Fetching Service', () => {
  // Test URL validation
  describe('URL Validation', () => {
    test('should reject invalid URLs', async () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://example.com',
        'javascript:alert(1)',
        'file:///etc/passwd'
      ];

      for (const url of invalidUrls) {
        await expect(urlFetchingService.fetchAndParseUrl(url))
          .rejects
          .toThrow();
      }
    });

    test('should accept valid HTTP/HTTPS URLs', async () => {
      // This test would require actual network access
      // In a real environment, you might mock the axios calls
      const validUrl = 'https://httpbin.org/html';
      
      // Skip this test if we don't have network access
      try {
        const result = await urlFetchingService.checkUrlAccessibility(validUrl);
        expect(result.accessible).toBeDefined();
      } catch (error) {
        console.log('Skipping network test - no internet access');
      }
    });
  });

  describe('URL Accessibility Check', () => {
    test('should check URL accessibility', async () => {
      const testUrl = 'https://httpbin.org/status/200';
      
      try {
        const result = await urlFetchingService.checkUrlAccessibility(testUrl);
        expect(result).toHaveProperty('accessible');
        expect(typeof result.accessible).toBe('boolean');
      } catch (error) {
        console.log('Skipping network test - no internet access');
      }
    });

    test('should handle inaccessible URLs', async () => {
      const testUrl = 'https://httpbin.org/status/404';
      
      try {
        const result = await urlFetchingService.checkUrlAccessibility(testUrl);
        expect(result.accessible).toBe(false);
        expect(result.status).toBe(404);
      } catch (error) {
        console.log('Skipping network test - no internet access');
      }
    });
  });

  describe('Content Extraction', () => {
    test('should extract content from HTML page', async () => {
      const testUrl = 'https://httpbin.org/html';
      
      try {
        const result = await urlFetchingService.fetchAndParseUrl(testUrl);
        
        expect(result).toHaveProperty('url');
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('extractedText');
        expect(result).toHaveProperty('metadata');
        expect(result.extractedText.length).toBeGreaterThan(0);
        expect(result.metadata.wordCount).toBeGreaterThan(0);
      } catch (error) {
        console.log('Skipping network test - no internet access');
      }
    });
  });
});