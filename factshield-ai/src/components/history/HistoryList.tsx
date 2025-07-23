import React from 'react';
import type { HistoryItem, PaginationState } from '../../types/history';
import HistoryListItem from './HistoryListItem';
import Pagination from './Pagination';

interface HistoryListProps {
  items: HistoryItem[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onViewItem: (item: HistoryItem) => void;
  onDeleteItem: (item: HistoryItem) => void;
  isLoading: boolean;
}

const HistoryList: React.FC<HistoryListProps> = ({
  items,
  pagination,
  onPageChange,
  onViewItem,
  onDeleteItem,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-neutral-200)]">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-[var(--color-neutral-200)]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[var(--color-neutral-100)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[var(--color-neutral-900)] mb-2">No history found</h3>
          <p className="text-[var(--color-neutral-600)]">
            No analysis history matches your current filters. Try adjusting your search criteria or analyze some content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-neutral-200)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-neutral-200)]">
            <thead className="bg-[var(--color-neutral-50)]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Source
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Summary
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Credibility
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Claims
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--color-neutral-200)]">
              {items.map((item) => (
                <HistoryListItem 
                  key={item.id} 
                  item={item} 
                  onView={() => onViewItem(item)} 
                  onDelete={() => onDeleteItem(item)} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {pagination.totalPages > 1 && (
        <Pagination 
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default HistoryList;