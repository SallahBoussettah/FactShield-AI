import { logger } from '../utils/logger';
import { geminiService } from './geminiService';
import axios from 'axios';

export interface GeneratedSource {
  url: string;
  title: string;
  reliability: number;
  domain: string;
  publishDate?: string;
  author?: string;
  relevanceScore: number;
  factCheckResult: 'supports' | 'contradicts' | 'neutral' | 'insufficient_evidence';
  excerpt?: string;
  sourceType: 'fact_check' | 'news' | 'academic' | 'government' | 'reference';
  verificationStatus: 'verified' | 'unverified' | 'failed';
}

export interface SourceGenerationOptions {
  maxSources?: number;
  minReliability?: number;
  includeDisputedSources?: boolean;
  preferredDomains?: string[];
}

// Curated list of reliable fact-checking and news sources
const RELIABLE_SOURCES = {
  factChecking: [
    { domain: 'snopes.com', reliability: 0.95, type: 'fact_check' },
    { domain: 'factcheck.org', reliability: 0.94, type: 'fact_check' },
    { domain: 'politifact.com', reliability: 0.92, type: 'fact_check' },
    { domain: 'reuters.com', reliability: 0.93, type: 'news' },
    { domain: 'apnews.com', reliability: 0.94, type: 'news' },
    { domain: 'bbc.com', reliability: 0.91, type: 'news' },
    { domain: 'npr.org', reliability: 0.90, type: 'news' }
  ],
  academic: [
    { domain: 'pubmed.ncbi.nlm.nih.gov', reliability: 0.96, type: 'academic' },
    { domain: 'scholar.google.com', reliability: 0.88, type: 'academic' },
    { domain: 'jstor.org', reliability: 0.94, type: 'academic' }
  ],
  government: [
    { domain: 'cdc.gov', reliability: 0.95, type: 'government' },
    { domain: 'who.int', reliability: 0.94, type: 'government' },
    { domain: 'fda.gov', reliability: 0.93, type: 'government' },
    { domain: 'nih.gov', reliability: 0.95, type: 'government' }
  ],
  reference: [
    { domain: 'wikipedia.org', reliability: 0.82, type: 'reference' },
    { domain: 'britannica.com', reliability: 0.89, type: 'reference' }
  ]
};

class SourceGenerationService {
  private newsApiKey: string | undefined;
  
  constructor() {
    this.newsApiKey = process.env.NEWS_API_KEY;
  }

  /**
   * Generate sources using multiple real APIs and verification
   */
  async generateSources(
    fullContent: string, 
    options: SourceGenerationOptions = {}
  ): Promise<GeneratedSource[]> {
    const config = {
      maxSources: 3,
      minReliability: 0.7,
      includeDisputedSources: false,
      ...options
    };

    try {
      logger.info(`Generating verified sources for content: ${fullContent.substring(0, 50)}...`);

      // Extract key topics and entities from content
      const topics = await this.extractTopicsFromContent(fullContent);
      
      // Search for sources using multiple strategies
      const sources = await Promise.all([
        this.searchFactCheckingSites(topics, config),
        this.searchNewsAPIs(topics, config),
        this.searchAcademicSources(topics, config)
      ]);

      // Flatten and deduplicate sources
      const allSources = sources.flat();
      const uniqueSources = this.deduplicateSources(allSources);
      
      // Verify URLs actually exist
      const verifiedSources = await this.verifySourceUrls(uniqueSources);
      
      // Sort by reliability and relevance
      const sortedSources = verifiedSources
        .filter(source => source.verificationStatus === 'verified')
        .sort((a, b) => (b.reliability * b.relevanceScore) - (a.reliability * a.relevanceScore))
        .slice(0, config.maxSources);

      logger.info(`Generated ${sortedSources.length} verified sources`);
      return sortedSources;
        
    } catch (error) {
      logger.error('Source generation failed:', error);
      return [];
    }
  }



