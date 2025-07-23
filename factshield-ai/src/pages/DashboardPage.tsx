import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ContentUpload from '../components/dashboard/ContentUpload';
import UrlAnalysis from '../components/dashboard/UrlAnalysis';
import AnalysisResults from '../components/dashboard/AnalysisResults';
import RecentActivity from '../components/dashboard/RecentActivity';
import HistoryFilters from '../components/history/HistoryFilters';
import HistoryList from '../components/history/HistoryList';
import HistoryDetail from '../components/history/HistoryDetail';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import type { AnalysisResult } from '../types/upload';
import type { HistoryItem, HistoryFilter, PaginationState } from '../types/history';
import * as historyService from '../services/historyService';

const DashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [analysisTab, setAnalysisTab] = useState<'upload' | 'url'>('upload');
  const [currentAnalysisResult, setCurrentAnalysisResult] = useState<AnalysisResult | null>(null);

  // History state
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [historyAnalysisResults, setHistoryAnalysisResults] = useState<AnalysisResult | null>(null);
  const [historyFilters, setHistoryFilters] = useState<HistoryFilter>({});
  const [historyPagination, setHistoryPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isHistoryResultsLoading, setIsHistoryResultsLoading] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Welcome Header with Gradient */}
            <div className="relative overflow-hidden bg-linear-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl p-8 text-white">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {authState.user?.name}! 👋
                </h1>
                <p className="text-white/90 text-lg">
                  Ready to fact-check some content? Here's your dashboard overview.
                </p>
              </div>
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
            </div>

            {/* Quick Stats with Enhanced Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)] hover:shadow-md transition-all duration-200 hover:border-[var(--color-primary)]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-linear-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 rounded-xl shadow-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[var(--color-neutral-600)]">Total Analyses</p>
                      <p className="text-3xl font-bold text-[var(--color-neutral-900)]">0</p>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--color-secondary)] font-medium bg-[var(--color-secondary)]/10 px-2 py-1 rounded-full">
                    +0%
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)] hover:shadow-md transition-all duration-200 hover:border-[var(--color-warning)]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-linear-to-br from-[var(--color-warning)] to-[var(--color-warning)]/80 rounded-xl shadow-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[var(--color-neutral-600)]">Flagged Content</p>
                      <p className="text-3xl font-bold text-[var(--color-neutral-900)]">0</p>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--color-neutral-500)] font-medium bg-[var(--color-neutral-100)] px-2 py-1 rounded-full">
                    0%
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)] hover:shadow-md transition-all duration-200 hover:border-[var(--color-secondary)]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-linear-to-br from-[var(--color-secondary)] to-[var(--color-secondary)]/80 rounded-xl shadow-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[var(--color-neutral-600)]">Accuracy Score</p>
                      <p className="text-3xl font-bold text-[var(--color-neutral-900)]">--</p>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--color-neutral-500)] font-medium bg-[var(--color-neutral-100)] px-2 py-1 rounded-full">
                    N/A
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
                <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveSection('analyze')}
                    className="w-full flex items-center p-3 text-left rounded-lg border border-[var(--color-neutral-200)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all duration-200"
                  >
                    <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-neutral-900)]">Analyze New Content</p>
                      <p className="text-sm text-[var(--color-neutral-600)]">Upload or paste content to fact-check</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection('analyze');
                      setAnalysisTab('url');
                    }}
                    className="w-full flex items-center p-3 text-left rounded-lg border border-[var(--color-neutral-200)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5 transition-all duration-200"
                  >
                    <div className="p-2 bg-[var(--color-secondary)]/10 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-neutral-900)]">Check URL</p>
                      <p className="text-sm text-[var(--color-neutral-600)]">Analyze content from a web link</p>
                    </div>
                  </button>
                </div>
              </div>

              <RecentActivity />
            </div>
          </div>
        );
      case 'analyze':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Content Analysis</h1>
              <p className="text-[var(--color-neutral-600)] mt-2">
                Upload documents or analyze URLs for fact-checking.
              </p>
            </div>

            {/* Analysis Options Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-[var(--color-neutral-200)]">
              <div className="border-b border-[var(--color-neutral-200)]">
                <nav className="flex space-x-8 px-6" aria-label="Analysis options">
                  <button
                    onClick={() => setAnalysisTab('upload')}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                      ${analysisTab === 'upload'
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'border-transparent text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] hover:border-[var(--color-neutral-300)]'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Documents
                    </div>
                  </button>
                  <button
                    onClick={() => setAnalysisTab('url')}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                      ${analysisTab === 'url'
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'border-transparent text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] hover:border-[var(--color-neutral-300)]'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Analyze URLs
                    </div>
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {currentAnalysisResult ? (
                  <div className="space-y-4">
                    <AnalysisResults
                      results={currentAnalysisResult}
                      onReset={() => setCurrentAnalysisResult(null)}
                    />
                  </div>
                ) : (
                  analysisTab === 'upload' ? (
                    <ContentUpload
                      onFileAnalyzed={(fileId, results) => {
                        console.log('File analyzed:', fileId, results);
                        setCurrentAnalysisResult(results);
                      }}
                    />
                  ) : (
                    <UrlAnalysis
                      onUrlAnalyzed={(url, results) => {
                        console.log('URL analyzed:', url, results);
                        setCurrentAnalysisResult(results);
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Demo section for testing */}
            <div className="bg-[var(--color-neutral-50)] rounded-lg p-4 border border-[var(--color-neutral-200)]">
              <p className="text-sm text-[var(--color-neutral-600)]">
                <strong>Demo Note:</strong> Both upload and URL analysis components are now functional.
                The upload component supports drag-and-drop with file validation, and the URL analysis
                form includes proper validation and error handling. Try both tabs to test the functionality!
              </p>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Analysis History</h1>
              <p className="text-[var(--color-neutral-600)] mt-2">
                View your past fact-checking analyses and results.
              </p>
            </div>

            {selectedItem ? (
              <HistoryDetail
                historyItem={selectedItem}
                analysisResults={historyAnalysisResults}
                isLoading={isHistoryResultsLoading}
                onBack={handleBackToList}
              />
            ) : (
              <>
                <HistoryFilters
                  onFilterChange={handleHistoryFilterChange}
                  initialFilters={historyFilters}
                />

                <HistoryList
                  items={historyItems}
                  pagination={historyPagination}
                  onPageChange={handleHistoryPageChange}
                  onViewItem={handleViewHistoryItem}
                  onDeleteItem={handleDeleteHistoryItem}
                  isLoading={isHistoryLoading}
                />
              </>
            )}
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Analytics Dashboard</h1>
              <p className="text-[var(--color-neutral-600)] mt-2">
                View insights and trends from your fact-checking analyses.
              </p>
            </div>

            <AnalyticsDashboard />
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Settings</h1>
              <p className="text-[var(--color-neutral-600)] mt-2">
                Manage your account preferences and settings.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-[var(--color-neutral-200)]">
              <p className="text-center text-[var(--color-neutral-600)]">
                Settings page will be implemented in future tasks.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // History functions
  // Load history items
  const loadHistoryItems = async () => {
    if (!authState.user) return;

    setIsHistoryLoading(true);
    try {
      const result = await historyService.getUserHistory(
        authState.user.id,
        historyPagination.currentPage,
        historyPagination.itemsPerPage,
        historyFilters
      );

      setHistoryItems(result.items);
      setHistoryPagination(result.pagination);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Load history on mount and when filters or pagination change
  useEffect(() => {
    if (activeSection === 'history') {
      loadHistoryItems();
    }
  }, [authState.user, historyPagination.currentPage, historyFilters, activeSection]);

  // Handle custom events from RecentActivity component
  useEffect(() => {
    const handleViewHistoryItemEvent = (event: Event) => {
      const customEvent = event as CustomEvent<HistoryItem>;
      setActiveSection('history');
      // Use the existing function to view the history item
      handleViewHistoryItem(customEvent.detail);
    };

    const handleViewAllHistory = () => {
      setActiveSection('history');
    };

    window.addEventListener('viewHistoryItem', handleViewHistoryItemEvent);
    window.addEventListener('viewAllHistory', handleViewAllHistory);

    return () => {
      window.removeEventListener('viewHistoryItem', handleViewHistoryItemEvent);
      window.removeEventListener('viewAllHistory', handleViewAllHistory);
    };
  }, []);

  // Handle page change
  const handleHistoryPageChange = (page: number) => {
    setHistoryPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  // Handle filter change
  const handleHistoryFilterChange = (newFilters: HistoryFilter) => {
    setHistoryFilters(newFilters);
    // Reset to first page when filters change
    setHistoryPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  // View history item details
  const handleViewHistoryItem = async (item: HistoryItem) => {
    setSelectedItem(item);
    setIsHistoryResultsLoading(true);

    try {
      const results = await historyService.getHistoryItemResults(item.analysisId);
      setHistoryAnalysisResults(results);
    } catch (error) {
      console.error('Error loading analysis results:', error);
      setHistoryAnalysisResults(null);
    } finally {
      setIsHistoryResultsLoading(false);
    }
  };

  // Delete history item
  const handleDeleteHistoryItem = async (item: HistoryItem) => {
    try {
      await historyService.deleteHistoryItem(item.id);
      // Refresh the list
      loadHistoryItems();

      // If the deleted item was selected, go back to the list
      if (selectedItem && selectedItem.id === item.id) {
        setSelectedItem(null);
        setHistoryAnalysisResults(null);
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  // Go back to history list
  const handleBackToList = () => {
    setSelectedItem(null);
    setHistoryAnalysisResults(null);
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default DashboardPage;