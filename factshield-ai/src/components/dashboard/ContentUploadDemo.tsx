import React, { useState } from 'react';
import ContentUpload from './ContentUpload';
import AnalysisResults from './AnalysisResults';
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
          
          <div className="space-y-6">
            {analysisResults.map((result, index) => (
              <div key={index}>
                <AnalysisResults 
                  results={result} 
                  onReset={() => {
                    setAnalysisResults(prev => prev.filter((_, i) => i !== index));
                  }} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentUploadDemo;