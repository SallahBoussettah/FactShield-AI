import React, { useState } from 'react';
import ContentUpload from './ContentUpload';
import type { AnalysisResult } from '../../types/upload';

const ContentUploadDemo: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

  const handleFileAnalyzed = (fileId: string, results: AnalysisResult) => {
    setAnalysisResults(prev => [...prev, results]);
    console.log('File analyzed:', fileId, results);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-4">
          Content Upload Component Demo
        </h2>
        <p className="text-[var(--color-neutral-600)] mb-6">
          This demo shows the content upload component with drag-and-drop functionality,
          file validation, and upload progress indicators.
        </p>
      </div>

      <ContentUpload onFileAnalyzed={handleFileAnalyzed} />

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">
            Analysis Results ({analysisResults.length})
          </h3>
          
          <div className="space-y-4">
            {analysisResults.map((result, index) => (
              <div
                key={index}
                className="bg-white border border-[var(--color-neutral-200)] rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-[var(--color-neutral-900)]">
                    {result.fileName}
                  </h4>
                  <span className="text-sm text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-2 py-1 rounded-full">
                    Analysis Complete
                  </span>
                </div>
                
                <p className="text-[var(--color-neutral-600)] mb-4">
                  {result.summary}
                </p>
                
                {result.claims.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="font-medium text-[var(--color-neutral-900)]">
                      Extracted Claims:
                    </h5>
                    
                    {result.claims.map((claim) => (
                      <div
                        key={claim.id}
                        className="bg-[var(--color-neutral-50)] p-4 rounded-lg"
                      >
                        <p className="text-[var(--color-neutral-800)] mb-2">
                          "{claim.text}"
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-[var(--color-neutral-600)]">
                            Confidence: {(claim.confidence * 100).toFixed(1)}%
                          </span>
                          <span className="text-[var(--color-neutral-600)]">
                            Credibility: {(claim.credibilityScore * 100).toFixed(1)}%
                          </span>
                        </div>
                        
                        {claim.sources.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                              Sources:
                            </p>
                            {claim.sources.map((source, sourceIndex) => (
                              <div key={sourceIndex} className="text-sm text-[var(--color-neutral-600)]">
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[var(--color-primary)] hover:underline"
                                >
                                  {source.title}
                                </a>
                                <span className="ml-2">
                                  (Reliability: {(source.reliability * 100).toFixed(1)}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentUploadDemo;