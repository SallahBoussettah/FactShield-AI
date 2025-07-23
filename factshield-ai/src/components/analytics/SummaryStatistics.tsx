import React from 'react';
import type { AnalyticsSummary } from '../../types/analytics';

interface SummaryStatisticsProps {
  data: AnalyticsSummary | null;
}

const SummaryStatistics: React.FC<SummaryStatisticsProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--color-neutral-600)]">No data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm text-[var(--color-neutral-600)] mb-4">
        Showing data for: <span className="font-medium">{data.timeframe.label}</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Analyses */}
        <div className="bg-[var(--color-neutral-50)] rounded-xl p-4 border border-[var(--color-neutral-200)]">
          <div className="flex items-center">
            <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg mr-3">
              <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[var(--color-neutral-500)]">Total Analyses</p>
              <p className="text-xl font-bold text-[var(--color-neutral-900)]">{data.totalAnalyses}</p>
            </div>
          </div>
        </div>
        
        {/* Average Credibility */}
        <div className="bg-[var(--color-neutral-50)] rounded-xl p-4 border border-[var(--color-neutral-200)]">
          <div className="flex items-center">
            <div className="p-2 bg-[var(--color-secondary)]/10 rounded-lg mr-3">
              <svg className="w-5 h-5 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[var(--color-neutral-500)]">Avg. Credibility</p>
              <p className="text-xl font-bold text-[var(--color-neutral-900)]">
                {Math.round(data.averageCredibilityScore * 100)}%
              </p>
            </div>
          </div>
        </div>
        
        {/* Total Claims */}
        <div className="bg-[var(--color-neutral-50)] rounded-xl p-4 border border-[var(--color-neutral-200)]">
          <div className="flex items-center">
            <div className="p-2 bg-[var(--color-neutral-400)]/10 rounded-lg mr-3">
              <svg className="w-5 h-5 text-[var(--color-neutral-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[var(--color-neutral-500)]">Total Claims</p>
              <p className="text-xl font-bold text-[var(--color-neutral-900)]">{data.totalClaims}</p>
            </div>
          </div>
        </div>
        
        {/* Flagged Content */}
        <div className="bg-[var(--color-neutral-50)] rounded-xl p-4 border border-[var(--color-neutral-200)]">
          <div className="flex items-center">
            <div className="p-2 bg-[var(--color-warning)]/10 rounded-lg mr-3">
              <svg className="w-5 h-5 text-[var(--color-warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[var(--color-neutral-500)]">Flagged Content</p>
              <div className="flex items-center">
                <p className="text-xl font-bold text-[var(--color-neutral-900)]">{data.flaggedContentCount}</p>
                <span className="ml-2 text-xs text-[var(--color-neutral-500)]">
                  ({Math.round(data.flaggedContentPercentage * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStatistics;