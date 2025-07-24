import React, { useState, useCallback } from 'react';
import type { AnalysisResult } from '../../types/upload';
import AnalysisResults from './AnalysisResults';
import { analyzeText } from '../../services/analysisService';

interface TextAnalysisProps {
  onTextAnalyzed?: (text: string, results: AnalysisResult) => void;
}

interface TextAnalysisState {
  text: string;
  source: string;
  isLoading: boolean;
  error: string | null;
  results: AnalysisResult | null;
}

const TextAnalysis: React.FC<TextAnalysisProps> = ({ onTextAnalyzed }) => {
  const [state, setState] = useState<TextAnalysisState>({
    text: '',
    source: '',
    isLoading: false,
    error: null,
    results: null
  });

  const validateText = useCallback((text: string): string | null => {
    if (!text.trim()) {
      return 'Text is required';
    }

    if (text.trim().length < 50) {
      return 'Text must be at least 50 characters long';
    }

    if (text.length > 50000) {
      return 'Text must be less than 50,000 characters';
    }

    return null;
  }, []);

  const analyzeTextContent = useCallback(async (text: string, source?: string): Promise<AnalysisResult> => {
    try {
      const result = await analyzeText({
        text,
        source,
        options: {
          maxClaims: 10,
          minConfidence: 0.6,
          includeOpinions: false,
          maxSources: 3,
          minSourceReliability: 0.6
        }
      });

      return result;
    } catch (error) {
      console.error('Text analysis failed:', error);
      throw error;
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedText = state.text.trim();
    const validationError = validateText(trimmedText);
    
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      results: null 
    }));

    try {
      const results = await analyzeTextContent(trimmedText, state.source.trim() || undefined);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        results 
      }));

      // Notify parent component
      onTextAnalyzed?.(trimmedText, results);
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to analyze text'
      }));
    }
  }, [state.text, state.source, validateText, analyzeTextContent, onTextAnalyzed]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setState(prev => ({ 
      ...prev, 
      text: newText, 
      error: null // Clear error when user starts typing
    }));
  }, []);

  const handleSourceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSource = e.target.value;
    setState(prev => ({ 
      ...prev, 
      source: newSource
    }));
  }, []);

  const handleReset = useCallback(() => {
    setState({
      text: '',
      source: '',
      isLoading: false,
      error: null,
      results: null
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Text Input Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg mr-3">
            <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">
              Analyze Text Content
            </h3>
            <p className="text-sm text-[var(--color-neutral-600)]">
              Paste or type text content to analyze for misinformation
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="source-input" className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
              Source (Optional)
            </label>
            <input
              id="source-input"
              type="text"
              value={state.source}
              onChange={handleSourceChange}
              placeholder="e.g., Social media post, News article, etc."
              disabled={state.isLoading}
              className="w-full px-4 py-2 border border-[var(--color-neutral-300)] rounded-lg focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20 focus:outline-none focus:ring-2 disabled:bg-[var(--color-neutral-50)] disabled:cursor-not-allowed placeholder:text-[var(--color-neutral-400)]"
            />
          </div>

          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
              Text Content *
            </label>
            <textarea
              id="text-input"
              value={state.text}
              onChange={handleTextChange}
              placeholder="Paste or type the text content you want to analyze..."
              disabled={state.isLoading}
              rows={8}
              className={`
                w-full px-4 py-3 border rounded-lg transition-all duration-200 resize-vertical
                ${state.error 
                  ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20' 
                  : 'border-[var(--color-neutral-300)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20'
                }
                focus:outline-none focus:ring-2
                disabled:bg-[var(--color-neutral-50)] disabled:cursor-not-allowed
                placeholder:text-[var(--color-neutral-400)]
              `}
              aria-describedby={state.error ? "text-error" : "text-help"}
            />
            
            <div className="flex justify-between items-center mt-2">
              <p id="text-help" className="text-sm text-[var(--color-neutral-500)]">
                Minimum 50 characters, maximum 50,000 characters
              </p>
              <p className={`text-sm ${state.text.length > 45000 ? 'text-[var(--color-warning)]' : 'text-[var(--color-neutral-500)]'}`}>
                {state.text.length.toLocaleString()} / 50,000
              </p>
            </div>
            
            {state.error && (
              <p id="text-error" className="mt-2 text-sm text-[var(--color-danger)] flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {state.error}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={state.isLoading || !state.text.trim()}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${state.isLoading || !state.text.trim()
                  ? 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-500)] cursor-not-allowed'
                  : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 active:transform active:scale-95'
                }
              `}
            >
              {state.isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Analyze Text
                </>
              )}
            </button>

            {(state.results || state.error) && (
              <button
                type="button"
                onClick={handleReset}
                disabled={state.isLoading}
                className="px-4 py-3 text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)] rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Loading State */}
      {state.isLoading && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
          <div className="flex items-center justify-center space-x-3 text-[var(--color-neutral-600)]">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analyzing text content...</span>
          </div>
          <div className="mt-4 bg-[var(--color-neutral-100)] rounded-full h-2">
            <div className="bg-[var(--color-primary)] h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {state.results && (
        <AnalysisResults results={state.results} onReset={handleReset} />
      )}
    </div>
  );
};

export default TextAnalysis;