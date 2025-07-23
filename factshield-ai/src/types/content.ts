export interface Content {
  id: string;
  title: string;
  source: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  flagReason: string;
  flaggedBy: string;
  contentType: 'article' | 'document' | 'transcript' | string;
  claimCount: number;
  riskScore: number;
  moderationNotes?: string;
}

export interface Claim {
  id: string;
  text: string;
  credibilityScore: number;
  sources: Source[];
}

export interface Source {
  url: string;
  title: string;
  reliability?: number;
}