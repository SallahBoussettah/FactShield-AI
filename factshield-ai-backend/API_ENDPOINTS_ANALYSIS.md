# Content Analysis API Endpoints Documentation

## Overview

This document outlines the API endpoints needed to support the frontend content analysis components based on the analysis of existing frontend components:

- `ContentUpload.tsx` - File upload and analysis
- `UrlAnalysis.tsx` - URL content analysis  
- `AnalysisResults.tsx` - Display analysis results

## Frontend Analysis Component Requirements

### 1. ContentUpload Component Analysis

**Functionality:**
- Drag-and-drop file upload
- File validation (size, type)
- Progress tracking during upload
- Support for multiple file types: PDF, TXT, DOC, DOCX, CSV, RTF
- Maximum file size: 10MB per file
- Real-time upload progress feedback

**Current Implementation:**
- Uses simulated upload with mock analysis results
- Calls `onFileAnalyzed` callback with results
- Handles file validation client-side

**API Requirements:**
- File upload endpoint with progress support
- Document parsing and text extraction
- Claim extraction and analysis
- Real-time progress updates (WebSocket or polling)

### 2. UrlAnalysis Component Analysis

**Functionality:**
- URL validation and content fetching
- Real-time analysis of web content
- Loading states and error handling
- Results display integration

**Current Implementation:**
- Uses simulated URL analysis with mock results
- Calls `onUrlAnalyzed` callback with results
- Client-side URL validation

**API Requirements:**
- URL content fetching and parsing
- HTML text extraction
- Metadata extraction
- Content analysis pipeline

### 3. AnalysisResults Component Analysis

**Functionality:**
- Display extracted claims with confidence scores
- Credibility assessment visualization
- Source citations with reliability scores
- Expandable claim details
- Color-coded credibility indicators

**Current Implementation:**
- Renders analysis results from both upload and URL analysis
- Shows claims, sources, and credibility scores
- Interactive UI for claim expansion

**Data Structure Requirements:**
- Consistent result format for both file and URL analysis
- Claim confidence and credibility scoring
- Source verification and reliability metrics

## Required API Endpoints

### 1. Document Upload and Analysis

#### POST /api/analyze/document
**Purpose:** Upload and analyze document files

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with file and optional metadata

```typescript
interface DocumentUploadRequest {
  file: File; // The uploaded document
  userId?: string; // User ID (from auth token)
  options?: {
    extractClaims: boolean;
    checkCredibility: boolean;
    language?: string;
  };
}
```

**Response:**
```typescript
interface DocumentAnalysisResponse {
  success: boolean;
  data: {
    analysisId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    status: 'processing' | 'completed' | 'failed';
    extractedText?: string;
    claims: Claim[];
    summary: string;
    processingTime: number;
  };
  message: string;
}
```

#### GET /api/analyze/document/:analysisId/progress
**Purpose:** Get upload and analysis progress

**Response:**
```typescript
interface ProgressResponse {
  success: boolean;
  data: {
    analysisId: string;
    status: 'uploading' | 'processing' | 'completed' | 'failed';
    progress: number; // 0-100
    currentStep: string;
    estimatedTimeRemaining?: number;
  };
}
```

### 2. URL Content Analysis

#### POST /api/analyze/url
**Purpose:** Analyze content from a URL

**Request:**
```typescript
interface UrlAnalysisRequest {
  url: string;
  userId?: string; // User ID (from auth token)
  options?: {
    extractClaims: boolean;
    checkCredibility: boolean;
    followRedirects: boolean;
    timeout?: number;
  };
}
```

**Response:**
```typescript
interface UrlAnalysisResponse {
  success: boolean;
  data: {
    analysisId: string;
    url: string;
    title: string;
    extractedText: string;
    metadata: {
      author?: string;
      publishDate?: string;
      domain: string;
      wordCount: number;
    };
    claims: Claim[];
    summary: string;
    processingTime: number;
  };
  message: string;
}
```

### 3. Text Analysis (Direct)

#### POST /api/analyze/text
**Purpose:** Analyze raw text content

**Request:**
```typescript
interface TextAnalysisRequest {
  text: string;
  userId?: string;
  source?: string; // Optional source identifier
  options?: {
    extractClaims: boolean;
    checkCredibility: boolean;
    language?: string;
  };
}
```

**Response:**
```typescript
interface TextAnalysisResponse {
  success: boolean;
  data: {
    analysisId: string;
    textLength: number;
    claims: Claim[];
    summary: string;
    processingTime: number;
  };
  message: string;
}
```

### 4. Analysis Results Retrieval

#### GET /api/analyze/result/:analysisId
**Purpose:** Get detailed analysis results

**Response:**
```typescript
interface AnalysisResultResponse {
  success: boolean;
  data: {
    id: string;
    userId: string;
    source: {
      type: 'document' | 'url' | 'text';
      content: string;
      metadata?: any;
    };
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
    completedAt?: string;
    results: {
      summary: string;
      claims: Claim[];
      extractedText?: string;
      metadata?: any;
    };
    processingTime?: number;
  };
}
```

## Data Models

### Claim Model
```typescript
interface Claim {
  id: string;
  text: string;
  confidence: number; // 0-1, confidence in claim extraction
  credibilityScore: number; // 0-1, credibility assessment
  category?: string; // Type of claim (factual, opinion, etc.)
  sources: Source[];
  context?: string; // Surrounding text context
  position?: {
    start: number;
    end: number;
  }; // Position in original text
}
```

### Source Model
```typescript
interface Source {
  url: string;
  title: string;
  reliability: number; // 0-1, source reliability score
  domain: string;
  publishDate?: string;
  author?: string;
  relevanceScore?: number; // How relevant to the claim
  factCheckResult?: 'supports' | 'contradicts' | 'neutral';
}
```

## Error Handling

### Standard Error Response
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

### Common Error Codes
- `INVALID_FILE_TYPE` - Unsupported file format
- `FILE_TOO_LARGE` - File exceeds size limit
- `INVALID_URL` - URL format invalid or inaccessible
- `PROCESSING_FAILED` - Analysis pipeline failure
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INSUFFICIENT_CONTENT` - Not enough content to analyze

## Authentication & Authorization

All analysis endpoints should:
- Accept optional authentication via JWT token
- Store analysis history for authenticated users
- Apply rate limiting based on user status
- Provide enhanced features for authenticated users

## Rate Limiting

- Anonymous users: 10 requests per hour
- Authenticated users: 100 requests per hour
- Premium users: 1000 requests per hour

## File Upload Constraints

- Maximum file size: 10MB
- Supported formats: PDF, TXT, DOC, DOCX, CSV, RTF
- Maximum concurrent uploads per user: 3
- File retention: 30 days for authenticated users, 1 day for anonymous

## Implementation Priority

1. **Phase 1:** Basic text analysis endpoint
2. **Phase 2:** URL content fetching and analysis
3. **Phase 3:** Document upload and parsing
4. **Phase 4:** Advanced features (progress tracking, WebSocket updates)
5. **Phase 5:** External API integrations and enhanced fact-checking

## Frontend Integration Points

The frontend components expect:
1. Consistent response format across all analysis types
2. Progress tracking for long-running operations
3. Error handling with user-friendly messages
4. Real-time updates for analysis status
5. Caching of results for repeated requests

## Next Steps

1. Implement URL fetching and parsing service (Task 13.2)
2. Build document processing service (Task 13.3)
3. Integrate claim extraction with Hugging Face (Task 13.4)
4. Implement fact-checking and credibility assessment (Task 13.5)
5. Add translation support for multi-language content (Task 13.6)