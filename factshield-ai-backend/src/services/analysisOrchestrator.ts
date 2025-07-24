import { logger } from '../utils/logger';
import { claimExtractionService, ExtractedClaim } from './claimExtractionService';
import { factCheckingService, FactCheckResult } from './factCheckingService';
import { sourceGenerationService, GeneratedSource } from './sourceGenerationService';
import { factCheckDatabaseService } from './factCheckDatabaseService';
import { geminiService } from './geminiService';
import { translationService } from './translationService';

export interface ComprehensiveAnalysisResult {
  analysisId: string;
  originalText: string;
  processedText: string;
  language: {
    detected: string;
    wasTranslated: boolean;
    confidence?: number;
  };
  claims: EnhancedClaim[];
  sources: VerifiedSource[];
  overallAssessment: {
    credibilityScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    reasoning: string;
  };
  metadata: {
    processingTime: number;
    servicesUsed: string[];
    claimsFound: number;
    sourcesVerified: number;
    databasesSearched: number;
  };
}

export interface EnhancedClaim extends ExtractedClaim {
  factCheckResult: FactCheckResult;
  databaseResults: any[];
  geminiAnalysis: any;
  finalVerdict: 'verified' | 'disputed' | 'unverified' | 'false';
  harmPotential: 'low' | 'medium' | 'high' | 'critical';
}

export interface VerifiedSource extends GeneratedSource {
  accessibilityChecked: boolean;
  contentRelevance: number;
  trustScore: number;
}

export interface AnalysisOptions {
  maxClaims?: number;
  minConfidence?: number;
  includeOpinions?: boolean;
  searchDatabases?: boolean;
  verifyUrls?: boolean;
  translateToEnglish?: boolean;
  deepAnalysis?: boolean;
}

class AnalysisOrchestrator {
  private readonly defaultOptions: Required<AnalysisOptions> = {
    maxClaims: 10,
    minConfidence: 0.6,
    includeOpinions: false,
    searchDatabases: true,
    verifyUrls: true,
    translateToEnglish: true,
    deepAnalysis: true
  };

  /**
   * Perform comprehensive analysis of text content
   */
  async analyzeContent(
    text: string,
    options: AnalysisOptions = {}
  ): Promise<ComprehensiveAnalysisResult> {
    const startTime = Date.now();
    const config = { ...this.defaultOptions, ...options };
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const servicesUsed: string[] = [];

    logger.info(`Starting comprehensive analysis ${analysisId} for ${text.length} characters`);

    try {
      // Step 1: Language detection and translation
      let processedText = text;
      let languageInfo = {
        detected: 'en',
        wasTranslated: false,
        confidence: undefined as number | undefined
      };

      if (config.translateToEnglish) {
        servicesUsed.push('translation');
        const translationResult = await translationService.prepareTextForAnalysis(text);
        processedText = translationResult.processedText;
        languageInfo = {
          detected: translationResult.originalLanguage,
          wasTranslated: translationResult.wasTranslated,
          confidence: translationResult.translationConfidence
        };
      }

      // Step 2: Extract claims from processed text
      servicesUsed.push('claimExtraction');
      const claimExtractionResult = await claimExtractionService.extractClaims(processedText, {
        maxClaims: config.maxClaims,
        minConfidence: config.minConfidence,
        includeOpinions: config.includeOpinions
      });

      if (claimExtractionResult.claims.length === 0) {
        return this.createEmptyResult(analysisId, text, processedText, languageInfo, servicesUsed, startTime);
      }

      // Step 3: Generate and verify sources for the entire content
      servicesUsed.push('sourceGeneration');
      const generatedSources = await sourceGenerationService.generateSources(processedText, {
        maxSources: 5,
        minReliability: 0.7
      });

      const verifiedSources: VerifiedSource[] = generatedSources.map(source => ({
        ...source,
        accessibilityChecked: source.verificationStatus === 'verified',
        contentRelevance: source.relevanceScore,
        trustScore: source.reliability
      }));

      // Step 4: Analyze each claim comprehensively
      const enhancedClaims: EnhancedClaim[] = [];

      for (const claim of claimExtractionResult.claims) {
        const enhancedClaim = await this.analyzeClaimComprehensively(
          claim,
          verifiedSources,
          config
        );
        enhancedClaims.push(enhancedClaim);
        servicesUsed.push('factChecking');

        if (config.searchDatabases) {
          servicesUsed.push('databaseSearch');
        }
        if (config.deepAnalysis) {
          servicesUsed.push('geminiAnalysis');
        }
      }

      // Step 5: Calculate overall assessment
      const overallAssessment = this.calculateOverallAssessment(enhancedClaims);

      const processingTime = Date.now() - startTime;

      const result: ComprehensiveAnalysisResult = {
        analysisId,
        originalText: text,
        processedText,
        language: languageInfo,
        claims: enhancedClaims,
        sources: verifiedSources,
        overallAssessment,
        metadata: {
          processingTime,
          servicesUsed: Array.from(new Set(servicesUsed)),
          claimsFound: enhancedClaims.length,
          sourcesVerified: verifiedSources.filter(s => s.accessibilityChecked).length,
          databasesSearched: config.searchDatabases ? 3 : 0
        }
      };

      logger.info(`Comprehensive analysis ${analysisId} completed in ${processingTime}ms`);
      return result;

    } catch (error) {
      logger.error(`Comprehensive analysis ${analysisId} failed:`, error);
      throw error;
    }
  }

