import React from 'react';
import type { HistoryItem } from '../../types/history';
import type { AnalysisResult } from '../../types/upload';
import AnalysisResults from '../dashboard/AnalysisResults';

interface HistoryDetailProps {
  historyItem: HistoryItem;
  analysisResults: AnalysisResult | null;
  isLoading: boolean;
  onBack: () => void;
}

const HistoryDetail: React.FC<HistoryDetailProps> = ({
  historyItem,
  analysisResults,
  isLoading,
  onBack
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Get source type icon and label
  const getSourceTypeInfo = () => {
    switch (historyItem.source.type) {
      case 'url':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          ),
          label: 'URL Analysis'
        };
      case 'document':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          label: 'Document Analysis'
        };
      case 'text':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          ),
          label: 'Text Analysis'
        };
      default:
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          label: 'Analysis'
        };
    }
  };
  
  const sourceTypeInfo = getSourceTypeInfo();

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to History
        </button>
      </div>
      
      {/* Analysis header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg mr-3">
            <div className="text-[var(--color-primary)]">
              {sourceTypeInfo.icon}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-neutral-900)]">
              {sourceTypeInfo.label}
            </h2>
            <p className="text-[var(--color-neutral-600)]">
              {formatDate(historyItem.timestamp)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-sm font-medium text-[var(--color-neutral-500)] mb-1">Source</h3>
            <p className="text-[var(--color-neutral-900)]">
              {historyItem.source.type === 'url' ? (
                <a 
                  href={historyItem.source.content} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  {historyItem.source.content}
                </a>
              ) : (
                historyItem.source.content
              )}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--color-neutral-500)] mb-1">Summary</h3>
            <p className="text-[var(--color-neutral-900)]">{historyItem.summary}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--color-neutral-200)]">
          <div>
            <h3 className="text-xs font-medium text-[var(--color-neutral-500)] mb-1">Analysis ID</h3>
            <p className="text-sm text-[var(--color-neutral-900)]">{historyItem.analysisId}</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-[var(--color-neutral-500)] mb-1">Claims Detected</h3>
            <p className="text-sm text-[var(--color-neutral-900)]">{historyItem.claimsCount}</p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-[var(--color-neutral-500)] mb-1">Credibility Score</h3>
            <div className="flex items-center">
              <div className="w-16 bg-[var(--color-neutral-200)] rounded-full h-2 mr-2">
                <div 
                  className={`h-2 rounded-full ${
                    historyItem.credibilityScore >= 0.8
                      ? 'bg-[var(--color-secondary)]'
                      : historyItem.credibilityScore >= 0.6
                        ? 'bg-[var(--color-warning)]'
                        : 'bg-[var(--color-danger)]'
                  }`}
                  style={{ width: `${historyItem.credibilityScore * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{Math.round(historyItem.credibilityScore * 100)}%</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-[var(--color-neutral-500)] mb-1">Source Type</h3>
            <p className="text-sm text-[var(--color-neutral-900)] capitalize">{historyItem.source.type}</p>
          </div>
        </div>
      </div>
      
      {/* Analysis results */}
      {isLoading ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        </div>
      ) : analysisResults ? (
        <AnalysisResults results={analysisResults} />
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[var(--color-neutral-200)]">
          <div className="text-center">
            <div className="w-16 h-16 bg-[var(--color-neutral-100)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--color-neutral-900)] mb-2">Results not available</h3>
            <p className="text-[var(--color-neutral-600)]">
              The detailed analysis results for this item are no longer available.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryDetail;