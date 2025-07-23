import React, { useState } from 'react';
import ContentReviewQueue from './ContentReviewQueue';
import ContentDetail from './ContentDetail';
import type { Content } from '../../types/content';

// Mock data for demonstration
const mockContent = [
  {
    id: '1',
    title: 'Climate Change Article',
    source: 'https://example.com/climate-article',
    submittedBy: 'alex@example.com',
    submittedAt: '2023-07-20',
    status: 'pending',
    flagReason: 'Potentially misleading claims',
    flaggedBy: 'system',
    contentType: 'article',
    claimCount: 5,
    riskScore: 0.75
  },
  {
    id: '2',
    title: 'COVID-19 Research Paper',
    source: 'https://example.com/covid-research',
    submittedBy: 'maria@example.com',
    submittedAt: '2023-07-21',
    status: 'pending',
    flagReason: 'Unverified sources',
    flaggedBy: 'user',
    contentType: 'document',
    claimCount: 12,
    riskScore: 0.65
  },
  {
    id: '3',
    title: 'Economic Policy Analysis',
    source: 'https://example.com/economic-policy',
    submittedBy: 'sam@example.com',
    submittedAt: '2023-07-19',
    status: 'approved',
    flagReason: 'Statistical inaccuracies',
    flaggedBy: 'system',
    contentType: 'article',
    claimCount: 8,
    riskScore: 0.45
  },
  {
    id: '4',
    title: 'Vaccine Information',
    source: 'https://example.com/vaccine-info',
    submittedBy: 'taylor@example.com',
    submittedAt: '2023-07-22',
    status: 'rejected',
    flagReason: 'Misinformation',
    flaggedBy: 'editor',
    contentType: 'article',
    claimCount: 7,
    riskScore: 0.85
  },
  {
    id: '5',
    title: 'Political Speech Transcript',
    source: 'https://example.com/political-speech',
    submittedBy: 'jordan@example.com',
    submittedAt: '2023-07-18',
    status: 'pending',
    flagReason: 'Factual inaccuracies',
    flaggedBy: 'user',
    contentType: 'transcript',
    claimCount: 15,
    riskScore: 0.70
  },
  {
    id: '6',
    title: 'Health Supplement Research',
    source: 'https://example.com/health-supplement',
    submittedBy: 'jamie@example.com',
    submittedAt: '2023-07-17',
    status: 'pending',
    flagReason: 'Misleading claims',
    flaggedBy: 'system',
    contentType: 'document',
    claimCount: 9,
    riskScore: 0.60
  },
  {
    id: '7',
    title: 'Environmental Impact Report',
    source: 'https://example.com/environmental-report',
    submittedBy: 'casey@example.com',
    submittedAt: '2023-07-16',
    status: 'approved',
    flagReason: 'Data inconsistencies',
    flaggedBy: 'analyst',
    contentType: 'document',
    claimCount: 20,
    riskScore: 0.40
  },
  {
    id: '8',
    title: 'Social Media Trend Analysis',
    source: 'https://example.com/social-media-trends',
    submittedBy: 'riley@example.com',
    submittedAt: '2023-07-15',
    status: 'rejected',
    flagReason: 'Unverified claims',
    flaggedBy: 'editor',
    contentType: 'article',
    claimCount: 6,
    riskScore: 0.80
  }
];

const ContentModeration: React.FC = () => {
  const [content, setContent] = useState<Content[]>(mockContent as Content[]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Filter content based on search term and filters
  const filteredContent = content.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      item.status === statusFilter;

    const matchesType =
      typeFilter === 'all' ||
      item.contentType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle content selection
  const handleSelectContent = (content: Content) => {
    setSelectedContent(content);
  };

  // Handle content update (approve/reject)
  const handleUpdateContent = (updatedContent: Content) => {
    setContent(content.map(item =>
      item.id === updatedContent.id ? updatedContent : item
    ));
    setSelectedContent(updatedContent);
  };

  // Handle content deletion
  const handleDeleteContent = (contentId: string) => {
    // In a real app, this would make an API call
    setContent(content.filter(item => item.id !== contentId));
    if (selectedContent && selectedContent.id === contentId) {
      setSelectedContent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
          Content Moderation
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-[var(--color-neutral-500)]">
            Queue Status:
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-warning)] text-white">
            {content.filter(item => item.status === 'pending').length} Pending
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content review queue */}
        <div className="lg:col-span-2">
          <ContentReviewQueue
            content={filteredContent}
            selectedContentId={selectedContent?.id}
            onSelectContent={handleSelectContent}
            onDeleteContent={handleDeleteContent}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />
        </div>

        {/* Content detail */}
        <div className="lg:col-span-1">
          <ContentDetail
            content={selectedContent}
            onUpdate={handleUpdateContent}
            onCancel={() => setSelectedContent(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentModeration;