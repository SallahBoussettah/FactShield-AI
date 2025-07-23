import { HfInference } from '@huggingface/inference';
import axios from 'axios';
import { logger } from '../utils/logger';
import { ExtractedClaim } from './claimExtractionService';

export interface FactCheckSource {
  url: string;
  title: string;
  reliability: number;
  domain: string;
  publishDate?: string;
  author?: string;
  relevanceScore: number;
  factCheckResult: 'supports' | 'contradicts' | 'neutral' | 'insufficient_evidence';
  excerpt?: string;
}

export interface CredibilityAssessment {
  overallScore: number; // 0-1, overall credibility
  confidence: number; // 0-1, confidence in the assessment
  factors: {
    sourceReliability: number;
    evidenceStrength: number;
    consensusLevel: number;
    recency: number;
    authorCredibility: number;
  };
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface FactCheckResult {
  claimId: string;
  originalClaim: string;
  credibilityScore: number;
  credibilityAssessment: CredibilityAssessment;
  sources: FactCheckSource[];
  verificationStatus: 'verified' | 'disputed' | 'unverified' | 'false';
  processingTime: number;
}

export interface FactCheckingOptions {
  maxSources?: number;
  minSourceReliability?: number;
  includeDisputedSources?: boolean;
  searchTimeout?: number;
  useRealTimeData?: boolean;
}

class FactCheckingService {
  private hf: HfInference;
  private readonly defaultOptions: Required<FactCheckingOptions> = {
    maxSources: 5,
    minSourceReliability: 0.6,
    includeDisputedSources: false,
    searchTimeout: 10000,
    useRealTimeData: true
  };

  // Trusted fact-checking domains with reliability scores
  private readonly trustedDomains = new Map([
    ['snopes.com', 0.95],
    ['factcheck.org', 0.93],
    ['politifact.com', 0.91],
    ['reuters.com', 0.89],
    ['apnews.com', 0.88],
    ['bbc.com', 0.87],
    ['npr.org', 0.86],
    ['cnn.com', 0.75],
    ['nytimes.com', 0.82],
    ['washingtonpost.com', 0.81],
    ['theguardian.com', 0.80],
    ['wikipedia.org', 0.70],
    ['scholar.google.com', 0.85],
    ['pubmed.ncbi.nlm.nih.gov', 0.92],
    ['nature.com', 0.94],
    ['science.org', 0.93]
  ]);

  // Models for different fact-checking tasks
  private readonly models = {
    textClassification: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
    questionAnswering: 'deepset/roberta-base-squad2',
    zeroShotClassification: 'facebook/bart-large-mnli',
    textSimilarity: 'sentence-transformers/all-MiniLM-L6-v2'
  };

  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    this.hf = new HfInference(apiKey);
  }

  /**
   * Search for sources related to a claim
   */
  private async searchForSources(claim: string, options: FactCheckingOptions): Promise<FactCheckSource[]> {
    const config = { ...this.defaultOptions, ...options };
    const sources: FactCheckSource[] = [];

    try {
      // In a real implementation, you would use search APIs like:
      // - Google Custom Search API
      // - Bing Search API
      // - Fact-checking specific APIs
      
      // For now, we'll simulate source discovery with some mock data
      const mockSources = await this.generateMockSources(claim, config.maxSources);
      
      // Filter sources by reliability
      const filteredSources = mockSources.filter(source => 
        source.reliability >= config.minSourceReliability
      );

      sources.push(...filteredSources);

      logger.info(`Found ${sources.length} sources for claim: ${claim.substring(0, 50)}...`);
      
      return sources;

    } catch (error) {
      logger.error('Source search failed:', error);
      return [];
    }
  }

