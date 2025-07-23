import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import { logger } from '../utils/logger';

export interface UrlMetadata {
  title: string;
  description?: string;
  author?: string;
  publishDate?: string;
  domain: string;
  wordCount: number;
  language?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface UrlContent {
  url: string;
  title: string;
  extractedText: string;
  metadata: UrlMetadata;
  rawHtml: string;
}

export interface UrlFetchOptions {
  timeout?: number;
  followRedirects?: boolean;
  maxRedirects?: number;
  userAgent?: string;
  maxContentLength?: number;
}

class UrlFetchingService {
  private readonly defaultOptions: Required<UrlFetchOptions> = {
    timeout: 30000, // 30 seconds
    followRedirects: true,
    maxRedirects: 5,
    userAgent: 'FactShield-AI/1.0 (Content Analysis Bot)',
    maxContentLength: 10 * 1024 * 1024 // 10MB
  };

  /**
   * Validate URL format and accessibility
   */
  private validateUrl(url: string): void {
    try {
      const urlObj = new URL(url);
      
      // Check protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('URL must use HTTP or HTTPS protocol');
      }

      // Check for localhost/private IPs in production
      if (process.env.NODE_ENV === 'production') {
        const hostname = urlObj.hostname.toLowerCase();
        if (
          hostname === 'localhost' ||
          hostname.startsWith('127.') ||
          hostname.startsWith('192.168.') ||
          hostname.startsWith('10.') ||
          hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
        ) {
          throw new Error('Private/local URLs are not allowed');
        }
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Invalid URL format');
      }
      throw error;
    }
  }

  /**
   * Fetch HTML content from URL
   */
  private async fetchHtmlContent(url: string, options: UrlFetchOptions = {}): Promise<{ html: string; finalUrl: string }> {
    const config = { ...this.defaultOptions, ...options };
    
    try {
      const response: AxiosResponse<string> = await axios.get(url, {
        timeout: config.timeout,
        maxRedirects: config.followRedirects ? config.maxRedirects : 0,
        headers: {
          'User-Agent': config.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        maxContentLength: config.maxContentLength,
        validateStatus: (status) => status >= 200 && status < 400
      });

      // Check content type
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
        throw new Error(`Unsupported content type: ${contentType}`);
      }

      return {
        html: response.data,
        finalUrl: response.request.res.responseUrl || url
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout - URL took too long to respond');
        }
        if (error.response) {
          throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
        }
        if (error.request) {
          throw new Error('Network error - unable to reach URL');
        }
      }
      throw new Error(`Failed to fetch URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract metadata from HTML
   */
  private extractMetadata(html: string, url: string): UrlMetadata {
    const $ = cheerio.load(html);
    const urlObj = new URL(url);

    // Extract title
    let title = $('title').first().text().trim();
    if (!title) {
      title = $('meta[property="og:title"]').attr('content') || 
               $('meta[name="twitter:title"]').attr('content') || 
               'Untitled';
    }

    // Extract description
    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') ||
                       $('meta[name="twitter:description"]').attr('content');

    // Extract author
    const author = $('meta[name="author"]').attr('content') ||
                  $('meta[property="article:author"]').attr('content') ||
                  $('[rel="author"]').text().trim();

    // Extract publish date
    const publishDate = $('meta[property="article:published_time"]').attr('content') ||
                       $('meta[name="date"]').attr('content') ||
                       $('time[datetime]').attr('datetime') ||
                       $('meta[property="article:modified_time"]').attr('content');

    // Extract language
    const language = $('html').attr('lang') ||
                    $('meta[http-equiv="content-language"]').attr('content') ||
                    $('meta[name="language"]').attr('content');

    // Extract keywords
    const keywordsContent = $('meta[name="keywords"]').attr('content');
    const keywords = keywordsContent ? 
      keywordsContent.split(',').map(k => k.trim()).filter(k => k.length > 0) : 
      [];

    // Extract canonical URL
    const canonicalUrl = $('link[rel="canonical"]').attr('href');

    // Calculate word count from extracted text
    const textContent = this.extractTextContent($);
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;

    return {
      title: title.substring(0, 200), // Limit title length
      description: description?.substring(0, 500), // Limit description length
      author: author?.substring(0, 100),
      publishDate,
      domain: urlObj.hostname,
      wordCount,
      language,
      keywords: keywords.slice(0, 20), // Limit keywords
      canonicalUrl
    };
  }

  /**
   * Extract clean text content from HTML
   */
  private extractTextContent($: any): string {
    // Remove script and style elements
    $('script, style, nav, header, footer, aside, .advertisement, .ads, .social-share').remove();
    
    // Focus on main content areas
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      'main',
      '.main-content'
    ];

    let extractedText = '';
    
    // Try to find main content area
    for (const selector of contentSelectors) {
      const content = $(selector).first();
      if (content.length > 0) {
        extractedText = content.text();
        break;
      }
    }

    // Fallback to body if no main content found
    if (!extractedText.trim()) {
      extractedText = $('body').text();
    }

    // Clean up the text
    return extractedText
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();
  }

  /**
   * Main method to fetch and parse URL content
   */
  async fetchAndParseUrl(url: string, options: UrlFetchOptions = {}): Promise<UrlContent> {
    logger.info(`Fetching URL: ${url}`);
    
    try {
      // Validate URL
      this.validateUrl(url);

      // Fetch HTML content
      const { html, finalUrl } = await this.fetchHtmlContent(url, options);
      
      // Parse HTML
      const $ = cheerio.load(html);
      
      // Extract metadata
      const metadata = this.extractMetadata(html, finalUrl);
      
      // Extract text content
      const extractedText = this.extractTextContent($);

      if (extractedText.length < 100) {
        throw new Error('Insufficient content found - page may be empty or require JavaScript');
      }

      const result: UrlContent = {
        url: finalUrl,
        title: metadata.title,
        extractedText,
        metadata,
        rawHtml: html
      };

      logger.info(`Successfully parsed URL: ${finalUrl}, extracted ${extractedText.length} characters`);
      return result;

    } catch (error) {
      logger.error(`Failed to fetch and parse URL ${url}:`, error);
      throw error;
    }
  }

  /**
   * Batch fetch multiple URLs
   */
  async fetchMultipleUrls(urls: string[], options: UrlFetchOptions = {}): Promise<(UrlContent | Error)[]> {
    const promises = urls.map(async (url) => {
      try {
        return await this.fetchAndParseUrl(url, options);
      } catch (error) {
        return error instanceof Error ? error : new Error(`Failed to fetch ${url}`);
      }
    });

    return Promise.all(promises);
  }

  /**
   * Check if URL is accessible without fetching full content
   */
  async checkUrlAccessibility(url: string, options: UrlFetchOptions = {}): Promise<{ accessible: boolean; status?: number; error?: string }> {
    try {
      this.validateUrl(url);
      
      const config = { ...this.defaultOptions, ...options };
      const response = await axios.head(url, {
        timeout: config.timeout,
        maxRedirects: config.followRedirects ? config.maxRedirects : 0,
        headers: {
          'User-Agent': config.userAgent
        },
        validateStatus: (status) => status >= 200 && status < 500
      });

      return {
        accessible: response.status >= 200 && response.status < 400,
        status: response.status
      };
    } catch (error) {
      return {
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const urlFetchingService = new UrlFetchingService();