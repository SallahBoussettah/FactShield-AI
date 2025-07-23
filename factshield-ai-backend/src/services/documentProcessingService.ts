import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import csv from 'csv-parser';
import { logger } from '../utils/logger';

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

export interface DocumentMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  pageCount?: number;
  wordCount: number;
  characterCount: number;
  language?: string;
  author?: string;
  title?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface ProcessedDocument {
  id: string;
  fileName: string;
  extractedText: string;
  metadata: DocumentMetadata;
  processingTime: number;
}

export interface DocumentProcessingOptions {
  maxFileSize?: number;
  preserveFormatting?: boolean;
  extractImages?: boolean;
  language?: string;
}

class DocumentProcessingService {
  private readonly supportedMimeTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'application/rtf'
  ];

  private readonly supportedExtensions = [
    '.pdf', '.txt', '.doc', '.docx', '.csv', '.rtf'
  ];

  private readonly defaultOptions: Required<DocumentProcessingOptions> = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    preserveFormatting: false,
    extractImages: false,
    language: 'en'
  };

  /**
   * Validate file type and size
   */
  private validateFile(filePath: string, mimeType: string, fileSize: number, options: DocumentProcessingOptions): void {
    const config = { ...this.defaultOptions, ...options };
    
    // Check file size
    if (fileSize > config.maxFileSize) {
      throw new Error(`File size exceeds limit of ${(config.maxFileSize / 1024 / 1024).toFixed(0)}MB`);
    }

    // Check MIME type
    if (!this.supportedMimeTypes.includes(mimeType)) {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    // Check file extension
    const extension = path.extname(filePath).toLowerCase();
    if (!this.supportedExtensions.includes(extension)) {
      throw new Error(`Unsupported file extension: ${extension}`);
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
  }

  /**
   * Process PDF documents
   */
  private async processPdf(filePath: string): Promise<{ text: string; metadata: Partial<DocumentMetadata> }> {
    try {
      const buffer = await readFile(filePath);
      const data = await pdfParse(buffer);

      return {
        text: data.text,
        metadata: {
          pageCount: data.numpages,
          title: data.info?.Title,
          author: data.info?.Author,
          createdDate: data.info?.CreationDate,
          modifiedDate: data.info?.ModDate
        }
      };
    } catch (error) {
      throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process Word documents (.docx)
   */
  private async processDocx(filePath: string): Promise<{ text: string; metadata: Partial<DocumentMetadata> }> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      
      if (result.messages.length > 0) {
        logger.warn('DOCX processing warnings:', result.messages);
      }

      return {
        text: result.value,
        metadata: {
          // DOCX metadata would need additional parsing
          // For now, we'll extract basic info
        }
      };
    } catch (error) {
      throw new Error(`Failed to process DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process legacy Word documents (.doc)
   */
  private async processDoc(filePath: string): Promise<{ text: string; metadata: Partial<DocumentMetadata> }> {
    try {
      // For .doc files, we'll use a basic text extraction
      // In a production environment, you might want to use a more sophisticated library
      const buffer = await readFile(filePath);
      
      // Basic text extraction from .doc files (this is a simplified approach)
      // In reality, you'd want to use a proper .doc parser
      const text = buffer.toString('utf8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      
      return {
        text: text.trim(),
        metadata: {}
      };
    } catch (error) {
      throw new Error(`Failed to process DOC: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process plain text files
   */
  private async processText(filePath: string): Promise<{ text: string; metadata: Partial<DocumentMetadata> }> {
    try {
      const text = await readFile(filePath, 'utf8');
      
      return {
        text,
        metadata: {}
      };
    } catch (error) {
      throw new Error(`Failed to process text file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process CSV files
   */
  private async processCsv(filePath: string): Promise<{ text: string; metadata: Partial<DocumentMetadata> }> {
    return new Promise((resolve, reject) => {
      const rows: any[] = [];
      let headers: string[] = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headerList) => {
          headers = headerList;
        })
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          try {
            // Convert CSV data to readable text
            let text = `Headers: ${headers.join(', ')}\n\n`;
            
            rows.forEach((row, index) => {
              text += `Row ${index + 1}:\n`;
              headers.forEach(header => {
                text += `${header}: ${row[header] || ''}\n`;
              });
              text += '\n';
            });

            resolve({
              text,
              metadata: {
                // Add CSV-specific metadata
              }
            });
          } catch (error) {
            reject(new Error(`Failed to process CSV data: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
        })
        .on('error', (error) => {
          reject(new Error(`Failed to read CSV file: ${error.message}`));
        });
    });
  }

  /**
   * Process RTF files
   */
  private async processRtf(filePath: string): Promise<{ text: string; metadata: Partial<DocumentMetadata> }> {
    try {
      const buffer = await readFile(filePath);
      const content = buffer.toString('utf8');
      
      // Basic RTF text extraction (simplified)
      // Remove RTF control codes and extract plain text
      let text = content
        .replace(/\\[a-z]+\d*\s?/g, '') // Remove RTF control words
        .replace(/[{}]/g, '') // Remove braces
        .replace(/\\\\/g, '\\') // Unescape backslashes
        .replace(/\\'/g, "'") // Unescape quotes
        .trim();

      return {
        text,
        metadata: {}
      };
    } catch (error) {
      throw new Error(`Failed to process RTF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate text statistics
   */
  private calculateTextStats(text: string): { wordCount: number; characterCount: number } {
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const characterCount = text.length;
    
    return { wordCount, characterCount };
  }

  /**
   * Detect language (basic implementation)
   */
  private detectLanguage(text: string): string {
    // This is a very basic language detection
    // In production, you'd want to use a proper language detection library
    const sample = text.substring(0, 1000).toLowerCase();
    
    // Simple heuristics for common languages
    if (sample.includes('the ') && sample.includes('and ') && sample.includes('is ')) {
      return 'en';
    } else if (sample.includes('el ') && sample.includes('la ') && sample.includes('de ')) {
      return 'es';
    } else if (sample.includes('le ') && sample.includes('la ') && sample.includes('et ')) {
      return 'fr';
    }
    
    return 'unknown';
  }

  /**
   * Main document processing method
   */
  async processDocument(
    filePath: string, 
    fileName: string, 
    mimeType: string, 
    fileSize: number,
    options: DocumentProcessingOptions = {}
  ): Promise<ProcessedDocument> {
    const startTime = Date.now();
    
    try {
      logger.info(`Processing document: ${fileName} (${mimeType}, ${fileSize} bytes)`);
      
      // Validate file
      this.validateFile(filePath, mimeType, fileSize, options);
      
      // Process based on file type
      let result: { text: string; metadata: Partial<DocumentMetadata> };
      const extension = path.extname(fileName).toLowerCase();
      
      switch (extension) {
        case '.pdf':
          result = await this.processPdf(filePath);
          break;
        case '.docx':
          result = await this.processDocx(filePath);
          break;
        case '.doc':
          result = await this.processDoc(filePath);
          break;
        case '.txt':
          result = await this.processText(filePath);
          break;
        case '.csv':
          result = await this.processCsv(filePath);
          break;
        case '.rtf':
          result = await this.processRtf(filePath);
          break;
        default:
          throw new Error(`Unsupported file extension: ${extension}`);
      }

      // Validate extracted text
      if (!result.text || result.text.trim().length < 10) {
        throw new Error('Insufficient text content extracted from document');
      }

      // Calculate text statistics
      const textStats = this.calculateTextStats(result.text);
      
      // Detect language
      const detectedLanguage = this.detectLanguage(result.text);

      // Build complete metadata
      const metadata: DocumentMetadata = {
        fileName,
        fileSize,
        fileType: extension.substring(1), // Remove the dot
        mimeType,
        wordCount: textStats.wordCount,
        characterCount: textStats.characterCount,
        language: detectedLanguage,
        ...result.metadata
      };

      const processingTime = Date.now() - startTime;
      
      const processedDocument: ProcessedDocument = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        fileName,
        extractedText: result.text,
        metadata,
        processingTime
      };

      logger.info(`Document processed successfully: ${fileName} (${textStats.wordCount} words, ${processingTime}ms)`);
      
      return processedDocument;

    } catch (error) {
      logger.error(`Document processing failed for ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * Clean up temporary files
   */
  async cleanupFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
        logger.info(`Cleaned up temporary file: ${filePath}`);
      }
    } catch (error) {
      logger.warn(`Failed to cleanup file ${filePath}:`, error);
    }
  }

  /**
   * Get supported file types
   */
  getSupportedTypes(): { mimeTypes: string[]; extensions: string[] } {
    return {
      mimeTypes: [...this.supportedMimeTypes],
      extensions: [...this.supportedExtensions]
    };
  }

  /**
   * Check if file type is supported
   */
  isFileTypeSupported(mimeType: string, fileName: string): boolean {
    const extension = path.extname(fileName).toLowerCase();
    return this.supportedMimeTypes.includes(mimeType) && 
           this.supportedExtensions.includes(extension);
  }
}

export const documentProcessingService = new DocumentProcessingService();