export interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  claims: Claim[];
  summary: string;
}

export interface Claim {
  id: string;
  text: string;
  confidence: number;
  credibilityScore: number;
  sources: Source[];
}

export interface Source {
  url: string;
  title: string;
  reliability: number;
}

export interface ContentUploadProps {
  onFileAnalyzed?: (fileId: string, results: AnalysisResult) => void;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  allowedExtensions?: string[];
}

export interface UrlAnalysisProps {
  onUrlAnalyzed?: (url: string, results: AnalysisResult) => void;
}