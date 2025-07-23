/**
 * Packaging script for the FactShield AI browser extension
 * This script creates a ZIP file for distribution to the Chrome Web Store
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { execSync } from 'child_process';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist/extension');
const packageDir = path.join(rootDir, 'dist');
const packageName = 'factshield-ai-extension.zip';
const packagePath = path.join(packageDir, packageName);

// Check if the extension has been built
if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'manifest.json'))) {
  console.error('Error: Extension has not been built. Run "npm run build:extension" first.');
  process.exit(1);
}

// Function to create ZIP file
function createZip() {
  console.log('Creating ZIP package...');
  
  try {
    // Remove existing package if it exists
    if (fs.existsSync(packagePath)) {
      fs.unlinkSync(packagePath);
      console.log('Removed existing package');
    }
    
    // Create ZIP file using the appropriate command based on platform
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      // Use PowerShell on Windows
      execSync(
        `powershell -command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${packagePath}'"`,
        { stdio: 'inherit' }
      );
    } else {
      // Use zip on Unix-like systems
      execSync(
        `cd "${distDir}" && zip -r "${packagePath}" ./*`,
        { stdio: 'inherit' }
      );
    }
    
    console.log(`Package created successfully: ${packagePath}`);
  } catch (error) {
    console.error('Error creating package:', error);
    process.exit(1);
  }
}

// Main execution
createZip();