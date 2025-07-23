import React, { useState } from 'react';
import type { HistoryFilter } from '../../types/history';

interface HistoryFiltersProps {
  onFilterChange: (filters: HistoryFilter) => void;
  initialFilters?: HistoryFilter;
}

const HistoryFilters: React.FC<HistoryFiltersProps> = ({ 
  onFilterChange, 
  initialFilters = {} 
}) => {
  const [filters, setFilters] = useState<HistoryFilter>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      searchTerm: e.target.value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Handle source type change
  const handleSourceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'url' | 'text' | 'document' | 'all';
    const newFilters = {
      ...filters,
      sourceType: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Handle date range changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value ? new Date(e.target.value) : null;
    const newFilters: HistoryFilter = {
      ...filters,
      dateRange: {
        start: startDate,
        end: filters.dateRange?.end || null
      }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = e.target.value ? new Date(e.target.value) : null;
    const newFilters: HistoryFilter = {
      ...filters,
      dateRange: {
        start: filters.dateRange?.start || null,
        end: endDate
      }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Handle credibility range changes
  const handleCredibilityChange = (min: number, max: number) => {
    const newFilters = {
      ...filters,
      credibilityRange: { min, max }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Reset all filters
  const resetFilters = () => {
    const newFilters: HistoryFilter = {};
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Format date for input
  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
      {/* Search and basic filters - always visible */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search analyses..."
              value={filters.searchTerm || ''}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-neutral-300)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="w-full md:w-48">
          <select
            value={filters.sourceType || 'all'}
            onChange={handleSourceTypeChange}
            className="w-full px-4 py-2 border border-[var(--color-neutral-300)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          >
            <option value="all">All Sources</option>
            <option value="url">URLs</option>
            <option value="document">Documents</option>
            <option value="text">Text</option>
          </select>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center px-4 py-2 border border-[var(--color-neutral-300)] rounded-lg text-sm hover:bg-[var(--color-neutral-50)] transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {isExpanded ? 'Hide Filters' : 'More Filters'}
        </button>
        
        {(filters.searchTerm || filters.sourceType || filters.dateRange || filters.credibilityRange) && (
          <button
            onClick={resetFilters}
            className="flex items-center justify-center px-4 py-2 text-[var(--color-danger)] border border-[var(--color-danger)]/30 rounded-lg text-sm hover:bg-[var(--color-danger)]/5 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>
      
      {/* Advanced filters - expandable */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-[var(--color-neutral-200)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Range */}
            <div>
              <h4 className="text-sm font-medium text-[var(--color-neutral-700)] mb-3">Date Range</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--color-neutral-500)] mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateRange?.start ? formatDateForInput(filters.dateRange.start) : ''}
                    onChange={handleStartDateChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-neutral-500)] mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateRange?.end ? formatDateForInput(filters.dateRange.end) : ''}
                    onChange={handleEndDateChange}
                    className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Credibility Score Range */}
            <div>
              <h4 className="text-sm font-medium text-[var(--color-neutral-700)] mb-3">
                Credibility Score
                {filters.credibilityRange && (
                  <span className="ml-2 text-xs font-normal text-[var(--color-neutral-500)]">
                    ({Math.round(filters.credibilityRange.min * 100)}% - {Math.round(filters.credibilityRange.max * 100)}%)
                  </span>
                )}
              </h4>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleCredibilityChange(0, 0.4)}
                    className={`flex-1 py-2 px-3 text-xs rounded-lg border transition-colors ${
                      filters.credibilityRange?.min === 0 && filters.credibilityRange?.max === 0.4
                        ? 'bg-[var(--color-danger)]/10 border-[var(--color-danger)]/30 text-[var(--color-danger)]'
                        : 'border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-50)]'
                    }`}
                  >
                    Low (&lt;40%)
                  </button>
                  <button
                    onClick={() => handleCredibilityChange(0.4, 0.7)}
                    className={`flex-1 py-2 px-3 text-xs rounded-lg border transition-colors ${
                      filters.credibilityRange?.min === 0.4 && filters.credibilityRange?.max === 0.7
                        ? 'bg-[var(--color-warning)]/10 border-[var(--color-warning)]/30 text-[var(--color-warning)]'
                        : 'border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-50)]'
                    }`}
                  >
                    Medium (40-70%)
                  </button>
                  <button
                    onClick={() => handleCredibilityChange(0.7, 1)}
                    className={`flex-1 py-2 px-3 text-xs rounded-lg border transition-colors ${
                      filters.credibilityRange?.min === 0.7 && filters.credibilityRange?.max === 1
                        ? 'bg-[var(--color-secondary)]/10 border-[var(--color-secondary)]/30 text-[var(--color-secondary)]'
                        : 'border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-50)]'
                    }`}
                  >
                    High (&gt;70%)
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    if (filters.credibilityRange) {
                      const newFilters = { ...filters };
                      delete newFilters.credibilityRange;
                      setFilters(newFilters);
                      onFilterChange(newFilters);
                    }
                  }}
                  className="text-xs text-[var(--color-primary)] hover:underline"
                  disabled={!filters.credibilityRange}
                >
                  Clear credibility filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryFilters;