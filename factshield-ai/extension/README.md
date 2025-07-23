# FactShield AI Browser Extension

This directory contains the source code for the FactShield AI browser extension, which provides real-time misinformation detection as users browse the web.

## Directory Structure

```
extension/
├── assets/             # Icons and images
├── background/         # Background service worker
├── content/            # Content scripts that run on web pages
├── options/            # Extension options page
├── popup/              # Popup UI when clicking the extension icon
└── manifest.json       # Extension manifest file
```

## Development Setup

### Prerequisites

- Node.js 16+ and npm
- Chrome browser for testing

### Building the Extension

1. Install dependencies:
   ```
   npm install
   ```

2. Build the extension:
   ```
   npm run build:extension
   ```

   This will create a `dist/extension` directory with the built extension.

3. For development with auto-rebuild on changes:
   ```
   npm run watch:extension
   ```

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select the `dist/extension` directory
4. The extension should now be installed and visible in your browser toolbar

## Packaging for Distribution

To create a ZIP file for submission to the Chrome Web Store:

```
npm run package:extension
```

This will create `dist/factshield-ai-extension.zip` which can be uploaded to the Chrome Web Store Developer Dashboard.

## Extension Features

- Real-time content analysis for misinformation detection
- Highlight potentially misleading claims on web pages
- Detailed fact-checking information for highlighted claims
- User account integration for history tracking
- Customizable settings for analysis preferences

## Permissions

The extension requires the following permissions:

- `storage`: To store user preferences and authentication data
- `activeTab`: To access the content of the active tab for analysis
- `scripting`: To inject content scripts for highlighting claims

## Security Considerations

- User authentication is handled via JWT tokens
- API communication is secured with HTTPS
- Content scripts are isolated from the page's JavaScript
- Manifest V3 is used for improved security and performance