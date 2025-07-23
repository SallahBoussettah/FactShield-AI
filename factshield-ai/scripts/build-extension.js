/**
 * Build script for the FactShield AI browser extension
 * This script copies and processes extension files for development and production
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
const extensionSrcDir = path.join(rootDir, 'extension');
const distDir = path.join(rootDir, 'dist/extension');
const assetsDir = path.join(extensionSrcDir, 'assets');
const distAssetsDir = path.join(distDir, 'assets');

// Check if we're in watch mode
const isWatchMode = process.argv.includes('--watch');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create assets directory in dist if it doesn't exist
if (!fs.existsSync(distAssetsDir)) {
  fs.mkdirSync(distAssetsDir, { recursive: true });
}

// Function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Function to process icons
function processIcons() {
  console.log('Processing icons...');
  
  try {
    // Copy the existing PNG icons
    const iconSizes = [16, 48, 128];
    
    for (const size of iconSizes) {
      const srcPath = path.join(assetsDir, `icon-${size}.png`);
      const destPath = path.join(distAssetsDir, `icon-${size}.png`);
      
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied icon: ${destPath}`);
      } else {
        console.warn(`Warning: Icon file not found: ${srcPath}`);
      }
    }
    
    // Copy the SVG icon
    const svgIconPath = path.join(assetsDir, 'icon.svg');
    if (fs.existsSync(svgIconPath)) {
      fs.copyFileSync(svgIconPath, path.join(distAssetsDir, 'icon.svg'));
      console.log('Copied SVG icon');
    }
    
    // Create logo.png (use icon-48.png as logo)
    const logoSrcPath = path.join(assetsDir, 'icon-48.png');
    if (fs.existsSync(logoSrcPath)) {
      fs.copyFileSync(logoSrcPath, path.join(distAssetsDir, 'logo.png'));
      console.log('Created logo from icon-48.png');
    }
  } catch (error) {
    console.error('Error processing icons:', error);
  }
}

// Function to build the extension
function buildExtension() {
  console.log('Building extension...');
  
  try {
    // Copy manifest.json
    fs.copyFileSync(
      path.join(extensionSrcDir, 'manifest.json'),
      path.join(distDir, 'manifest.json')
    );
    console.log('Copied manifest.json');
    
    // Copy popup directory
    copyDirectory(
      path.join(extensionSrcDir, 'popup'),
      path.join(distDir, 'popup')
    );
    console.log('Copied popup directory');
    
    // Copy background directory
    copyDirectory(
      path.join(extensionSrcDir, 'background'),
      path.join(distDir, 'background')
    );
    console.log('Copied background directory');
    
    // Copy content directory
    copyDirectory(
      path.join(extensionSrcDir, 'content'),
      path.join(distDir, 'content')
    );
    console.log('Copied content directory');
    
    // Copy options directory
    copyDirectory(
      path.join(extensionSrcDir, 'options'),
      path.join(distDir, 'options')
    );
    console.log('Copied options directory');
    
    // Process icons
    processIcons();
    
    console.log('Extension build completed successfully!');
    console.log(`Output directory: ${distDir}`);
  } catch (error) {
    console.error('Error building extension:', error);
    process.exit(1);
  }
}

// Function to watch for changes
function watchExtension() {
  console.log('Watching for changes...');
  
  // Initial build
  buildExtension();
  
  // Watch for changes in the extension directory
  fs.watch(extensionSrcDir, { recursive: true }, (eventType, filename) => {
    console.log(`Change detected: ${filename}`);
    buildExtension();
  });
}

// Main execution
if (isWatchMode) {
  watchExtension();
} else {
  buildExtension();
}