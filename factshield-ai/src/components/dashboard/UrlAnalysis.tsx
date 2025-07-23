import React, { useState, useCallback } from 'react';
import type { AnalysisResult, UrlAnalysisProps } from '../../types/upload';
import AnalysisResults from './AnalysisResults';

interface UrlAnalysisState {
  url: string;
  isLoading: boolean;
  error: string | null;
  results: AnalysisResult | null;
}

const UrlAnalysis: React.FC<UrlAnalysisProps> = ({ onUrlAnalyzed }) => {
  const [state, setState] = useState<UrlAnalysisState>({
    url: '',
    isLoading: false,
    error: null,
    results: null
  });

  const validateUrl = useCallback((url: string): string | null => {
    if (!url.trim()) {
      return 'URL is required';
    }

    // Basic URL validation
    try {
      const urlObj = new URL(url);
      
      // Check if protocol is http or https
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return 'URL must use HTTP or HTTPS protocol';
      }

      // Check if hostname exists
      if (!urlObj.hostname) {
        return 'Invalid URL format';
      }

      return null;
    } catch {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }
  }, []);

  const simulateUrlAnalysis = useCallback((url: string): Promise<AnalysisResult> => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate occasional failures for testing error handling
        if (Math.random() < 0.1) {
          reject(new Error('Failed to fetch content from URL. Please check if the URL is accessible.'));
          return;
        }

        // Simulate successful analysis
        resolve({
          id: Date.now().toString(),
          fileName: `Analysis of ${url}`,
          claims: [
            {
              id: '1',
              text: 'Sample claim extracted from webpage content',
              confidence: 0.78,
              credibilityScore: 0.65,
              sources: [
                {
                  url: 'https://example.com/fact-check-source',
                  title: 'Fact-checking Source',
                  reliability: 0.85
                }
              ]
            },
            {
              id: '2',
              text: 'Another claim found in the analyzed content',
              confidence: 0.92,
              credibilityScore: 0.88,
              sources: [
                {
                  url: 'https://reliable-news.com/verification',
                  title: 'Reliable News Verification',
                  reliability: 0.95
                }
              ]
            }
          ],
          summary: `Successfully analyzed content from ${url}. Found 2 claims for fact-checking.`
        });
      }, 2000 + Math.random() * 1000); // 2-3 second delay
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedUrl = state.url.trim();
    const validationError = validateUrl(trimmedUrl);
    
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
      const results = await simulateUrlAnalysis(trimmedUrl);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        results 
      }));

      // Notify parent component
      onUrlAnalyzed?.(trimmedUrl, results);
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to analyze URL'
      }));
    }
  }, [state.url, validateUrl, simulateUrlAnalysis, onUrlAnalyzed]);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setState(prev => ({ 
      ...prev, 
      url: newUrl, 
      error: null // Clear error when user starts typing
    }));
  }, []);

  const handleReset = useCallback(() => {
    setState({
      url: '',
      isLoading: false,
      error: null,
      results: null
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* URL Input Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-[var(--color-secondary)]/10 rounded-lg mr-3">
            <svg className="w-6 h-6 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">
              Analyze URL Content
            </h3>
            <p className="text-sm text-[var(--color-neutral-600)]">
              Enter a URL to analyze its content for misinformation
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
              Website URL
            </label>
            <div className="relative">
              <input
                id="url-input"
                type="url"
                value={state.url}
                onChange={handleUrlChange}
                placeholder="https://example.com/article"
                disabled={state.isLoading}
                className={`
                  w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200
                  ${state.error 
                    ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20' 
                    : 'border-[var(--color-neutral-300)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20'
                  }
                  focus:outline-none focus:ring-2
                  disabled:bg-[var(--color-neutral-50)] disabled:cursor-not-allowed
                  placeholder:text-[var(--color-neutral-400)]
                `}
                aria-describedby={state.error ? "url-error" : undefined}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
            </div>
            
            {state.error && (
              <p id="url-error" className="mt-2 text-sm text-[var(--color-danger)] flex items-center">
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
              disabled={state.isLoading || !state.url.trim()}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${state.isLoading || !state.url.trim()
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
                  Analyze URL
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
            <span>Fetching and analyzing content from URL...</span>
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

export default UrlAnalysis;