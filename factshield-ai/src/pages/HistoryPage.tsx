import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import HistoryFilters from '../components/history/HistoryFilters';
import HistoryList from '../components/history/HistoryList';
import HistoryDetail from '../components/history/HistoryDetail';
import type { HistoryItem, HistoryFilter, PaginationState } from '../types/history';
import type { AnalysisResult } from '../types/upload';
import * as historyService from '../services/historyService';

const HistoryPage: React.FC = () => {
  const { authState } = useAuth();
  const [activeSection, setActiveSection] = useState('history');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [filters, setFilters] = useState<HistoryFilter>({});
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  // We don't need deleteConfirmation state here as it's handled in the HistoryListItem component

  // Load history items
  const loadHistoryItems = async () => {
    if (!authState.user) return;
    
    setIsLoading(true);
    try {
      const result = await historyService.getUserHistory(
        authState.user.id,
        pagination.currentPage,
        pagination.itemsPerPage,
        filters
      );
      
      setHistoryItems(result.items);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load history on mount and when filters or pagination change
  useEffect(() => {
    loadHistoryItems();
  }, [authState.user, pagination.currentPage, filters]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters: HistoryFilter) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };
  
  // View history item details
  const handleViewItem = async (item: HistoryItem) => {
    setSelectedItem(item);
    setIsLoadingResults(true);
    
    try {
      const results = await historyService.getHistoryItemResults(item.analysisId);
      setAnalysisResults(results);
    } catch (error) {
      console.error('Error loading analysis results:', error);
      setAnalysisResults(null);
    } finally {
      setIsLoadingResults(false);
    }
  };
  
  // Delete history item
  const handleDeleteItem = async (item: HistoryItem) => {
    try {
      await historyService.deleteHistoryItem(item.id);
      // Refresh the list
      loadHistoryItems();
      
      // If the deleted item was selected, go back to the list
      if (selectedItem && selectedItem.id === item.id) {
        setSelectedItem(null);
        setAnalysisResults(null);
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };
  
  // Go back to history list
  const handleBackToList = () => {
    setSelectedItem(null);
    setAnalysisResults(null);
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
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
            analysisResults={analysisResults}
            isLoading={isLoadingResults}
            onBack={handleBackToList}
          />
        ) : (
          <>
            <HistoryFilters
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
            
            <HistoryList
              items={historyItems}
              pagination={pagination}
              onPageChange={handlePageChange}
              onViewItem={handleViewItem}
              onDeleteItem={handleDeleteItem}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;