import type { AnalyticsSummary, AnalyticsTimeframe } from '../types/analytics';

// Mock data for development purposes
const generateMockAnalyticsData = (
  startDate: Date,
  endDate: Date,
  timeframeLabel: string
): AnalyticsSummary => {
  // Calculate number of days in the range
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate credibility trend data points
  const credibilityTrend = [];
  const currentDate = new Date(startDate);
  
  // Determine step size based on range length
  const stepSize = daysDiff > 90 ? 7 : daysDiff > 30 ? 3 : 1;
  
  while (currentDate <= endDate) {
    // Generate a random credibility score between 0.5 and 0.95
    const averageScore = 0.5 + Math.random() * 0.45;
    // Generate a random number of analyses between 1 and 10
    const totalAnalyses = Math.floor(1 + Math.random() * 10);
    
    credibilityTrend.push({
      date: currentDate.toISOString().split('T')[0],
      averageScore,
      totalAnalyses
    });
    
    // Increment date by step size
    currentDate.setDate(currentDate.getDate() + stepSize);
  }
  
  // Generate claims distribution
  const claimsDistribution = [
    {
      credibilityRange: 'High (>80%)',
      count: Math.floor(30 + Math.random() * 50),
      percentage: 0
    },
    {
      credibilityRange: 'Medium (60-80%)',
      count: Math.floor(20 + Math.random() * 40),
      percentage: 0
    },
    {
      credibilityRange: 'Low (<60%)',
      count: Math.floor(10 + Math.random() * 30),
      percentage: 0
    }
  ];
  
  // Calculate percentages
  const totalClaims = claimsDistribution.reduce((sum, item) => sum + item.count, 0);
  claimsDistribution.forEach(item => {
    item.percentage = totalClaims > 0 ? item.count / totalClaims : 0;
  });
  
  // Generate source type distribution
  const sourceTypeDistribution = [
    {
      type: 'url' as const,
      count: Math.floor(40 + Math.random() * 60),
      percentage: 0
    },
    {
      type: 'document' as const,
      count: Math.floor(20 + Math.random() * 30),
      percentage: 0
    },
    {
      type: 'text' as const,
      count: Math.floor(10 + Math.random() * 20),
      percentage: 0
    }
  ];
  
  // Calculate percentages
  const totalSources = sourceTypeDistribution.reduce((sum, item) => sum + item.count, 0);
  sourceTypeDistribution.forEach(item => {
    item.percentage = totalSources > 0 ? item.count / totalSources : 0;
  });
  
  // Calculate total analyses
  const totalAnalyses = credibilityTrend.reduce((sum, item) => sum + item.totalAnalyses, 0);
  
  // Calculate average credibility score
  const totalScoreSum = credibilityTrend.reduce((sum, item) => sum + (item.averageScore * item.totalAnalyses), 0);
  const averageCredibilityScore = totalAnalyses > 0 ? totalScoreSum / totalAnalyses : 0;
  
  // Calculate flagged content (items with credibility < 0.6)
  const flaggedContentCount = Math.floor(totalAnalyses * 0.2); // Assume 20% are flagged
  const flaggedContentPercentage = totalAnalyses > 0 ? flaggedContentCount / totalAnalyses : 0;
  
  return {
    totalAnalyses,
    averageCredibilityScore,
    totalClaims,
    flaggedContentCount,
    flaggedContentPercentage,
    credibilityTrend,
    claimsDistribution,
    sourceTypeDistribution,
    timeframe: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      label: timeframeLabel
    }
  };
};

// Function to get analytics data for a specific date range
export const getUserAnalytics = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<AnalyticsSummary> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate custom date range label
      const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(date);
      };
      
      const timeframeLabel = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      
      // Generate mock data
      const data = generateMockAnalyticsData(startDate, endDate, timeframeLabel);
      
      resolve(data);
    }, 800);
  });
};

// Function to get analytics data for a predefined timeframe
export const getUserAnalyticsByTimeframe = async (
  userId: string,
  timeframe: AnalyticsTimeframe
): Promise<AnalyticsSummary> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      let startDate: Date;
      let timeframeLabel: string;
      
      // Calculate start date based on timeframe
      switch (timeframe) {
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          timeframeLabel = 'Last 7 Days';
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          timeframeLabel = 'Last 30 Days';
          break;
        case 'quarter':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 3);
          timeframeLabel = 'Last 3 Months';
          break;
        case 'year':
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          timeframeLabel = 'Last 12 Months';
          break;
        default:
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          timeframeLabel = 'Last 30 Days';
      }
      
      // Generate mock data
      const data = generateMockAnalyticsData(startDate, now, timeframeLabel);
      
      resolve(data);
    }, 800);
  });
};