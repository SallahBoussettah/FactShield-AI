# Web App Integration Guide

This guide explains how to integrate your FactShield AI web application with the browser extension for seamless authentication.

## Overview

The extension includes an authentication bridge that allows users to log in through your web app and automatically authenticate with the extension. This provides a smooth user experience without requiring separate login flows.

## ✅ Integration Complete

The following components have been added to your React app:

### 1. Extension Detection Hook (`src/hooks/useExtensionDetection.ts`)
- Detects if the extension is installed
- Handles extension-specific authentication flow
- Provides loading states and error handling

### 2. Extension Auth Bridge (`src/components/extension/ExtensionAuthBridge.tsx`)
- Automatically sends authentication data to the extension
- Handles the communication between web app and extension
- Triggers when user logs in or registers

### 3. Extension Status Component (`src/components/extension/ExtensionStatus.tsx`)
- Shows extension connection status
- Provides install prompts when extension is not detected
- Visual indicators for connection state

### 4. Updated Login/Register Pages
- Automatically detect extension authentication flow
- Show special UI when opened from extension
- Include the auth bridge component

### 5. Dashboard Extension Component (`src/components/dashboard/ExtensionDashboard.tsx`)
- Shows extension status in dashboard
- Provides quick actions and feature overview
- Install prompts and usage instructions

## How It Works

1. **Extension Detection**: The extension content script adds markers that the web app can detect
2. **Authentication Flow**: When users click "Login" in the extension, it opens your web app with special parameters
3. **Auto-Connection**: After successful login/register, the auth bridge automatically sends credentials to the extension
4. **Visual Feedback**: Users see connection status and success messages

## Usage in Your Components

### Add Extension Status to Dashboard
```jsx
import ExtensionDashboard from '../components/dashboard/ExtensionDashboard';

// In your dashboard component
<ExtensionDashboard />
```

### Show Extension Status Anywhere
```jsx
import ExtensionStatus from '../components/extension/ExtensionStatus';

// Show connection status
<ExtensionStatus />
```

### Detect Extension in Any Component
```jsx
import { useExtensionDetection } from '../hooks/useExtensionDetection';

const MyComponent = () => {
  const { isExtensionInstalled, isChecking } = useExtensionDetection();
  
  if (isExtensionInstalled) {
    // Show extension-specific features
  }
};
```

## Backend API Requirements

Your backend should support these authentication endpoints (already implemented in your API):

### POST /api/auth/login
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "roles": ["user"]
    },
    "expiresAt": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/auth/refresh
For token refresh functionality

### POST /api/auth/logout
For logout functionality

### GET /api/analyze/text
For content analysis (this is what the extension will call):
```json
{
  "text": "Content to analyze",
  "options": {
    "maxClaims": 5,
    "minConfidence": 0.6,
    "includeOpinions": false,
    "maxSources": 3,
    "minSourceReliability": 0.7
  }
}
```

## Testing the Integration

1. **Install the Extension**:
   ```bash
   cd factshield-ai
   npm run build:extension
   ```
   Then load the extension in Chrome developer mode

2. **Start Your React App**:
   ```bash
   npm run dev
   ```

3. **Test Authentication Flow**:
   - Click the extension icon
   - Click "Login to FactShield AI" 
   - Complete login in the web app
   - Verify extension shows as authenticated

4. **Test Content Analysis**:
   - Navigate to any webpage
   - Right-click and select "Analyze with FactShield AI"
   - Or use the extension popup to analyze page/selection

## Configuration

The extension is configured to work with:
- **Web App**: `http://localhost:5173`
- **API Backend**: `http://localhost:3001/api`

To change these URLs, update:
- Extension: `factshield-ai/extension/background/service-worker.js`
- Web App: Your existing API configuration

### 4. Handle Extension-Specific Redirects

Update your authentication success handler to detect extension logins:

```javascript
// In your authentication success component/page
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get('source') === 'extension') {
    // Show extension-specific success message
    setShowExtensionSuccess(true);
    
    // Auto-close after successful authentication
    setTimeout(() => {
      window.close();
    }, 2000);
  }
}, []);
```

### 5. Extension Status Indicator

Add an indicator to show extension connection status:

```jsx
const ExtensionStatus = () => {
  const [extensionConnected, setExtensionConnected] = useState(false);
  
  useEffect(() => {
    const checkExtensionStatus = async () => {
      const installed = await isExtensionInstalled();
      setExtensionConnected(installed);
    };
    
    checkExtensionStatus();
    
    // Listen for extension authentication events
    const handleMessage = (event) => {
      if (event.data.type === 'EXTENSION_AUTH' && event.data.success) {
        setExtensionConnected(true);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  return (
    <div className={`extension-status ${extensionConnected ? 'connected' : 'disconnected'}`}>
      <div className="status-indicator">
        {extensionConnected ? '🟢' : '🔴'}
      </div>
      <span>
        Extension {extensionConnected ? 'Connected' : 'Not Connected'}
      </span>
    </div>
  );
};
```

## API Endpoints Required

Your backend should support these authentication endpoints:

### POST /auth/login
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "accountType": "premium"
  },
  "expiresAt": "2024-01-01T00:00:00Z",
  "refreshToken": "refresh-token"
}
```

### POST /auth/refresh
```json
{
  "refreshToken": "refresh-token"
}
```

### POST /auth/verify
Verify token validity (used by extension)

### POST /auth/logout
Invalidate token

## Security Considerations

1. **Origin Validation**: The extension only accepts messages from allowed domains
2. **Token Validation**: All tokens are verified with your backend
3. **Secure Storage**: Tokens are stored securely in Chrome's storage API
4. **Auto-Refresh**: Tokens are automatically refreshed before expiry
5. **Logout Cleanup**: All local data is cleared on logout

## Testing the Integration

1. Install the extension in development mode
2. Open your web app
3. Click "Login for Browser Extension" 
4. Complete the login flow
5. Verify the extension shows as authenticated
6. Test content analysis functionality

## Troubleshooting

### Extension Not Detected
- Check if the extension is properly installed
- Verify the extension ID in your detection code
- Check browser console for errors

### Authentication Not Working
- Verify the auth bridge content script is loaded
- Check that your domain is in the allowed domains list
- Ensure the message format matches the expected structure

### Token Issues
- Verify your backend returns the correct token format
- Check token expiry times
- Ensure refresh token functionality works

## Example Implementation

See the `auth-bridge.js` content script for the complete implementation of the extension side of this integration.