  /**
   * Generate mock sources for demonstration
   * In production, this would be replaced with real search API calls
   */
  private async generateMockSources(claim: string, maxSources: number): Promise<FactCheckSource[]> {
    const sources: FactCheckSource[] = [];
    
    // Generate some realistic mock sources
    const mockSourceTemplates = [
      {
        domain: 'factcheck.org',
        title: 'Fact Check: Analysis of Climate Change Claims',
        reliability: 0.93,
        factCheckResult: 'supports' as const,
        relevanceScore: 0.85
      },
      {
        domain: 'snopes.com',
        title: 'Verification of Statistical Claims',
        reliability: 0.95,
        factCheckResult: 'neutral' as const,
        relevanceScore: 0.78
      },
      {
        domain: 'reuters.com',
        title: 'Reuters Fact Check Investigation',
        reliability: 0.89,
        factCheckResult: 'supports' as const,
        relevanceScore: 0.82
      },
      {
        domain: 'politifact.com',
        title: 'PolitiFact Truth-O-Meter Analysis',
        reliability: 0.91,
        factCheckResult: 'contradicts' as const,
        relevanceScore: 0.75
      }
    ];

    for (let i = 0; i < Math.min(maxSources, mockSourceTemplates.length); i++) {
      const template = mockSourceTemplates[i];
      sources.push({
        url: `https://${template.domain}/fact-check/${Date.now()}-${i}`,
        title: template.title,
        reliability: template.reliability,
        domain: template.domain,
        publishDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Fact Check Team',
        relevanceScore: template.relevanceScore,
        factCheckResult: template.factCheckResult,
        excerpt: `Relevant excerpt from ${template.domain} regarding the claim: "${claim.substring(0, 100)}..."`
      });
    }

    return sources;
  }

  /**
   * Assess the credibility of a claim using AI models
   */
  private async assessCredibility(
    claim: string, 
    sources: FactCheckSource[]
  ): Promise<CredibilityAssessment> {
    try {
      // Calculate source reliability factor
      const sourceReliability = sources.length > 0 
        ? sources.reduce((sum, source) => sum + source.reliability, 0) / sources.length
        : 0.3;

      // Calculate evidence strength based on source consensus
      const supportingSources = sources.filter(s => s.factCheckResult === 'supports').length;
      const contradictingSources = sources.filter(s => s.factCheckResult === 'contradicts').length;
      const totalSources = sources.length;
      
      let evidenceStrength = 0.5;
      if (totalSources > 0) {
        if (supportingSources > contradictingSources) {
          evidenceStrength = 0.7 + (supportingSources / totalSources) * 0.3;
        } else if (contradictingSources > supportingSources) {
          evidenceStrength = 0.3 - (contradictingSources / totalSources) * 0.3;
        }
      }

      // Calculate consensus level
      const consensusLevel = totalSources > 0 
        ? Math.max(supportingSources, contradictingSources) / totalSources
        : 0.3;

      // Calculate recency factor
      const recency = sources.length > 0
        ? sources.reduce((sum, source) => {
            if (!source.publishDate) return sum + 0.5;
            const daysSincePublish = (Date.now() - new Date(source.publishDate).getTime()) / (1000 * 60 * 60 * 24);
            return sum + Math.max(0.3, 1 - (daysSincePublish / 365)); // Decay over a year
          }, 0) / sources.length
        : 0.5;

      // Use AI to assess claim credibility
      let aiAssessment = 0.5;
      try {
        const classificationResult = await this.hf.zeroShotClassification({
          model: this.models.zeroShotClassification,
          inputs: claim,
          parameters: {
            candidate_labels: ['factual', 'misleading', 'false', 'opinion', 'unverifiable']
          }
        }) as any;

        const topLabel = classificationResult.labels?.[0] || 'unverifiable';
        const confidence = classificationResult.scores?.[0] || 0.5;

        if (topLabel === 'factual') {
          aiAssessment = 0.7 + confidence * 0.3;
        } else if (topLabel === 'misleading') {
          aiAssessment = 0.4 + confidence * 0.2;
        } else if (topLabel === 'false') {
          aiAssessment = 0.1 + confidence * 0.2;
        } else if (topLabel === 'opinion') {
          aiAssessment = 0.6; // Opinions are not false, but not factual
        } else {
          aiAssessment = 0.5; // Unverifiable
        }
      } catch (error) {
        logger.warn('AI credibility assessment failed:', error);
      }

      // Author credibility (simplified - would need real author verification)
      const authorCredibility = 0.7;

      // Calculate overall score
      const factors = {
        sourceReliability,
        evidenceStrength,
        consensusLevel,
        recency,
        authorCredibility
      };

      const overallScore = (
        sourceReliability * 0.3 +
        evidenceStrength * 0.25 +
        consensusLevel * 0.2 +
        recency * 0.1 +
        authorCredibility * 0.15
      );

      // Determine risk level
      let riskLevel: CredibilityAssessment['riskLevel'] = 'medium';
      if (overallScore >= 0.8) riskLevel = 'low';
      else if (overallScore >= 0.6) riskLevel = 'medium';
      else if (overallScore >= 0.4) riskLevel = 'high';
      else riskLevel = 'critical';

      // Generate reasoning
      const reasoning = this.generateCredibilityReasoning(factors, sources, overallScore);

      return {
        overallScore,
        confidence: Math.min(0.9, sourceReliability + consensusLevel * 0.3),
        factors,
        reasoning,
        riskLevel
      };

    } catch (error) {
      logger.error('Credibility assessment failed:', error);
      
      // Return default assessment
      return {
        overallScore: 0.5,
        confidence: 0.3,
        factors: {
          sourceReliability: 0.5,
          evidenceStrength: 0.5,
          consensusLevel: 0.5,
          recency: 0.5,
          authorCredibility: 0.5
        },
        reasoning: 'Unable to complete full credibility assessment due to technical limitations.',
        riskLevel: 'medium'
      };
    }
  }