  /**
   * Analyze a single claim comprehensively
   */
  private async analyzeClaimComprehensively(
    claim: ExtractedClaim,
    sources: VerifiedSource[],
    config: AnalysisOptions
  ): Promise<EnhancedClaim> {
    logger.info(`Analyzing claim: ${claim.text.substring(0, 50)}...`);

    // Fact-check using our service
    const factCheckResult = await factCheckingService.factCheck(claim, {
      maxSources: 0, // Use shared sources
      minSourceReliability: 0.7
    }, sources);

    // Search fact-checking databases if enabled
    let databaseResults: any[] = [];
    if (config.searchDatabases) {
      try {
        const dbSearchResults = await factCheckDatabaseService.searchFactCheckDatabases(claim.text);
        databaseResults = dbSearchResults.filter(result => result.success);
      } catch (error) {
        logger.warn('Database search failed for claim:', error);
      }
    }

    // Get Gemini analysis if enabled
    let geminiAnalysis: any = null;
    if (config.deepAnalysis && geminiService.isAvailable()) {
      try {
        geminiAnalysis = await geminiService.analyzeClaim(claim.text);
      } catch (error) {
        logger.warn('Gemini analysis failed for claim:', error);
      }
    }

    // Determine final verdict and harm potential
    const finalVerdict = this.determineFinalVerdict(factCheckResult, databaseResults, geminiAnalysis);
    const harmPotential = this.assessHarmPotential(claim, factCheckResult, geminiAnalysis);

    return {
      ...claim,
      factCheckResult,
      databaseResults,
      geminiAnalysis,
      finalVerdict,
      harmPotential
    };
  }

  /**
   * Determine final verdict based on all available information
   */
  private determineFinalVerdict(
    factCheckResult: FactCheckResult,
    databaseResults: any[],
    geminiAnalysis: any
  ): EnhancedClaim['finalVerdict'] {
    // Start with our fact-checking service result
    let verdict = factCheckResult.verificationStatus;

    // Consider database results if available
    if (databaseResults.length > 0) {
      const dbVerdicts = databaseResults.flatMap(db => db.results.map((r: any) => r.verdict));
      const falseCount = dbVerdicts.filter((v: string) => v === 'false').length;
      const trueCount = dbVerdicts.filter((v: string) => v === 'true').length;

      if (falseCount > trueCount && falseCount > 0) {
        verdict = 'false';
      } else if (trueCount > falseCount && trueCount > 0) {
        verdict = 'verified';
      }
    }

    // Consider Gemini analysis
    if (geminiAnalysis) {
      if (geminiAnalysis.credibilityScore < 0.3) {
        verdict = 'false';
      } else if (geminiAnalysis.credibilityScore > 0.8) {
        verdict = 'verified';
      }
    }

    return verdict;
  }

  /**
   * Assess harm potential of a claim
   */
  private assessHarmPotential(
    claim: ExtractedClaim,
    factCheckResult: FactCheckResult,
    geminiAnalysis: any
  ): EnhancedClaim['harmPotential'] {
    // Start with Gemini's risk assessment if available
    if (geminiAnalysis && geminiAnalysis.riskLevel) {
      return geminiAnalysis.riskLevel;
    }

    // Use fact-checking service assessment
    if (factCheckResult.credibilityAssessment.riskLevel) {
      return factCheckResult.credibilityAssessment.riskLevel;
    }

    // Fallback based on category and credibility
    if (claim.category === 'factual' && factCheckResult.credibilityScore < 0.3) {
      return 'high';
    }

    return 'medium';
  }

