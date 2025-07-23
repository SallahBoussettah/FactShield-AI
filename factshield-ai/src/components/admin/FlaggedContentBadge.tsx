import React from 'react';

interface FlaggedContentBadgeProps {
  count: number;
  onClick?: () => void;
}

const FlaggedContentBadge: React.FC<FlaggedContentBadgeProps> = ({ count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-neutral-50)] hover:bg-[var(--color-neutral-100)] rounded-lg transition-colors"
    >
      <div className="relative">
        <svg className="w-6 h-6 text-[var(--color-neutral-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-[var(--color-danger)] text-white text-xs font-bold rounded-full">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      <div className="text-left">
        <div className="text-sm font-medium text-[var(--color-neutral-900)]">Flagged Content</div>
        <div className="text-xs text-[var(--color-neutral-500)]">
          {count} {count === 1 ? 'item' : 'items'} pending review
        </div>
      </div>
    </button>
  );
};

export default FlaggedContentBadge;