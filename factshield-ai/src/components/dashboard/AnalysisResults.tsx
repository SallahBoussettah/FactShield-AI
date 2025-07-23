import React, { useState } from 'react';
import type { AnalysisResult, Claim, Source } from '../../types/upload';

interface AnalysisResultsProps {
  results: AnalysisResult | null;
  onReset?: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, onReset }) => {
  const [expandedClaims, setExpandedClaims] = useState<Record<string, boolean>>({});

  if (!results) {
    return null;
  }

  const toggleClaimExpansion = (claimId: string) => {
    setExpandedClaims(prev => ({
      ...prev,
      [claimId]: !prev[claimId]
    }));
  };

  // Helper function to determine credibility level and color
  const getCredibilityInfo = (score: number) => {
    if (score >= 0.8) {
      return {
        level: 'High',
        color: 'var(--color-secondary)',
        bgColor: 'var(--color-secondary)/10',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    } else if (score >= 0.6) {
      return {
        level: 'Medium',
        color: 'var(--color-warning)',
        bgColor: 'var(--color-warning)/10',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    } else {
      return {
        level: 'Low',
        color: 'var(--color-danger)',
        bgColor: 'var(--color-danger)/10',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-[var(--color-secondary)]/10 rounded-lg mr-3">
              <svg className="w-6 h-6 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[var(--color-neutral-900)]">
                Analysis Complete
              </h4>
              <p className="text-sm text-[var(--color-neutral-600)]">
                {results.summary}
              </p>
            </div>
          </div>
          
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)] rounded-lg transition-all duration-200"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </div>
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-neutral-50)] rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-[var(--color-neutral-500)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[var(--color-neutral-700)] font-medium">{results.fileName}</span>
          </div>
          <span className="text-sm text-[var(--color-neutral-500)]">
            {results.claims.length} {results.claims.length === 1 ? 'claim' : 'claims'} detected
          </span>
        </div>
      </div>

      {/* Claims Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
        <h5 className="font-medium text-[var(--color-neutral-900)] mb-4">
          Extracted Claims ({results.claims.length})
        </h5>
        
        <div className="space-y-4">
          {results.claims.map((claim) => {
            const credInfo = getCredibilityInfo(claim.credibilityScore);
            const isExpanded = expandedClaims[claim.id] || false;
            
            return (
              <div 
                key={claim.id} 
                className="border border-[var(--color-neutral-200)] rounded-lg overflow-hidden transition-all duration-300"
              >
                {/* Claim Header - Always visible */}
                <div 
                  className="p-4 cursor-pointer hover:bg-[var(--color-neutral-50)] transition-colors duration-200"
                  onClick={() => toggleClaimExpansion(claim.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg text-[${credInfo.color}] bg-[${credInfo.bgColor}] flex-shrink-0 mt-1`}>
                        {credInfo.icon}
                      </div>
                      <div>
                        <p className="text-[var(--color-neutral-900)] font-medium mb-1">
                          "{claim.text}"
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div>
                            <span className="text-[var(--color-neutral-600)]">Confidence: </span>
                            <span className="font-medium">{Math.round(claim.confidence * 100)}%</span>
                          </div>
                          <div>
                            <span className="text-[var(--color-neutral-600)]">Credibility: </span>
                            <span className={`font-medium text-[${credInfo.color}]`}>
                              {credInfo.level} ({Math.round(claim.credibilityScore * 100)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="p-1 rounded-full hover:bg-[var(--color-neutral-100)] transition-colors duration-200"
                      aria-label={isExpanded ? "Collapse details" : "Expand details"}
                    >
                      <svg 
                        className={`w-5 h-5 text-[var(--color-neutral-500)] transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Expandable Details Section */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
                    <div className="space-y-4">
                      {/* Detailed Analysis */}
                      <div className="bg-white rounded-lg p-4 border border-[var(--color-neutral-200)]">
                        <h6 className="font-medium text-[var(--color-neutral-800)] mb-3">Detailed Analysis</h6>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--color-neutral-600)]">Claim Confidence:</span>
                            <div className="flex items-center">
                              <div className="w-32 bg-[var(--color-neutral-200)] rounded-full h-2 mr-2">
                                <div 
                                  className="bg-[var(--color-primary)] h-2 rounded-full" 
                                  style={{ width: `${claim.confidence * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{Math.round(claim.confidence * 100)}%</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--color-neutral-600)]">Credibility Score:</span>
                            <div className="flex items-center">
                              <div className="w-32 bg-[var(--color-neutral-200)] rounded-full h-2 mr-2">
                                <div 
                                  className={`bg-[${credInfo.color}] h-2 rounded-full`}
                                  style={{ width: `${claim.credibilityScore * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{Math.round(claim.credibilityScore * 100)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Sources Section */}
                      {claim.sources.length > 0 && (
                        <div>
                          <h6 className="font-medium text-[var(--color-neutral-800)] mb-3">
                            Sources ({claim.sources.length})
                          </h6>
                          <div className="space-y-3">
                            {claim.sources.map((source, index) => (
                              <SourceCitation key={index} source={source} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Source Citation Component
const SourceCitation: React.FC<{ source: Source }> = ({ source }) => {
  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 0.8) return 'var(--color-secondary)';
    if (reliability >= 0.6) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-[var(--color-neutral-200)] hover:border-[var(--color-primary)]/50 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] hover:underline font-medium"
          >
            {source.title}
          </a>
          <div className="flex items-center mt-2 text-sm">
            <svg className="w-4 h-4 text-[var(--color-neutral-500)] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)] truncate max-w-xs"
            >
              {source.url}
            </a>
          </div>
        </div>
        <div 
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: `${getReliabilityColor(source.reliability)}/10`,
            color: getReliabilityColor(source.reliability)
          }}
        >
          {Math.round(source.reliability * 100)}% reliable
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;