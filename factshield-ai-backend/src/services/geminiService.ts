import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

export interface GeminiAnalysisResult {
  isFactual: boolean;
  credibilityScore: number; // 0-1
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  reasoning: string;
  confidence: number;
  suggestedSources: string[];
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      logger.warn('Gemini API key not configured. Using fallback analysis.');
      this.genAI = null as any;
      this.model = null;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }
  }

  /**
   * Analyze a claim using Gemini AI with improved prompting
   */
  async analyzeClaim(claim: string): Promise<GeminiAnalysisResult> {
    if (!this.model) {
      return this.getFallbackAnalysis(claim);
    }

    try {
      const prompt = `
You are a professional fact-checker with expertise in identifying misinformation. Analyze this claim:

CLAIM: "${claim}"

ANALYSIS REQUIREMENTS:
1. Assess factual accuracy based on established knowledge
2. Consider potential harm if the claim is false
3. Evaluate the claim's verifiability
4. Identify the subject domain

RESPONSE FORMAT (JSON only):
{
  "isFactual": boolean,
  "credibilityScore": number,
  "riskLevel": "low" | "medium" | "high" | "critical",
  "category": "health" | "science" | "politics" | "conspiracy" | "general",
  "reasoning": "detailed explanation",
  "confidence": number,
  "suggestedSources": []
}

SCORING GUIDELINES:
- credibilityScore: 0.0-1.0 (0=completely false, 1=completely true)
- confidence: 0.0-1.0 (your certainty in this assessment)
- riskLevel: 
  * critical: dangerous health/safety misinformation
  * high: harmful false claims that could cause significant damage
  * medium: misleading but not immediately dangerous
  * low: minor inaccuracies or unverifiable claims

IMPORTANT:
- Base analysis on factual knowledge, not speculation
- If uncertain, reflect that in lower confidence scores
- Provide specific reasoning for your assessment
- Leave suggestedSources empty (handled separately)

Return ONLY valid JSON, no additional text or formatting.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Enhanced JSON extraction and validation
      const analysis = this.extractAndValidateJSON(text);
      
      if (!analysis) {
        logger.warn('Failed to extract valid JSON from Gemini response');
        return this.getFallbackAnalysis(claim);
      }

      // Additional validation and normalization
      const normalizedAnalysis = this.normalizeAnalysis(analysis);

      logger.info(`Gemini analysis completed for claim: ${claim.substring(0, 50)}... (score: ${normalizedAnalysis.credibilityScore}, risk: ${normalizedAnalysis.riskLevel})`);
      return normalizedAnalysis;

    } catch (error) {
      logger.error('Gemini analysis failed:', error);
      return this.getFallbackAnalysis(claim);
    }
  }

  /**
   * Extract and validate JSON from Gemini response
   */
  private extractAndValidateJSON(text: string): any | null {
    try {
      // Clean up the response text
      let cleanText = text.trim();
      
      // Remove markdown code blocks
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Extract JSON object
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }
      
      // Parse JSON
      const parsed = JSON.parse(cleanText);
      
      // Validate structure
      if (this.isValidAnalysis(parsed)) {
        return parsed;
      }
      
      return null;
    } catch (error) {
      logger.warn('JSON parsing failed:', error);
      return null;
    }
  }

  /**
   * Normalize and validate analysis results
   */
  private normalizeAnalysis(analysis: any): GeminiAnalysisResult {
    return {
      isFactual: Boolean(analysis.isFactual),
      credibilityScore: Math.max(0, Math.min(1, Number(analysis.credibilityScore) || 0.5)),
      riskLevel: this.validateRiskLevel(analysis.riskLevel),
      category: this.validateCategory(analysis.category),
      reasoning: String(analysis.reasoning || 'No reasoning provided'),
      confidence: Math.max(0, Math.min(1, Number(analysis.confidence) || 0.5)),
      suggestedSources: Array.isArray(analysis.suggestedSources) ? analysis.suggestedSources : []
    };
  }

  /**
   * Validate risk level
   */
  private validateRiskLevel(riskLevel: any): GeminiAnalysisResult['riskLevel'] {
    const validLevels: GeminiAnalysisResult['riskLevel'][] = ['low', 'medium', 'high', 'critical'];
    return validLevels.includes(riskLevel) ? riskLevel : 'medium';
  }

  /**
   * Validate category
   */
  private validateCategory(category: any): string {
    const validCategories = ['health', 'science', 'politics', 'conspiracy', 'general'];
    return validCategories.includes(category) ? category : 'general';
  }

  /**
   * Validate the analysis response structure
   */
  private isValidAnalysis(analysis: any): boolean {
    return (
      typeof analysis === 'object' &&
      typeof analysis.isFactual === 'boolean' &&
      typeof analysis.credibilityScore === 'number' &&
      typeof analysis.riskLevel === 'string' &&
      typeof analysis.category === 'string' &&
      typeof analysis.reasoning === 'string' &&
      typeof analysis.confidence === 'number' &&
      Array.isArray(analysis.suggestedSources) &&
      analysis.credibilityScore >= 0 && analysis.credibilityScore <= 1 &&
      analysis.confidence >= 0 && analysis.confidence <= 1 &&
      ['low', 'medium', 'high', 'critical'].includes(analysis.riskLevel)
    );
  }

  /**
   * Generate fallback analysis when Gemini is unavailable
   */
  private getFallbackAnalysis(_claim: string): GeminiAnalysisResult {
    // When Gemini is unavailable, return a neutral analysis without hardcoded assumptions
    return {
      isFactual: false,
      credibilityScore: 0.50,
      riskLevel: 'medium',
      category: 'general',
      reasoning: 'Unable to analyze claim - Gemini AI service is currently unavailable. Please try again later.',
      confidence: 0.10, // Very low confidence when service is unavailable
      suggestedSources: [] // No hardcoded sources
    };
  }

  /**
   * Generate sources using Gemini AI
   */
  async generateSources(prompt: string): Promise<any> {
    if (!this.model) {
      return null;
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up the response text (remove markdown code blocks if present)
      let cleanText = text.trim();
      
      // Remove markdown code blocks
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Remove any trailing text after the JSON
      const jsonMatch = cleanText.match(/^(\{[\s\S]*\})/);
      if (jsonMatch) {
        cleanText = jsonMatch[1];
      }
      
      // Remove any leading/trailing whitespace and newlines
      cleanText = cleanText.trim();

      // Parse the JSON response
      const sources = JSON.parse(cleanText);

      logger.info(`Gemini generated sources successfully`);
      return sources;

    } catch (error) {
      logger.error('Gemini source generation failed:', error);
      return null;
    }
  }

  /**
   * Check if Gemini service is available
   */
  isAvailable(): boolean {
    return this.model !== null;
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    if (!this.model) {
      return {
        status: 'degraded',
        details: {
          error: 'Gemini API key not configured',
          fallbackMode: true
        }
      };
    }

    try {
      // Test with a simple analysis
      const testResult = await this.analyzeClaim('The sky is blue.');
      
      return {
        status: 'healthy',
        details: {
          geminiAvailable: true,
          testResponse: testResult ? 'success' : 'failed'
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }
}

export const geminiService = new GeminiService();