  /**
   * Generate human-readable reasoning for credibility assessment
   */
  private generateCredibilityReasoning(
    factors: CredibilityAssessment['factors'],
    sources: FactCheckSource[],
    overallScore: number
  ): string {
    const reasons: string[] = [];

    if (factors.sourceReliability >= 0.8) {
      reasons.push('High-quality sources with strong reliability ratings');
    } else if (factors.sourceReliability >= 0.6) {
      reasons.push('Moderately reliable sources');
    } else {
      reasons.push('Limited reliable source verification');
    }

    if (factors.evidenceStrength >= 0.7) {
      reasons.push('Strong supporting evidence from multiple sources');
    } else if (factors.evidenceStrength <= 0.4) {
      reasons.push('Contradictory or weak evidence');
    }

    if (factors.consensusLevel >= 0.7) {
      reasons.push('High consensus among fact-checking sources');
    } else if (factors.consensusLevel <= 0.4) {
      reasons.push('Low consensus or conflicting information');
    }

    if (sources.length === 0) {
      reasons.push('No verifiable sources found');
    } else if (sources.length >= 3) {
      reasons.push(`Verified against ${sources.length} independent sources`);
    }

    const supportingCount = sources.filter(s => s.factCheckResult === 'supports').length;
    const contradictingCount = sources.filter(s => s.factCheckResult === 'contradicts').length;

    if (supportingCount > contradictingCount && supportingCount > 0) {
      reasons.push(`${supportingCount} sources support the claim`);
    } else if (contradictingCount > supportingCount && contradictingCount > 0) {
      reasons.push(`${contradictingCount} sources contradict the claim`);
    }

    return reasons.join('. ') + '.';
  }