  /**
   * Extract key topics and entities from content using Gemini
   */
  private async extractTopicsFromContent(content: string): Promise<string[]> {
    if (!geminiService.isAvailable()) {
      // Fallback to simple keyword extraction
      return this.extractKeywordsSimple(content);
    }

    try {
      const prompt = `
Extract the main topics, entities, and key concepts from this content for fact-checking research:

"${content.substring(0, 2000)}"

Return a JSON array of 5-10 key search terms that would be useful for finding relevant fact-checking sources:

{
  "topics": ["topic1", "topic2", "topic3", ...]
}

Focus on:
- Specific claims that can be fact-checked
- Named entities (people, organizations, places)
- Scientific or statistical claims
- Current events or news topics
- Controversial or disputed topics

Respond with valid JSON only.
`;

      const result = await geminiService.generateSources(prompt);
      if (result && result.topics && Array.isArray(result.topics)) {
        return result.topics.slice(0, 10);
      }
    } catch (error) {
      logger.warn('Gemini topic extraction failed:', error);
    }

    return this.extractKeywordsSimple(content);
  }

  /**
   * Simple keyword extraction fallback
   */
  private extractKeywordsSimple(content: string): string[] {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Search fact-checking websites using their APIs or search
   */
  private async searchFactCheckingSites(topics: string[], config: SourceGenerationOptions): Promise<GeneratedSource[]> {
    const sources: GeneratedSource[] = [];
    
    for (const topic of topics.slice(0, 3)) {
      try {
        // Search Snopes
        const snopesResults = await this.searchSnopes(topic);
        sources.push(...snopesResults);

        // Search FactCheck.org
        const factCheckResults = await this.searchFactCheckOrg(topic);
        sources.push(...factCheckResults);

        // Search PolitiFact
        const politiFactResults = await this.searchPolitiFact(topic);
        sources.push(...politiFactResults);

      } catch (error) {
        logger.warn(`Failed to search fact-checking sites for topic: ${topic}`, error);
      }
    }

    return sources.slice(0, config.maxSources || 3);
  }

  /**
   * Search news APIs for relevant articles
   */
  private async searchNewsAPIs(topics: string[], config: SourceGenerationOptions): Promise<GeneratedSource[]> {
    if (!this.newsApiKey) {
      logger.warn('News API key not configured');
      return [];
    }

    const sources: GeneratedSource[] = [];
    
    for (const topic of topics.slice(0, 2)) {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: topic,
            apiKey: this.newsApiKey,
            sortBy: 'relevancy',
            pageSize: 5,
            language: 'en',
            domains: 'reuters.com,apnews.com,bbc.com,npr.org'
          },
          timeout: 10000
        });

