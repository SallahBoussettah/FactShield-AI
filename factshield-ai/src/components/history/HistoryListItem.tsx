import React, { useState } from 'react';
import type { HistoryItem } from '../../types/history';

interface HistoryListItemProps {
  item: HistoryItem;
  onView: () => void;
  onDelete: () => void;
}

const HistoryListItem: React.FC<HistoryListItemProps> = ({ item, onView, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Get source icon based on type
  const getSourceIcon = () => {
    switch (item.source.type) {
      case 'url':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'text':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
    }
  };
  
  // Get credibility badge color and text
  const getCredibilityBadge = () => {
    if (item.credibilityScore >= 0.8) {
      return {
        color: 'var(--color-secondary)',
        bgColor: 'var(--color-secondary)/10',
        text: 'High'
      };
    } else if (item.credibilityScore >= 0.6) {
      return {
        color: 'var(--color-warning)',
        bgColor: 'var(--color-warning)/10',
        text: 'Medium'
      };
    } else {
      return {
        color: 'var(--color-danger)',
        bgColor: 'var(--color-danger)/10',
        text: 'Low'
      };
    }
  };
  
  const credibilityBadge = getCredibilityBadge();
  
  // Format source content for display
  const formatSourceContent = () => {
    if (item.source.type === 'url') {
      try {
        const url = new URL(item.source.content);
        return url.hostname;
      } catch {
        return item.source.content;
      }
    }
    return item.source.content;
  };

  return (
    <tr className="hover:bg-[var(--color-neutral-50)] transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="p-2 bg-[var(--color-neutral-100)] rounded-lg mr-3">
            <div className="text-[var(--color-neutral-600)]">
              {getSourceIcon()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-[var(--color-neutral-900)]">
              {formatSourceContent()}
            </div>
            <div className="text-xs text-[var(--color-neutral-500)]">
              {item.source.type.charAt(0).toUpperCase() + item.source.type.slice(1)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-[var(--color-neutral-900)] line-clamp-2">
          {item.summary}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-[var(--color-neutral-900)]">
          {formatDate(item.timestamp)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: `${credibilityBadge.bgColor}`,
            color: credibilityBadge.color
          }}
        >
          {credibilityBadge.text} ({Math.round(item.credibilityScore * 100)}%)
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-[var(--color-neutral-900)]">
          {item.claimsCount} {item.claimsCount === 1 ? 'claim' : 'claims'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {showDeleteConfirm ? (
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="text-[var(--color-danger)] hover:text-[var(--color-danger)]/80"
            >
              Confirm
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={onView}
              className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80"
            >
              View
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-[var(--color-neutral-500)] hover:text-[var(--color-danger)]"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default HistoryListItem;