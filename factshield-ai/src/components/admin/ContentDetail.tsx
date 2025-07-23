import React, { useState } from 'react';
import type { Content } from '../../types/content';

interface ContentDetailProps {
  content: Content | null;
  onUpdate: (content: Content) => void;
  onCancel: () => void;
}

const ContentDetail: React.FC<ContentDetailProps> = ({
  content,
  onUpdate,
  onCancel
}) => {
  const [moderationNotes, setModerationNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle approve action
  const handleApprove = async () => {
    if (!content) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would make an API call
      const updatedContent = {
        ...content,
        status: 'approved' as const,
        moderationNotes: moderationNotes
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onUpdate(updatedContent);
      setModerationNotes('');
    } catch (error) {
      console.error('Error approving content:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reject action
  const handleReject = async () => {
    if (!content) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would make an API call
      const updatedContent = {
        ...content,
        status: 'rejected' as const,
        moderationNotes: moderationNotes
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onUpdate(updatedContent);
      setModerationNotes('');
    } catch (error) {
      console.error('Error rejecting content:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get risk level text and color based on risk score
  const getRiskLevel = (riskScore: number) => {
    if (riskScore >= 0.7) {
      return { text: 'High Risk', color: 'text-[var(--color-danger)]' };
    } else if (riskScore >= 0.4) {
      return { text: 'Medium Risk', color: 'text-[var(--color-warning)]' };
    } else {
      return { text: 'Low Risk', color: 'text-[var(--color-secondary)]' };
    }
  };

  // If no content is selected, show placeholder
  if (!content) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[var(--color-neutral-100)] rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[var(--color-neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">No Content Selected</h3>
        <p className="mt-2 text-sm text-[var(--color-neutral-500)] max-w-sm">
          Select an item from the content review queue to view details and take moderation actions.
        </p>
      </div>
    );
  }

  // Get risk level information
  const riskLevel = getRiskLevel(content.riskScore);

  // Mock claims for the selected content
  const mockClaims = [
    {
      id: '1',
      text: 'Global temperatures have risen by 10 degrees in the last year.',
      credibilityScore: 0.2,
      sources: [
        { url: 'https://example.com/climate-data', title: 'Climate Research Institute' }
      ]
    },
    {
      id: '2',
      text: 'Renewable energy sources now account for 30% of global energy production.',
      credibilityScore: 0.7,
      sources: [
        { url: 'https://example.com/energy-stats', title: 'Energy Statistics Database' }
      ]
    },
    {
      id: '3',
      text: 'Carbon emissions have decreased by 5% globally since 2020.',
      credibilityScore: 0.6,
      sources: [
        { url: 'https://example.com/emissions-data', title: 'Environmental Protection Agency' }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-neutral-200)]">
        <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">Content Details</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Basic info */}
        <div>
          <h4 className="text-base font-semibold text-[var(--color-neutral-900)] mb-2">{content.title}</h4>
          <div className="text-sm text-[var(--color-neutral-500)] break-all">
            <a href={content.source} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline">
              {content.source}
            </a>
          </div>
        </div>

        {/* Status and metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[var(--color-neutral-500)]">Status</div>
            <div className="mt-1 font-medium capitalize">{content.status}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-neutral-500)]">Content Type</div>
            <div className="mt-1 font-medium capitalize">{content.contentType}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-neutral-500)]">Submitted By</div>
            <div className="mt-1 font-medium">{content.submittedBy}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-neutral-500)]">Submitted Date</div>
            <div className="mt-1 font-medium">{content.submittedAt}</div>
          </div>
        </div>

        {/* Risk assessment */}
        <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-semibold text-[var(--color-neutral-900)]">Risk Assessment</h5>
            <span className={`text-sm font-bold ${riskLevel.color}`}>
              {riskLevel.text}
            </span>
          </div>
          <div className="w-full bg-[var(--color-neutral-200)] rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-danger)]" 
              style={{ width: `${content.riskScore * 100}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-[var(--color-neutral-500)]">
            Risk Score: {(content.riskScore * 100).toFixed(0)}%
          </div>
        </div>

        {/* Flag information */}
        <div>
          <h5 className="text-sm font-semibold text-[var(--color-neutral-900)] mb-2">Flag Information</h5>
          <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-[var(--color-neutral-500)]">Flagged By</div>
                <div className="mt-1 font-medium capitalize">{content.flaggedBy}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--color-neutral-500)]">Reason</div>
                <div className="mt-1 font-medium">{content.flagReason}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Claims */}
        <div>
          <h5 className="text-sm font-semibold text-[var(--color-neutral-900)] mb-2">Extracted Claims</h5>
          <div className="space-y-3">
            {mockClaims.map(claim => (
              <div key={claim.id} className="bg-[var(--color-neutral-50)] p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="text-sm text-[var(--color-neutral-900)]">{claim.text}</p>
                    <div className="mt-2 flex items-center">
                      <div className="text-xs text-[var(--color-neutral-500)]">Credibility:</div>
                      <div className="ml-2 w-24 bg-[var(--color-neutral-200)] rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            claim.credibilityScore < 0.4 
                              ? 'bg-[var(--color-danger)]' 
                              : claim.credibilityScore < 0.7 
                                ? 'bg-[var(--color-warning)]' 
                                : 'bg-[var(--color-secondary)]'
                          }`}
                          style={{ width: `${claim.credibilityScore * 100}%` }}
                        ></div>
                      </div>
                      <div className="ml-2 text-xs font-medium">
                        {(claim.credibilityScore * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-[var(--color-neutral-500)]">Sources:</div>
                      <ul className="mt-1 space-y-1">
                        {claim.sources.map((source, index) => (
                          <li key={index} className="text-xs">
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[var(--color-primary)] hover:underline"
                            >
                              {source.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Moderation notes */}
        <div>
          <label htmlFor="moderation-notes" className="block text-sm font-semibold text-[var(--color-neutral-900)] mb-2">
            Moderation Notes
          </label>
          <textarea
            id="moderation-notes"
            rows={4}
            value={moderationNotes}
            onChange={(e) => setModerationNotes(e.target.value)}
            placeholder="Add notes about your moderation decision..."
            className="block w-full rounded-lg border border-[var(--color-neutral-300)] shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
          ></textarea>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleApprove}
          disabled={isSubmitting || content.status === 'approved'}
          className={`flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
            ${content.status === 'approved'
              ? 'bg-[var(--color-neutral-300)] cursor-not-allowed'
              : 'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-700)]'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)]`}
        >
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : content.status === 'approved' ? (
            'Approved'
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve Content
            </>
          )}
        </button>
        <button
          onClick={handleReject}
          disabled={isSubmitting || content.status === 'rejected'}
          className={`flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
            ${content.status === 'rejected'
              ? 'bg-[var(--color-neutral-300)] cursor-not-allowed'
              : 'bg-[var(--color-danger)] hover:bg-[var(--color-danger-700)]'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-danger)]`}
        >
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : content.status === 'rejected' ? (
            'Rejected'
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject Content
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="sm:flex-initial inline-flex justify-center items-center px-4 py-2 border border-[var(--color-neutral-300)] rounded-lg shadow-sm text-sm font-medium text-[var(--color-neutral-700)] bg-white hover:bg-[var(--color-neutral-50)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ContentDetail;