        if (response.data.articles) {
          for (const article of response.data.articles.slice(0, 2)) {
            const domain = new URL(article.url).hostname;
            const sourceInfo = RELIABLE_SOURCES.factChecking.find(s => s.domain === domain) ||
                             { reliability: 0.85, type: 'news' };

            sources.push({
              url: article.url,
              title: article.title,
              reliability: sourceInfo.reliability,
              domain,
              publishDate: article.publishedAt,
              author: article.author,
              relevanceScore: 0.8,
              factCheckResult: 'neutral',
              excerpt: article.description,
              sourceType: sourceInfo.type as any,
              verificationStatus: 'unverified'
            });
          }
        }
      } catch (error) {
        logger.warn(`News API search failed for topic: ${topic}`, error);
      }
    }

    return sources;
  }

  /**
   * Search academic sources
   */
  private async searchAcademicSources(topics: string[], config: SourceGenerationOptions): Promise<GeneratedSource[]> {
    // For now, return curated academic sources based on topics
    // In production, integrate with PubMed API, Google Scholar API, etc.
    const sources: GeneratedSource[] = [];
    
    for (const topic of topics.slice(0, 1)) {
      if (this.isHealthRelated(topic)) {
        sources.push({
          url: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(topic)}`,
          title: `PubMed search results for: ${topic}`,
          reliability: 0.96,
          domain: 'pubmed.ncbi.nlm.nih.gov',
          relevanceScore: 0.9,
          factCheckResult: 'neutral',
          excerpt: `Academic research related to ${topic}`,
          sourceType: 'academic',
          verificationStatus: 'unverified'
        });
      }
    }

    return sources;
  }

  /**
   * Search Snopes fact-checking site
   */
  private async searchSnopes(topic: string): Promise<GeneratedSource[]> {
    // Note: Snopes doesn't have a public API, so this would need web scraping
    // For now, return a search URL that we know exists
    return [{
      url: `https://www.snopes.com/search/${encodeURIComponent(topic)}/`,
      title: `Snopes fact-check search: ${topic}`,
      reliability: 0.95,
      domain: 'snopes.com',
      relevanceScore: 0.85,
      factCheckResult: 'neutral',
      excerpt: `Fact-checking information about ${topic}`,
      sourceType: 'fact_check',
      verificationStatus: 'unverified'
    }];
  }

  /**
   * Search FactCheck.org
   */
  private async searchFactCheckOrg(topic: string): Promise<GeneratedSource[]> {
    return [{
      url: `https://www.factcheck.org/?s=${encodeURIComponent(topic)}`,
      title: `FactCheck.org search: ${topic}`,
      reliability: 0.94,
      domain: 'factcheck.org',
      relevanceScore: 0.85,
      factCheckResult: 'neutral',
      excerpt: `Fact-checking analysis of ${topic}`,
      sourceType: 'fact_check',
      verificationStatus: 'unverified'
    }];
  }

  /**
   * Search PolitiFact
   */
  private async searchPolitiFact(topic: string): Promise<GeneratedSource[]> {
    return [{
      url: `https://www.politifact.com/search/?q=${encodeURIComponent(topic)}`,
      title: `PolitiFact search: ${topic}`,
      reliability: 0.92,
      domain: 'politifact.com',
      relevanceScore: 0.85,
      factCheckResult: 'neutral',
      excerpt: `Political fact-checking of ${topic}`,
      sourceType: 'fact_check',
      verificationStatus: 'unverified'
    }];
  }

  /**
   * Verify that URLs actually exist and are accessible
   */
  private async verifySourceUrls(sources: GeneratedSource[]): Promise<GeneratedSource[]> {
    const verifiedSources: GeneratedSource[] = [];

    for (const source of sources) {
      try {
        const response = await axios.head(source.url, {
          timeout: 5000,
          validateStatus: (status) => status >= 200 && status < 400
        });

        verifiedSources.push({
          ...source,
          verificationStatus: 'verified'
        });

        logger.info(`Verified source: ${source.url} (${response.status})`);
      } catch (error) {
        logger.warn(`Failed to verify source: ${source.url}`, { message: error instanceof Error ? error.message : String(error) });
        verifiedSources.push({
          ...source,
          verificationStatus: 'failed'
        });
      }

      // Add delay to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return verifiedSources;
  }

  /**
   * Remove duplicate sources based on URL and domain
   */
  private deduplicateSources(sources: GeneratedSource[]): GeneratedSource[] {
    const seen = new Set<string>();
    const unique: GeneratedSource[] = [];

    for (const source of sources) {
      const key = `${source.domain}:${source.title}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(source);
      }
    }

    return unique;
  }

  /**
   * Check if topic is health-related
   */
  private isHealthRelated(topic: string): boolean {
    const healthKeywords = [
      'vaccine', 'covid', 'medicine', 'drug', 'disease', 'health',
      'medical', 'treatment', 'symptom', 'virus', 'bacteria'
    ];
    
    return healthKeywords.some(keyword => 
      topic.toLowerCase().includes(keyword)
    );
  }
}

export const sourceGenerationService = new SourceGenerationService();