export type AnalyticsTimeframe = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface CredibilityTrendPoint {
  date: string;
  averageScore: number;
  totalAnalyses: number;
}

export interface ClaimsDistributionPoint {
  credibilityRange: string;
  count: number;
  percentage: number;
}

export interface SourceTypeDistributionPoint {
  type: 'url' | 'document' | 'text';
  count: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalAnalyses: number;
  averageCredibilityScore: number;
  totalClaims: number;
  flaggedContentCount: number;
  flaggedContentPercentage: number;
  credibilityTrend: CredibilityTrendPoint[];
  claimsDistribution: ClaimsDistributionPoint[];
  sourceTypeDistribution: SourceTypeDistributionPoint[];
  timeframe: {
    start: string;
    end: string;
    label: string;
  };
}