  /**
   * Determine verification status based on credibility assessment
   */
  private determineVerificationStatus(assessment: CredibilityAssessment, sources: FactCheckSource[]): FactCheckResult['verificationStatus'] {
    const supportingCount = sources.filter(s => s.factCheckResult === 'supports').length;
    const contradictingCount = sources.filter(s => s.factCheckResult === 'contradicts').length;

    if (assessment.overallScore >= 0.8 && supportingCount > contradictingCount) {
      return 'verified';
    } else if (assessment.overallScore <= 0.3 || contradictingCount > supportingCount) {
      return 'false';
    } else if (assessment.overallScore >= 0.6) {
      return 'unverified';
    } else {
      return 'disputed';
    }
  }

  /**
   * Main fact-checking method
   */
  async factCheckClaim(
    claim: ExtractedClaim, 
    options: FactCheckingOptions = {}
  ): Promise<FactCheckResult> {
    const startTime = Date.now();
    
    try {
      logger.info(`Starting fact-check for claim: ${claim.text.substring(0, 50)}...`);

      // Search for relevant sources
      const sources = await this.searchForSources(claim.text, options);

      // Assess credibility
      const credibilityAssessment = await this.assessCredibility(claim.text, sources);

      // Determine verification status
      const verificationStatus = this.determineVerificationStatus(credibilityAssessment, sources);

      const processingTime = Date.now() - startTime;

      const result: FactCheckResult = {
        claimId: claim.id,
        originalClaim: claim.text,
        credibilityScore: credibilityAssessment.overallScore,
        credibilityAssessment,
        sources,
        verificationStatus,
        processingTime
      };

      logger.info(`Fact-check completed for claim ${claim.id}: ${verificationStatus} (${credibilityAssessment.overallScore.toFixed(2)} score) in ${processingTime}ms`);

      return result;

    } catch (error) {
      logger.error(`Fact-checking failed for claim ${claim.id}:`, error);
      
      // Return default result on error
      return {
        claimId: claim.id,
        originalClaim: claim.text,
        credibilityScore: 0.5,
        credibilityAssessment: {
          overallScore: 0.5,
          confidence: 0.3,
          factors: {
            sourceReliability: 0.5,
            evidenceStrength: 0.5,
            consensusLevel: 0.5,
            recency: 0.5,
            authorCredibility: 0.5
          },
          reasoning: 'Fact-checking process encountered technical difficulties.',
          riskLevel: 'medium'
        },
        sources: [],
        verificationStatus: 'unverified',
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Batch fact-check multiple claims
   */
  async factCheckClaims(
    claims: ExtractedClaim[], 
    options: FactCheckingOptions = {}
  ): Promise<FactCheckResult[]> {
    const results: FactCheckResult[] = [];
    
    logger.info(`Starting batch fact-check for ${claims.length} claims`);

    for (const claim of claims) {
      try {
        const result = await this.factCheckClaim(claim, options);
        results.push(result);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        logger.error(`Failed to fact-check claim ${claim.id}:`, error);
        
        // Add error result
        results.push({
          claimId: claim.id,
          originalClaim: claim.text,
          credibilityScore: 0.5,
          credibilityAssessment: {
            overallScore: 0.5,
            confidence: 0.3,
            factors: {
              sourceReliability: 0.5,
              evidenceStrength: 0.5,
              consensusLevel: 0.5,
              recency: 0.5,
              authorCredibility: 0.5
            },
            reasoning: 'Fact-checking failed due to technical error.',
            riskLevel: 'medium'
          },
          sources: [],
          verificationStatus: 'unverified',
          processingTime: 0
        });
      }
    }

    logger.info(`Batch fact-check completed: ${results.length} results`);
    return results;
  }

  /**
   * Get trusted domains list
   */
  getTrustedDomains(): Map<string, number> {
    return new Map(this.trustedDomains);
  }

  /**
   * Check if a domain is trusted
   */
  isDomainTrusted(domain: string): boolean {
    return this.trustedDomains.has(domain.toLowerCase());
  }

  /**
   * Get domain reliability score
   */
  getDomainReliability(domain: string): number {
    return this.trustedDomains.get(domain.toLowerCase()) || 0.5;
  }
}

export const factCheckingService = new FactCheckingService();