// Background service worker for FactShield AI extension
// This script runs in the background and handles communication with the API

// API endpoint (will be configured in the options)
let API_BASE_URL = 'https://api.factshield-ai.com';

// Initialize extension when installed
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'install') {
    // Set default settings
    await chrome.storage.local.set({
      settings: {
        highlightClaims: true,
        notificationsEnabled: true,
        autoAnalyze: false,
        apiEndpoint: API_BASE_URL
      }
    });
    
    // Open onboarding page
    chrome.tabs.create({
      url: 'options/onboarding.html'
    });
  }
  
  // Load settings
  const data = await chrome.storage.local.get('settings');
  if (data.settings && data.settings.apiEndpoint) {
    API_BASE_URL = data.settings.apiEndpoint;
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'analyzeContent') {
    analyzeContent(message.content, sender.tab?.id)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error analyzing content:', error);
        sendResponse({ error: 'Failed to analyze content' });
      });
    return true; // Required for async response
  }
  
  if (message.action === 'getAuthStatus') {
    chrome.storage.local.get(['authToken', 'userData'])
      .then(data => {
        sendResponse({
          isAuthenticated: !!data.authToken,
          userData: data.userData || null
        });
      })
      .catch(error => {
        console.error('Error getting auth status:', error);
        sendResponse({ isAuthenticated: false, userData: null });
      });
    return true; // Required for async response
  }
});

// Function to analyze content
async function analyzeContent(content, tabId) {
  try {
    // Get auth token
    const authData = await chrome.storage.local.get('authToken');
    const token = authData.authToken;
    
    // Check if authenticated
    if (!token) {
      return { 
        status: 'error',
        error: 'not_authenticated',
        message: 'User not authenticated'
      };
    }
    
    // Make API request to analyze content
    const response = await fetch(`${API_BASE_URL}/api/analyze/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Store analysis in history
    if (result.id) {
      const historyData = await chrome.storage.local.get('analysisHistory');
      const history = historyData.analysisHistory || [];
      
      // Add to history with timestamp and limit to 100 entries
      history.unshift({
        id: result.id,
        timestamp: new Date().toISOString(),
        source: 'extension',
        summary: result.summary || 'Content analysis'
      });
      
      if (history.length > 100) {
        history.pop();
      }
      
      await chrome.storage.local.set({ analysisHistory: history });
    }
    
    // If tab ID is provided, send results to content script
    if (tabId) {
      chrome.tabs.sendMessage(tabId, {
        action: 'analysisResults',
        results: result
      });
    }
    
    return {
      status: 'success',
      results: result
    };
  } catch (error) {
    console.error('Error in analyzeContent:', error);
    return {
      status: 'error',
      error: 'api_error',
      message: error.message
    };
  }
}