import React, { useState, useRef, useCallback } from 'react';
import type { UploadedFile, ContentUploadProps, AnalysisResult } from '../../types/upload';

const ContentUpload: React.FC<ContentUploadProps> = ({ 
  onFileAnalyzed,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  allowedFileTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'application/rtf'
  ],
  allowedExtensions = ['.pdf', '.txt', '.doc', '.docx', '.csv', '.rtf']
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size exceeds ${(maxFileSize / 1024 / 1024).toFixed(0)}MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedFileTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      return `File type not supported. Allowed types: ${allowedExtensions.join(', ').toUpperCase()}`;
    }

    return null;
  }, [maxFileSize, allowedFileTypes, allowedExtensions]);

  const simulateFileUpload = useCallback((file: File): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Simulate analysis results
          setTimeout(() => {
            resolve({
              id: Date.now().toString(),
              fileName: file.name,
              claims: [
                {
                  id: '1',
                  text: 'Sample claim extracted from document',
                  confidence: 0.85,
                  credibilityScore: 0.72,
                  sources: [
                    {
                      url: 'https://example.com/source1',
                      title: 'Reliable Source 1',
                      reliability: 0.9
                    }
                  ]
                }
              ],
              summary: 'Document analysis completed successfully'
            });
          }, 500);
        }
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === file ? { ...f, progress } : f
          )
        );
      }, 200);
    });
  }, []);

  const processFile = useCallback(async (file: File) => {
    const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // Add file to uploaded files list
    const uploadedFile: UploadedFile = {
      file,
      id: fileId,
      progress: 0,
      status: 'uploading'
    };

    setUploadedFiles(prev => [...prev, uploadedFile]);

    try {
      const results = await simulateFileUpload(file);
      
      // Update file status to completed
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'completed', progress: 100 }
            : f
        )
      );

      // Notify parent component
      onFileAnalyzed?.(fileId, results);
      
    } catch (error) {
      // Update file status to error
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : f
        )
      );
    }
  }, [simulateFileUpload, onFileAnalyzed]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      // Check if file is already uploaded
      const isDuplicate = uploadedFiles.some(uploadedFile => 
        uploadedFile.file.name === file.name && 
        uploadedFile.file.size === file.size &&
        uploadedFile.status !== 'error'
      );

      if (isDuplicate) {
        // Skip duplicate files
        return;
      }

      const validationError = validateFile(file);
      
      if (validationError) {
        // Add file with error status
        const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        setUploadedFiles(prev => [...prev, {
          file,
          id: fileId,
          progress: 0,
          status: 'error',
          error: validationError
        }]);
      } else {
        processFile(file);
      }
    });
  }, [uploadedFiles, validateFile, processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
            : 'border-[var(--color-neutral-300)] hover:border-[var(--color-primary)]/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedExtensions.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload files for analysis"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`
              p-4 rounded-full transition-colors duration-200
              ${isDragOver 
                ? 'bg-[var(--color-primary)] text-white' 
                : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)]'
              }
            `}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-2">
              {isDragOver ? 'Drop files here' : 'Upload Documents for Analysis'}
            </h3>
            <p className="text-[var(--color-neutral-600)] mb-4">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-[var(--color-neutral-500)]">
              Supported formats: {allowedExtensions.join(', ').toUpperCase()} (Max {(maxFileSize / 1024 / 1024).toFixed(0)}MB each)
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Choose Files
          </button>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-[var(--color-neutral-900)]">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          <div className="space-y-3">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="bg-white border border-[var(--color-neutral-200)] rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-2 rounded-lg
                      ${uploadedFile.status === 'completed' 
                        ? 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]'
                        : uploadedFile.status === 'error'
                        ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
                        : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      }
                    `}>
                      {uploadedFile.status === 'completed' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : uploadedFile.status === 'error' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium text-[var(--color-neutral-900)]">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-sm text-[var(--color-neutral-600)]">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="p-1 text-[var(--color-neutral-400)] hover:text-[var(--color-danger)] transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Progress Bar */}
                {uploadedFile.status === 'uploading' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-[var(--color-neutral-600)] mb-1">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadedFile.progress)}%</span>
                    </div>
                    <div className="w-full bg-[var(--color-neutral-200)] rounded-full h-2">
                      <div
                        className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Status Messages */}
                {uploadedFile.status === 'completed' && (
                  <div className="text-sm text-[var(--color-secondary)] font-medium">
                    ✓ Analysis completed successfully
                  </div>
                )}
                
                {uploadedFile.status === 'error' && uploadedFile.error && (
                  <div className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/5 p-2 rounded">
                    ⚠ {uploadedFile.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentUpload;