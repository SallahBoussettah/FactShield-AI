export interface HistoryItem {
  id: string;
  userId: string;
  analysisId: string;
  timestamp: string;
  source: {
    type: 'url' | 'text' | 'document';
    content: string;
    documentId?: string;
  };
  summary: string;
  credibilityScore: number;
  claimsCount: number;
}

export interface HistoryFilter {
  searchTerm?: string;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  sourceType?: 'url' | 'text' | 'document' | 'all';
  credibilityRange?: {
    min: number;
    max: number;
  };
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}