  /**
   * Calculate overall assessment for all claims
   */
  private calculateOverallAssessment(claims: EnhancedClaim[]): ComprehensiveAnalysisResult['overallAssessment'] {
    if (claims.length === 0) {
      return {
        credibilityScore: 0.5,
        riskLevel: 'low',
        confidence: 0.3,
        reasoning: 'No claims found to analyze'
      };
    }

    // Calculate weighted averages
    const totalCredibility = claims.reduce((sum, claim) => sum + claim.factCheckResult.credibilityScore, 0);
    const avgCredibility = totalCredibility / claims.length;

    const totalConfidence = claims.reduce((sum, claim) => {
      return sum + (claim.geminiAnalysis?.confidence || claim.factCheckResult.credibilityAssessment.confidence);
    }, 0);
    const avgConfidence = totalConfidence / claims.length;

    // Determine overall risk level
    const riskLevels = claims.map(claim => claim.harmPotential);
    const criticalCount = riskLevels.filter(r => r === 'critical').length;
    const highCount = riskLevels.filter(r => r === 'high').length;

    let overallRisk: 'low' | 'medium' | 'high' | 'critical';
    if (criticalCount > 0) {
      overallRisk = 'critical';
    } else if (highCount > 0) {
      overallRisk = 'high';
    } else if (avgCredibility < 0.5) {
      overallRisk = 'medium';
    } else {
      overallRisk = 'low';
    }

    // Generate reasoning
    const falseClaimsCount = claims.filter(c => c.finalVerdict === 'false').length;
    const verifiedClaimsCount = claims.filter(c => c.finalVerdict === 'verified').length;

    let reasoning = `Analysis of ${claims.length} claims: `;
    if (falseClaimsCount > 0) {
      reasoning += `${falseClaimsCount} false claims detected. `;
    }
    if (verifiedClaimsCount > 0) {
      reasoning += `${verifiedClaimsCount} claims verified. `;
    }
    reasoning += `Overall credibility: ${Math.round(avgCredibility * 100)}%. Risk level: ${overallRisk}.`;

    return {
      credibilityScore: avgCredibility,
      riskLevel: overallRisk,
      confidence: avgConfidence,
      reasoning
    };
  }

  /**
   * Create empty result when no claims are found
   */
  private createEmptyResult(
    analysisId: string,
    originalText: string,
    processedText: string,
    languageInfo: any,
    servicesUsed: string[],
    startTime: number
  ): ComprehensiveAnalysisResult {
    return {
      analysisId,
      originalText,
      processedText,
      language: languageInfo,
      claims: [],
      sources: [],
      overallAssessment: {
        credibilityScore: 0.5,
        riskLevel: 'low',
        confidence: 0.3,
        reasoning: 'No factual claims found to analyze'
      },
      metadata: {
        processingTime: Date.now() - startTime,
        servicesUsed,
        claimsFound: 0,
        sourcesVerified: 0,
        databasesSearched: 0
      }
    };
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    const services = [
      { name: 'claimExtraction', service: claimExtractionService },
      { name: 'factChecking', service: factCheckingService },
      { name: 'gemini', service: geminiService },
      { name: 'factCheckDatabase', service: factCheckDatabaseService }
    ];

    const healthChecks = await Promise.allSettled(
      services.map(({ service }) => service.getHealthStatus())
    );

    const healthyCount = healthChecks.filter(result => 
      result.status === 'fulfilled' && result.value.status === 'healthy'
    ).length;

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === services.length) {
      overallStatus = 'healthy';
    } else if (healthyCount > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'unhealthy';
    }

    return {
      status: overallStatus,
      details: {
        services: services.map((service, index) => ({
          name: service.name,
          status: healthChecks[index].status === 'fulfilled' ? 
            (healthChecks[index] as any).value.status : 'unhealthy'
        })),
        healthyServices: healthyCount,
        totalServices: services.length
      }
    };
  }
}

export const analysisOrchestrator = new AnalysisOrchestrator();