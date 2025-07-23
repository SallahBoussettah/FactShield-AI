import type { HistoryItem, HistoryFilter, PaginationState } from '../types/history';
import type { AnalysisResult } from '../types/upload';

// Mock data for development purposes
const mockHistoryData: HistoryItem[] = [
  {
    id: '1',
    userId: 'user123',
    analysisId: 'analysis1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    source: {
      type: 'url',
      content: 'https://example.com/news/article1',
    },
    summary: 'Analysis of news article about climate change',
    credibilityScore: 0.85,
    claimsCount: 5
  },
  {
    id: '2',
    userId: 'user123',
    analysisId: 'analysis2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    source: {
      type: 'document',
      content: 'research-paper.pdf',
      documentId: 'doc1'
    },
    summary: 'Analysis of research paper on vaccine efficacy',
    credibilityScore: 0.92,
    claimsCount: 12
  },
  {
    id: '3',
    userId: 'user123',
    analysisId: 'analysis3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    source: {
      type: 'text',
      content: 'Social media post about political event',
    },
    summary: 'Analysis of viral social media post claiming election fraud',
    credibilityScore: 0.35,
    claimsCount: 3
  },
  {
    id: '4',
    userId: 'user123',
    analysisId: 'analysis4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    source: {
      type: 'url',
      content: 'https://example.com/blog/health-tips',
    },
    summary: 'Analysis of health blog post about nutrition',
    credibilityScore: 0.78,
    claimsCount: 8
  },
  {
    id: '5',
    userId: 'user123',
    analysisId: 'analysis5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    source: {
      type: 'document',
      content: 'financial-report-q2.pdf',
      documentId: 'doc2'
    },
    summary: 'Analysis of quarterly financial report',
    credibilityScore: 0.95,
    claimsCount: 15
  },
  {
    id: '6',
    userId: 'user123',
    analysisId: 'analysis6',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    source: {
      type: 'url',
      content: 'https://example.com/science/discovery',
    },
    summary: 'Analysis of article about new scientific discovery',
    credibilityScore: 0.88,
    claimsCount: 6
  },
  {
    id: '7',
    userId: 'user123',
    analysisId: 'analysis7',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
    source: {
      type: 'text',
      content: 'Press release about product launch',
    },
    summary: 'Analysis of company press release about new product',
    credibilityScore: 0.75,
    claimsCount: 4
  },
  {
    id: '8',
    userId: 'user123',
    analysisId: 'analysis8',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days ago
    source: {
      type: 'document',
      content: 'policy-document.pdf',
      documentId: 'doc3'
    },
    summary: 'Analysis of government policy document',
    credibilityScore: 0.91,
    claimsCount: 18
  }
];

// Function to get paginated and filtered history
export const getUserHistory = async (
  userId: string,
  page: number = 1,
  itemsPerPage: number = 10,
  filters: HistoryFilter = {}
): Promise<{ items: HistoryItem[], pagination: PaginationState }> => {
  // In a real app, this would be an API call
  // For now, we'll simulate with the mock data and setTimeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // Apply filters
      let filteredData = [...mockHistoryData];
      
      // Filter by search term
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.summary.toLowerCase().includes(term) || 
          item.source.content.toLowerCase().includes(term)
        );
      }
      
      // Filter by date range
      if (filters.dateRange) {
        if (filters.dateRange.start) {
          filteredData = filteredData.filter(item => 
            new Date(item.timestamp) >= filters.dateRange!.start!
          );
        }
        if (filters.dateRange.end) {
          filteredData = filteredData.filter(item => 
            new Date(item.timestamp) <= filters.dateRange!.end!
          );
        }
      }
      
      // Filter by source type
      if (filters.sourceType && filters.sourceType !== 'all') {
        filteredData = filteredData.filter(item => 
          item.source.type === filters.sourceType
        );
      }
      
      // Filter by credibility score range
      if (filters.credibilityRange) {
        filteredData = filteredData.filter(item => 
          item.credibilityScore >= filters.credibilityRange!.min &&
          item.credibilityScore <= filters.credibilityRange!.max
        );
      }
      
      // Calculate pagination
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      resolve({
        items: paginatedData,
        pagination: {
          currentPage: page,
          itemsPerPage,
          totalItems,
          totalPages
        }
      });
    }, 500); // Simulate network delay
  });
};

// Function to get a specific history item
export const getHistoryItem = async (historyId: string): Promise<HistoryItem | null> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = mockHistoryData.find(item => item.id === historyId) || null;
      resolve(item);
    }, 300);
  });
};

// Function to get analysis results for a history item
export const getHistoryItemResults = async (analysisId: string): Promise<AnalysisResult | null> => {
  // In a real app, this would be an API call
  // For now, we'll return a mock result
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find the history item first
      const historyItem = mockHistoryData.find(item => item.analysisId === analysisId);
      
      if (!historyItem) {
        resolve(null);
        return;
      }
      
      // Create a mock analysis result based on the history item
      const mockResult: AnalysisResult = {
        id: historyItem.analysisId,
        fileName: historyItem.source.type === 'document' 
          ? historyItem.source.content 
          : historyItem.source.type === 'url' 
            ? new URL(historyItem.source.content).hostname
            : 'Text Analysis',
        summary: historyItem.summary,
        claims: Array(historyItem.claimsCount).fill(0).map((_, i) => ({
          id: `claim-${i}`,
          text: `This is a mock claim ${i + 1} for analysis ${historyItem.analysisId}`,
          confidence: 0.7 + Math.random() * 0.3,
          credibilityScore: historyItem.credibilityScore * (0.8 + Math.random() * 0.4),
          sources: [
            {
              url: 'https://example.com/source1',
              title: 'Example Source 1',
              reliability: 0.8 + Math.random() * 0.2
            },
            {
              url: 'https://example.com/source2',
              title: 'Example Source 2',
              reliability: 0.6 + Math.random() * 0.3
            }
          ]
        }))
      };
      
      resolve(mockResult);
    }, 500);
  });
};

// Function to delete a history item
export const deleteHistoryItem = async (historyId: string): Promise<boolean> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful deletion
      console.log(`Deleting history item with ID: ${historyId}`);
      // In a real implementation, we would delete the item with the given historyId
      resolve(true);
    }, 300);
  });
};

// Function to save an analysis result to history
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const saveToHistory = async (
  userId: string, 
  result: AnalysisResult, 
  sourceType: 'url' | 'text' | 'document',
  sourceContent: string
): Promise<HistoryItem> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate average credibility score from claims
      const avgCredibility = result.claims.reduce(
        (sum, claim) => sum + claim.credibilityScore, 0
      ) / result.claims.length;
      
      const newHistoryItem: HistoryItem = {
        id: `history-${Date.now()}`,
        userId, // Using userId parameter here
        analysisId: result.id,
        timestamp: new Date().toISOString(),
        source: {
          type: sourceType,
          content: sourceContent,
          documentId: sourceType === 'document' ? `doc-${Date.now()}` : undefined
        },
        summary: result.summary,
        credibilityScore: avgCredibility,
        claimsCount: result.claims.length
      };
      
      // In a real app, we would save this to the database with the userId
      resolve(newHistoryItem);
    }, 300);
  });
};