import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DateRangeSelector from './DateRangeSelector';
import CredibilityTrendChart from './CredibilityTrendChart';
import ClaimsDistributionChart from './ClaimsDistributionChart';
import SourceTypeDistribution from './SourceTypeDistribution';
import SummaryStatistics from './SummaryStatistics';
import * as analyticsService from '../../services/analyticsService';
import type { AnalyticsSummary, AnalyticsTimeframe } from '../../types/analytics';

const AnalyticsDashboard: React.FC = () => {
  const { authState } = useAuth();
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>('month');
  const [customDateRange, setCustomDateRange] = useState<{start: Date | null, end: Date | null}>({
    start: null,
    end: null
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load analytics data based on selected timeframe
  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (!authState.user) return;
      
      setIsLoading(true);
      try {
        let data;
        
        if (timeframe === 'custom' && customDateRange.start && customDateRange.end) {
          data = await analyticsService.getUserAnalytics(
            authState.user.id,
            customDateRange.start,
            customDateRange.end
          );
        } else {
          data = await analyticsService.getUserAnalyticsByTimeframe(
            authState.user.id,
            timeframe
          );
        }
        
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalyticsData();
  }, [authState.user, timeframe, customDateRange.start, customDateRange.end]);

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: AnalyticsTimeframe) => {
    setTimeframe(newTimeframe);
  };
  
  // Handle custom date range change
  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setCustomDateRange({ start, end });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
        <DateRangeSelector 
          selectedTimeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
          customDateRange={customDateRange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
      
      {/* Summary Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
        <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Summary Statistics</h3>
        <SummaryStatistics data={analyticsData} />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credibility Trend Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
          <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Credibility Trend</h3>
          <CredibilityTrendChart data={analyticsData?.credibilityTrend || []} />
        </div>
        
        {/* Claims Distribution Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
          <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Claims Distribution</h3>
          <ClaimsDistributionChart data={analyticsData?.claimsDistribution || []} />
        </div>
      </div>
      
      {/* Source Type Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
        <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Source Type Distribution</h3>
        <SourceTypeDistribution data={analyticsData?.sourceTypeDistribution || []} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;