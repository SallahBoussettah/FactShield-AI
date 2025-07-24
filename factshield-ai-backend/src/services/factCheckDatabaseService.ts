import axios from 'axios';
import { logger } from '../utils/logger';

export interface FactCheckDatabase {
  name: string;
  url: string;
  apiKey?: string;
  reliability: number;
  searchEndpoint: string;
  rateLimit: number; // requests per minute
}

export interface FactCheckResult {
  claim: string;
  verdict: 'true' | 'false' | 'mixed' | 'unproven' | 'disputed';
  confidence: number;
  source: string;
  url: string;
  date: string;
  explanation: string;
}

export interface DatabaseSearchResult {
  database: string;
  results: FactCheckResult[];
  searchTime: number;
  success: boolean;
  error?: string;
}

class FactCheckDatabaseService {
  private databases: FactCheckDatabase[] = [
    {
      name: 'ClaimReview (Google)',
      url: 'https://factchecktools.googleapis.com',
      searchEndpoint: '/v1alpha1/claims:search',
      reliability: 0.90,
      rateLimit: 100
    },
    {
      name: 'PolitiFact API',
      url: 'https://www.politifact.com',
      searchEndpoint: '/api/statements/truth-o-meter/',
      reliability: 0.92,
      rateLimit: 60
    },
    {
      name: 'FactCheck.org',
      url: 'https://www.factcheck.org',
      searchEndpoint: '/api/search',
      reliability: 0.94,
      rateLimit: 30
    }
  ];

  private requestCounts = new Map<string, { count: number; resetTime: number }>();

