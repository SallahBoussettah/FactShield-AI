import React from 'react';
import type { Content } from '../../types/content';

interface ContentReviewQueueProps {
  content: Content[];
  selectedContentId?: string;
  onSelectContent: (content: Content) => void;
  onDeleteContent: (contentId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
}

const ContentReviewQueue: React.FC<ContentReviewQueueProps> = ({
  content,
  selectedContentId,
  onSelectContent,
  onDeleteContent,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange
}) => {
  // Get status badge color based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[var(--color-warning)] text-white';
      case 'approved':
        return 'bg-[var(--color-secondary)] text-white';
      case 'rejected':
        return 'bg-[var(--color-danger)] text-white';
      default:
        return 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)]';
    }
  };

  // Get risk level badge color based on risk score
  const getRiskBadgeClass = (riskScore: number) => {
    if (riskScore >= 0.7) {
      return 'bg-[var(--color-danger)] text-white';
    } else if (riskScore >= 0.4) {
      return 'bg-[var(--color-warning)] text-white';
    } else {
      return 'bg-[var(--color-secondary)] text-white';
    }
  };

  // Get risk level text based on risk score
  const getRiskLevelText = (riskScore: number) => {
    if (riskScore >= 0.7) {
      return 'High';
    } else if (riskScore >= 0.4) {
      return 'Medium';
    } else {
      return 'Low';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-[var(--color-neutral-200)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search content..."
              className="block w-full pl-10 pr-3 py-2 border border-[var(--color-neutral-300)] rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm"
            />
          </div>

          {/* Status filter */}
          <div className="flex-shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="block w-full py-2 px-3 border border-[var(--color-neutral-300)] rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="flex-shrink-0">
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              className="block w-full py-2 px-3 border border-[var(--color-neutral-300)] rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm"
            >
              <option value="all">All Types</option>
              <option value="article">Article</option>
              <option value="document">Document</option>
              <option value="transcript">Transcript</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-[var(--color-neutral-500)]">
          Showing {content.length} results
        </div>
      </div>

      {/* Content list */}
      <div className="overflow-x-auto">
        {content.length === 0 ? (
          <div className="p-6 text-center text-[var(--color-neutral-500)]">
            No content found matching your filters.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-[var(--color-neutral-200)]">
            <thead className="bg-[var(--color-neutral-50)]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Content
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Risk Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--color-neutral-200)]">
              {content.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-[var(--color-neutral-50)] cursor-pointer ${
                    selectedContentId === item.id ? 'bg-[var(--color-primary-50)]' : ''
                  }`}
                  onClick={() => onSelectContent(item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-[var(--color-neutral-900)]">
                          {item.title}
                        </div>
                        <div className="text-xs text-[var(--color-neutral-500)] truncate max-w-xs">
                          {item.source}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--color-neutral-900)] capitalize">
                      {item.contentType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeClass(item.riskScore)}`}>
                      {getRiskLevelText(item.riskScore)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-neutral-500)]">
                    {item.submittedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteContent(item.id);
                      }}
                      className="text-[var(--color-neutral-400)] hover:text-[var(--color-danger)] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-[var(--color-neutral-200)] sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-[var(--color-neutral-300)] text-sm font-medium rounded-md text-[var(--color-neutral-700)] bg-white hover:bg-[var(--color-neutral-50)]">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-[var(--color-neutral-300)] text-sm font-medium rounded-md text-[var(--color-neutral-700)] bg-white hover:bg-[var(--color-neutral-50)]">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--color-neutral-700)]">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{content.length}</span> of{' '}
              <span className="font-medium">{content.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[var(--color-neutral-300)] bg-white text-sm font-medium text-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-50)]">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-[var(--color-neutral-300)] bg-white text-sm font-medium text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-50)]">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[var(--color-neutral-300)] bg-white text-sm font-medium text-[var(--color-neutral-500)] hover:bg-[var(--color-neutral-50)]">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentReviewQueue;