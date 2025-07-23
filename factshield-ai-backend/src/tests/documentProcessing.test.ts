import { documentProcessingService } from '../services/documentProcessingService';
import fs from 'fs';
import path from 'path';

describe('Document Processing Service', () => {
  const testFilesDir = path.join(__dirname, 'test-files');
  
  beforeAll(() => {
    // Create test files directory if it doesn't exist
    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up test files
    if (fs.existsSync(testFilesDir)) {
      fs.rmSync(testFilesDir, { recursive: true, force: true });
    }
  });

  describe('File Type Support', () => {
    test('should return supported file types', () => {
      const supportedTypes = documentProcessingService.getSupportedTypes();
      
      expect(supportedTypes.mimeTypes).toContain('application/pdf');
      expect(supportedTypes.mimeTypes).toContain('text/plain');
      expect(supportedTypes.extensions).toContain('.pdf');
      expect(supportedTypes.extensions).toContain('.txt');
    });

    test('should check if file type is supported', () => {
      expect(documentProcessingService.isFileTypeSupported('text/plain', 'test.txt')).toBe(true);
      expect(documentProcessingService.isFileTypeSupported('application/pdf', 'test.pdf')).toBe(true);
      expect(documentProcessingService.isFileTypeSupported('image/jpeg', 'test.jpg')).toBe(false);
    });
  });

  describe('Text File Processing', () => {
    test('should process plain text files', async () => {
      // Create a test text file
      const testContent = 'This is a test document with some sample content for processing. It contains multiple sentences and should be processed correctly.';
      const testFilePath = path.join(testFilesDir, 'test.txt');
      
      fs.writeFileSync(testFilePath, testContent);
      
      try {
        const result = await documentProcessingService.processDocument(
          testFilePath,
          'test.txt',
          'text/plain',
          testContent.length
        );

        expect(result.fileName).toBe('test.txt');
        expect(result.extractedText).toBe(testContent);
        expect(result.metadata.wordCount).toBeGreaterThan(0);
        expect(result.metadata.characterCount).toBe(testContent.length);
        expect(result.metadata.fileType).toBe('txt');
        expect(result.processingTime).toBeGreaterThan(0);
      } finally {
        // Clean up
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });

    test('should reject files that are too small', async () => {
      const testContent = 'Too small';
      const testFilePath = path.join(testFilesDir, 'small.txt');
      
      fs.writeFileSync(testFilePath, testContent);
      
      try {
        await expect(
          documentProcessingService.processDocument(
            testFilePath,
            'small.txt',
            'text/plain',
            testContent.length
          )
        ).rejects.toThrow('Insufficient text content');
      } finally {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });
  });

  describe('File Validation', () => {
    test('should reject unsupported file types', async () => {
      const testFilePath = path.join(testFilesDir, 'test.jpg');
      fs.writeFileSync(testFilePath, 'fake image content');
      
      try {
        await expect(
          documentProcessingService.processDocument(
            testFilePath,
            'test.jpg',
            'image/jpeg',
            100
          )
        ).rejects.toThrow('Unsupported file type');
      } finally {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });

    test('should reject files that are too large', async () => {
      const testFilePath = path.join(testFilesDir, 'large.txt');
      fs.writeFileSync(testFilePath, 'test content');
      
      await expect(
        documentProcessingService.processDocument(
          testFilePath,
          'large.txt',
          'text/plain',
          20 * 1024 * 1024 // 20MB
        )
      ).rejects.toThrow('File size exceeds limit');
      
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    });

    test('should reject non-existent files', async () => {
      await expect(
        documentProcessingService.processDocument(
          '/non/existent/file.txt',
          'file.txt',
          'text/plain',
          100
        )
      ).rejects.toThrow('File not found');
    });
  });

  describe('CSV Processing', () => {
    test('should process CSV files', async () => {
      const csvContent = 'name,age,city\nJohn,25,New York\nJane,30,Los Angeles\n';
      const testFilePath = path.join(testFilesDir, 'test.csv');
      
      fs.writeFileSync(testFilePath, csvContent);
      
      try {
        const result = await documentProcessingService.processDocument(
          testFilePath,
          'test.csv',
          'text/csv',
          csvContent.length
        );

        expect(result.fileName).toBe('test.csv');
        expect(result.extractedText).toContain('Headers: name, age, city');
        expect(result.extractedText).toContain('John');
        expect(result.extractedText).toContain('Jane');
        expect(result.metadata.fileType).toBe('csv');
      } finally {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });
  });

  describe('Cleanup', () => {
    test('should clean up temporary files', async () => {
      const testFilePath = path.join(testFilesDir, 'cleanup-test.txt');
      fs.writeFileSync(testFilePath, 'test content for cleanup');
      
      expect(fs.existsSync(testFilePath)).toBe(true);
      
      await documentProcessingService.cleanupFile(testFilePath);
      
      expect(fs.existsSync(testFilePath)).toBe(false);
    });

    test('should handle cleanup of non-existent files gracefully', async () => {
      // Should not throw an error
      await expect(
        documentProcessingService.cleanupFile('/non/existent/file.txt')
      ).resolves.not.toThrow();
    });
  });
});