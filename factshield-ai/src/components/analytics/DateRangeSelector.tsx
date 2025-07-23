import React, { useState } from 'react';
import type { AnalyticsTimeframe } from '../../types/analytics';

interface DateRangeSelectorProps {
  selectedTimeframe: AnalyticsTimeframe;
  onTimeframeChange: (timeframe: AnalyticsTimeframe) => void;
  customDateRange: {
    start: Date | null;
    end: Date | null;
  };
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  selectedTimeframe,
  onTimeframeChange,
  customDateRange,
  onDateRangeChange
}) => {
  const [showCustomRange, setShowCustomRange] = useState(selectedTimeframe === 'custom');
  
  // Handle timeframe button click
  const handleTimeframeClick = (timeframe: AnalyticsTimeframe) => {
    onTimeframeChange(timeframe);
    setShowCustomRange(timeframe === 'custom');
  };
  
  // Handle start date change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value ? new Date(e.target.value) : null;
    onDateRangeChange(startDate, customDateRange.end);
  };
  
  // Handle end date change
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = e.target.value ? new Date(e.target.value) : null;
    onDateRangeChange(customDateRange.start, endDate);
  };
  
  // Format date for input
  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">Date Range</h3>
        
        {showCustomRange && (
          <button
            onClick={() => {
              onTimeframeChange('month');
              setShowCustomRange(false);
            }}
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            Reset to Default
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleTimeframeClick('week')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            selectedTimeframe === 'week'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)]'
          }`}
        >
          Last 7 Days
        </button>
        
        <button
          onClick={() => handleTimeframeClick('month')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            selectedTimeframe === 'month'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)]'
          }`}
        >
          Last 30 Days
        </button>
        
        <button
          onClick={() => handleTimeframeClick('quarter')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            selectedTimeframe === 'quarter'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)]'
          }`}
        >
          Last 3 Months
        </button>
        
        <button
          onClick={() => handleTimeframeClick('year')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            selectedTimeframe === 'year'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)]'
          }`}
        >
          Last 12 Months
        </button>
        
        <button
          onClick={() => handleTimeframeClick('custom')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            selectedTimeframe === 'custom'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)]'
          }`}
        >
          Custom Range
        </button>
      </div>
      
      {showCustomRange && (
        <div className="pt-4 border-t border-[var(--color-neutral-200)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-neutral-600)] mb-1">Start Date</label>
              <input
                type="date"
                value={formatDateForInput(customDateRange.start)}
                onChange={handleStartDateChange}
                className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm text-[var(--color-neutral-600)] mb-1">End Date</label>
              <input
                type="date"
                value={formatDateForInput(customDateRange.end)}
                onChange={handleEndDateChange}
                className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>
          </div>
          
          {(!customDateRange.start || !customDateRange.end) && (
            <p className="mt-2 text-sm text-[var(--color-warning)]">
              Please select both start and end dates to view custom range data.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;