  /**
   * Search multiple fact-checking databases for a claim
   */
  async searchFactCheckDatabases(claim: string): Promise<DatabaseSearchResult[]> {
    logger.info(`Searching fact-check databases for: ${claim.substring(0, 50)}...`);

    const searchPromises = this.databases.map(db => this.searchDatabase(db, claim));
    const results = await Promise.allSettled(searchPromises);

    return results.map((result, index) => {
      const database = this.databases[index];
      
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          database: database.name,
          results: [],
          searchTime: 0,
          success: false,
          error: result.reason?.message || 'Unknown error'
        };
      }
    });
  }

  /**
   * Search a specific fact-checking database
   */
  private async searchDatabase(database: FactCheckDatabase, claim: string): Promise<DatabaseSearchResult> {
    const startTime = Date.now();

    try {
      // Check rate limits
      if (!this.checkRateLimit(database)) {
        throw new Error(`Rate limit exceeded for ${database.name}`);
      }

      let results: FactCheckResult[] = [];

      switch (database.name) {
        case 'ClaimReview (Google)':
          results = await this.searchClaimReview(claim);
          break;
        case 'PolitiFact API':
          results = await this.searchPolitiFact(claim);
          break;
        case 'FactCheck.org':
          results = await this.searchFactCheckOrg(claim);
          break;
        default:
          throw new Error(`Unknown database: ${database.name}`);
      }

      return {
        database: database.name,
        results,
        searchTime: Date.now() - startTime,
        success: true
      };

    } catch (error) {
      logger.error(`Failed to search ${database.name}:`, error);
      
      return {
        database: database.name,
        results: [],
        searchTime: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Search Google's ClaimReview API
   */
  private async searchClaimReview(claim: string): Promise<FactCheckResult[]> {
    const apiKey = process.env.GOOGLE_FACTCHECK_API_KEY;
    if (!apiKey) {
      throw new Error('Google FactCheck API key not configured');
    }

    try {
      const response = await axios.get('https://factchecktools.googleapis.com/v1alpha1/claims:search', {
        params: {
          query: claim,
          key: apiKey,
          languageCode: 'en'
        },
        timeout: 10000
      });

      const results: FactCheckResult[] = [];

      if (response.data.claims) {
        for (const claimData of response.data.claims) {
          for (const review of claimData.claimReview || []) {
            results.push({
              claim: claimData.text || claim,
              verdict: this.normalizeVerdict(review.textualRating),
              confidence: this.calculateConfidence(review.textualRating),
              source: review.publisher?.name || 'Unknown',
              url: review.url || '',
              date: review.reviewDate || new Date().toISOString(),
              explanation: claimData.claimant || 'No explanation provided'
            });
          }
        }
      }

      return results;

    } catch (error) {
      logger.error('ClaimReview search failed:', error);
      return [];
    }
  }

  /**
   * Search PolitiFact (would need their API access)
   */
  private async searchPolitiFact(claim: string): Promise<FactCheckResult[]> {
    // Note: PolitiFact doesn't have a public API
    // This would require web scraping or special API access
    // For now, return empty results
    logger.warn('PolitiFact API not implemented - requires special access');
    return [];
  }

  /**
   * Search FactCheck.org (would need their API access)
   */
  private async searchFactCheckOrg(claim: string): Promise<FactCheckResult[]> {
    // Note: FactCheck.org doesn't have a public API
    // This would require web scraping or special API access
    // For now, return empty results
    logger.warn('FactCheck.org API not implemented - requires special access');
    return [];
  }

  /**
   * Normalize different verdict formats to standard format
   */
  private normalizeVerdict(textualRating: string): FactCheckResult['verdict'] {
    if (!textualRating) return 'unproven';

    const rating = textualRating.toLowerCase();

    if (rating.includes('true') || rating.includes('correct') || rating.includes('accurate')) {
      return 'true';
    }
    if (rating.includes('false') || rating.includes('incorrect') || rating.includes('wrong')) {
      return 'false';
    }
    if (rating.includes('mixed') || rating.includes('partly') || rating.includes('partially')) {
      return 'mixed';
    }
    if (rating.includes('disputed') || rating.includes('contested')) {
      return 'disputed';
    }

    return 'unproven';
  }

  /**
   * Calculate confidence based on verdict
   */
  private calculateConfidence(textualRating: string): number {
    if (!textualRating) return 0.5;

    const rating = textualRating.toLowerCase();

    if (rating.includes('pants on fire') || rating.includes('completely false')) {
      return 0.95;
    }
    if (rating.includes('false') || rating.includes('true')) {
      return 0.90;
    }
    if (rating.includes('mostly')) {
      return 0.80;
    }
    if (rating.includes('half') || rating.includes('mixed')) {
      return 0.70;
    }

    return 0.60;
  }

  /**
   * Check rate limits for a database
   */
  private checkRateLimit(database: FactCheckDatabase): boolean {
    const now = Date.now();
    const key = database.name;
    const current = this.requestCounts.get(key);

    if (!current || now > current.resetTime) {
      // Reset or initialize counter
      this.requestCounts.set(key, {
        count: 1,
        resetTime: now + (60 * 1000) // Reset after 1 minute
      });
      return true;
    }

    if (current.count >= database.rateLimit) {
      return false;
    }

    current.count++;
    return true;
  }

  /**
   * Get aggregated fact-check results with confidence scoring
   */
  async getAggregatedFactCheck(claim: string): Promise<{
    overallVerdict: FactCheckResult['verdict'];
    confidence: number;
    sources: FactCheckResult[];
    consensus: number;
  }> {
    const searchResults = await this.searchFactCheckDatabases(claim);
    const allResults: FactCheckResult[] = [];

    // Collect all successful results
    for (const dbResult of searchResults) {
      if (dbResult.success) {
        allResults.push(...dbResult.results);
      }
    }

    if (allResults.length === 0) {
      return {
        overallVerdict: 'unproven',
        confidence: 0.3,
        sources: [],
        consensus: 0
      };
    }

    // Calculate verdict consensus
    const verdictCounts = new Map<string, number>();
    let totalConfidence = 0;

    for (const result of allResults) {
      verdictCounts.set(result.verdict, (verdictCounts.get(result.verdict) || 0) + 1);
      totalConfidence += result.confidence;
    }

    // Find most common verdict
    const sortedVerdicts = Array.from(verdictCounts.entries())
      .sort((a, b) => b[1] - a[1]);

    const overallVerdict = sortedVerdicts[0][0] as FactCheckResult['verdict'];
    const consensus = sortedVerdicts[0][1] / allResults.length;
    const confidence = (totalConfidence / allResults.length) * consensus;

    return {
      overallVerdict,
      confidence,
      sources: allResults,
      consensus
    };
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    const testResults = await Promise.allSettled(
      this.databases.map(db => this.testDatabaseConnection(db))
    );

    const healthyCount = testResults.filter(result => result.status === 'fulfilled').length;
    const totalCount = this.databases.length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === totalCount) {
      status = 'healthy';
    } else if (healthyCount > 0) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      details: {
        availableDatabases: healthyCount,
        totalDatabases: totalCount,
        databases: this.databases.map((db, index) => ({
          name: db.name,
          status: testResults[index].status === 'fulfilled' ? 'online' : 'offline'
        }))
      }
    };
  }

  /**
   * Test connection to a database
   */
  private async testDatabaseConnection(database: FactCheckDatabase): Promise<boolean> {
    try {
      // Simple connectivity test - would be customized per database
      const response = await axios.head(database.url, { timeout: 5000 });
      return response.status < 400;
    } catch {
      return false;
    }
  }
}

export const factCheckDatabaseService = new FactCheckDatabaseService();