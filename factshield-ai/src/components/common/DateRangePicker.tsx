import React, { useState } from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  const handleApply = () => {
    onChange(localStartDate, localEndDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
    setIsOpen(false);
  };

  // Predefined date ranges
  const presetRanges = [
    { label: 'Today', start: getTodayDate(), end: getTodayDate() },
    { label: 'Yesterday', start: getYesterdayDate(), end: getYesterdayDate() },
    { label: 'Last 7 Days', start: getDateBefore(7), end: getTodayDate() },
    { label: 'Last 30 Days', start: getDateBefore(30), end: getTodayDate() },
    { label: 'This Month', start: getFirstDayOfMonth(), end: getTodayDate() },
    { label: 'Last Month', start: getFirstDayOfLastMonth(), end: getLastDayOfLastMonth() }
  ];

  function getTodayDate() {
    const today = new Date();
    return formatDate(today);
  }

  function getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDate(yesterday);
  }

  function getDateBefore(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return formatDate(date);
  }

  function getFirstDayOfMonth() {
    const date = new Date();
    date.setDate(1);
    return formatDate(date);
  }

  function getFirstDayOfLastMonth() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    date.setDate(1);
    return formatDate(date);
  }

  function getLastDayOfLastMonth() {
    const date = new Date();
    date.setDate(0);
    return formatDate(date);
  }

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDisplayDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-white border border-[var(--color-neutral-200)] rounded-lg text-sm text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>
          {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
        </span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 border border-[var(--color-neutral-200)]">
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={localStartDate}
                onChange={(e) => setLocalStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                End Date
              </label>
              <input
                type="date"
                value={localEndDate}
                onChange={(e) => setLocalEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-md text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Preset Ranges
              </label>
              <div className="grid grid-cols-2 gap-2">
                {presetRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setLocalStartDate(range.start);
                      setLocalEndDate(range.end);
                    }}
                    className="px-3 py-1 text-xs border border-[var(--color-neutral-200)] rounded-md hover:bg-[var(--color-neutral-50)]"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm border border-[var(--color-neutral-300)] rounded-md hover:bg-[var(--color-neutral-50)]"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-3 py-1 text-sm bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-600)]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;