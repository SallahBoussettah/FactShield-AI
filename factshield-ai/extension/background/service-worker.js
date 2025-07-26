// Background service worker for FactShield AI extension
// This script runs in the background and handles communication with the API

// API endpoint - connects to your FactShield AI backend
let API_BASE_URL = 'http://localhost:3001/api';
const WEBSITE_URL = 'http://localhost:5173';

// Cache configuration
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_CACHE_SIZE = 1000; // Maximum number of cached analyses

// Notification configuration
const NOTIFICATION_TYPES = {
  ANALYSIS_COMPLETE: 'analysis_complete',
  HIGH_RISK_CONTENT: 'high_risk_content',
  ERROR: 'error'
};

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
    analyzeContentWithCaching(message.content, message.url, sender.tab?.id, message.timestamp)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error analyzing content:', error);
        sendResponse({ error: 'Failed to analyze content' });
      });
    return true; // Required for async response
  }
  
  if (message.action === 'getAuthStatus') {
    getAuthStatus()
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error getting auth status:', error);
        sendResponse({ isAuthenticated: false, userData: null });
      });
    return true; // Required for async response
  }
  
  if (message.action === 'login') {
    handleLogin(message.credentials)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error during login:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Required for async response
  }
  
  if (message.action === 'logout') {
    handleLogout()
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error during logout:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Required for async response
  }
  
  if (message.action === 'refreshToken') {
    refreshAuthToken()
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error refreshing token:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Required for async response
  }
  
  if (message.action === 'extensionAuth') {
    // Handle authentication from website
    handleExtensionAuth(message)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error handling extension auth:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Required for async response
  }
  
  if (message.action === 'getCachedAnalysis') {
    getCachedAnalysis(message.url || message.contentHash)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error getting cached analysis:', error);
        sendResponse({ error: 'Failed to get cached analysis' });
      });
    return true; // Required for async response
  }
  
  if (message.action === 'clearCache') {
    clearAnalysisCache()
      .then(() => sendResponse({ success: true }))
      .catch(error => {
        console.error('Error clearing cache:', error);
        sendResponse({ error: 'Failed to clear cache' });
      });
    return true; // Required for async response
  }
});

// Authentication Functions

/**
 * Get current authentication status
 */
async function getAuthStatus() {
  try {
    const data = await chrome.storage.local.get(['authToken', 'userData', 'tokenExpiry']);
    
    if (!data.authToken) {
      return { isAuthenticated: false, userData: null };
    }
    
    // Check if token is expired
    if (data.tokenExpiry && Date.now() > data.tokenExpiry) {
      // Try to refresh token
      const refreshResult = await refreshAuthToken();
      if (refreshResult.success) {
        return { 
          isAuthenticated: true, 
          userData: refreshResult.userData,
          tokenRefreshed: true
        };
      } else {
        // Token refresh failed, user needs to login again
        await handleLogout();
        return { isAuthenticated: false, userData: null, tokenExpired: true };
      }
    }
    
    return {
      isAuthenticated: true,
      userData: data.userData || null
    };
  } catch (error) {
    console.error('Error getting auth status:', error);
    return { isAuthenticated: false, userData: null, error: error.message };
  }
}

/**
 * Handle login with credentials
 */
async function handleLogin(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const result = await response.json();
    
    // Handle your API response structure
    const data = result.data || result;
    
    // Store authentication data
    await chrome.storage.local.set({
      authToken: data.token,
      userData: data.user,
      tokenExpiry: data.expiresAt ? new Date(data.expiresAt).getTime() : null,
      refreshToken: data.refreshToken || null
    });
    
    return {
      success: true,
      user: data.user,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  try {
    // Get current token for logout request
    const data = await chrome.storage.local.get('authToken');
    
    if (data.authToken) {
      // Notify server about logout
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${data.authToken}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        // Ignore server errors during logout
        console.warn('Server logout failed:', error);
      }
    }
    
    // Clear local storage
    await chrome.storage.local.remove([
      'authToken', 
      'userData', 
      'tokenExpiry', 
      'refreshToken',
      'analysisHistory' // Clear user-specific data
    ]);
    
    return {
      success: true,
      message: 'Logout successful'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Refresh authentication token
 */
async function refreshAuthToken() {
  try {
    const data = await chrome.storage.local.get(['refreshToken', 'authToken']);
    
    if (!data.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.authToken}`
      },
      body: JSON.stringify({
        refreshToken: data.refreshToken
      })
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const refreshData = await response.json();
    
    // Update stored tokens
    await chrome.storage.local.set({
      authToken: refreshData.token,
      userData: refreshData.user,
      tokenExpiry: refreshData.expiresAt ? new Date(refreshData.expiresAt).getTime() : null,
      refreshToken: refreshData.refreshToken || data.refreshToken
    });
    
    return {
      success: true,
      userData: refreshData.user,
      message: 'Token refreshed successfully'
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Handle authentication from website (OAuth-like flow)
 */
async function handleExtensionAuth(message) {
  try {
    if (!message.success || !message.token) {
      throw new Error('Invalid authentication data');
    }
    
    // Since the token is coming from your authenticated web app, we can trust it
    // No need to verify with server as it's already been validated during login
    
    // Store authentication data
    await chrome.storage.local.set({
      authToken: message.token,
      userData: message.user,
      tokenExpiry: message.expiresAt ? new Date(message.expiresAt).getTime() : null,
      refreshToken: message.refreshToken || null
    });
    
    return {
      success: true,
      user: message.user,
      message: 'Authentication successful'
    };
  } catch (error) {
    console.error('Extension auth error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check if user is authenticated and token is valid
 */
async function isAuthenticated() {
  const authStatus = await getAuthStatus();
  return authStatus.isAuthenticated;
}

/**
 * Get valid auth token (refreshes if needed)
 */
async function getValidAuthToken() {
  const authStatus = await getAuthStatus();
  
  if (!authStatus.isAuthenticated) {
    throw new Error('User not authenticated');
  }
  
  const data = await chrome.storage.local.get('authToken');
  return data.authToken;
}

// Function to analyze content with caching
async function analyzeContentWithCaching(content, url, tabId, timestamp) {
  try {
    // Generate content hash for caching
    const contentHash = await generateContentHash(content);
    const cacheKey = url || contentHash;
    
    // Check cache first
    const cachedResult = await getCachedAnalysis(cacheKey);
    if (cachedResult && !isCacheExpired(cachedResult.timestamp)) {
      // Send cached results to content script
      if (tabId) {
        chrome.tabs.sendMessage(tabId, {
          action: 'analysisResults',
          results: cachedResult.data,
          fromCache: true
        });
      }
      
      return {
        status: 'success',
        results: cachedResult.data,
        fromCache: true
      };
    }
    
    // Get valid auth token (this will refresh if needed)
    let token;
    try {
      token = await getValidAuthToken();
    } catch (error) {
      const authError = { 
        status: 'error',
        error: 'not_authenticated',
        message: 'User not authenticated'
      };
      
      // Show notification for authentication error
      await showNotification(NOTIFICATION_TYPES.ERROR, 'Please log in to analyze content');
      return authError;
    }
    
    // Make API request to analyze content using your backend
    const response = await fetch(`${API_BASE_URL}/analyze/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        text: content,
        options: {
          maxClaims: 5,
          minConfidence: 0.6,
          includeOpinions: false,
          maxSources: 3,
          minSourceReliability: 0.7
        }
      })
    });
    
    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        // Token might be expired, try to refresh
        try {
          const refreshResult = await refreshAuthToken();
          if (refreshResult.success) {
            // Retry the request with new token
            const retryResponse = await fetch(`${API_BASE_URL}/analyze/text`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshResult.token || await getValidAuthToken()}`
              },
              body: JSON.stringify({ 
                text: content,
                options: {
                  maxClaims: 5,
                  minConfidence: 0.6,
                  includeOpinions: false,
                  maxSources: 3,
                  minSourceReliability: 0.7
                }
              })
            });
            
            if (retryResponse.ok) {
              const result = await retryResponse.json();
              
              // Cache and process the result
              await cacheAnalysis(cacheKey, result, url);
              await storeAnalysisInHistory(result, url);
              await checkAndNotifyHighRiskContent(result);
              
              if (tabId) {
                chrome.tabs.sendMessage(tabId, {
                  action: 'analysisResults',
                  results: result,
                  fromCache: false
                });
              }
              
              await showNotification(NOTIFICATION_TYPES.ANALYSIS_COMPLETE, 
                `Analysis complete: ${result.claims?.length || 0} claims found`);
              
              return {
                status: 'success',
                results: result,
                fromCache: false
              };
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
        
        // If refresh failed, user needs to login again
        await handleLogout();
        throw new Error('Authentication expired. Please log in again.');
      }
      
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Cache the analysis result
    await cacheAnalysis(cacheKey, result, url);
    
    // Store analysis in history
    await storeAnalysisInHistory(result, url);
    
    // Check for high-risk content and show notification
    await checkAndNotifyHighRiskContent(result);
    
    // If tab ID is provided, send results to content script
    if (tabId) {
      chrome.tabs.sendMessage(tabId, {
        action: 'analysisResults',
        results: result,
        fromCache: false
      });
    }
    
    // Show completion notification
    await showNotification(NOTIFICATION_TYPES.ANALYSIS_COMPLETE, 
      `Analysis complete: ${result.claims?.length || 0} claims found`);
    
    return {
      status: 'success',
      results: result,
      fromCache: false
    };
  } catch (error) {
    console.error('Error in analyzeContentWithCaching:', error);
    
    // Show error notification
    await showNotification(NOTIFICATION_TYPES.ERROR, 'Failed to analyze content');
    
    return {
      status: 'error',
      error: 'api_error',
      message: error.message
    };
  }
}

// Function to generate content hash
async function generateContentHash(content) {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Function to cache analysis results
async function cacheAnalysis(cacheKey, result, url) {
  try {
    const cacheData = await chrome.storage.local.get('analysisCache');
    const cache = cacheData.analysisCache || {};
    
    // Add new entry
    cache[cacheKey] = {
      data: result,
      timestamp: Date.now(),
      url: url || null
    };
    
    // Manage cache size
    const cacheKeys = Object.keys(cache);
    if (cacheKeys.length > MAX_CACHE_SIZE) {
      // Remove oldest entries
      const sortedKeys = cacheKeys.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
      const keysToRemove = sortedKeys.slice(0, cacheKeys.length - MAX_CACHE_SIZE);
      
      keysToRemove.forEach(key => delete cache[key]);
    }
    
    await chrome.storage.local.set({ analysisCache: cache });
  } catch (error) {
    console.error('Error caching analysis:', error);
  }
}

// Function to get cached analysis
async function getCachedAnalysis(cacheKey) {
  try {
    const cacheData = await chrome.storage.local.get('analysisCache');
    const cache = cacheData.analysisCache || {};
    return cache[cacheKey] || null;
  } catch (error) {
    console.error('Error getting cached analysis:', error);
    return null;
  }
}

// Function to check if cache entry is expired
function isCacheExpired(timestamp) {
  return (Date.now() - timestamp) > CACHE_EXPIRY_TIME;
}

// Function to clear analysis cache
async function clearAnalysisCache() {
  try {
    await chrome.storage.local.remove('analysisCache');
  } catch (error) {
    console.error('Error clearing cache:', error);
    throw error;
  }
}

// Function to store analysis in history
async function storeAnalysisInHistory(result, url) {
  try {
    if (result.id) {
      const historyData = await chrome.storage.local.get('analysisHistory');
      const history = historyData.analysisHistory || [];
      
      // Add to history with timestamp and limit to 100 entries
      history.unshift({
        id: result.id,
        timestamp: new Date().toISOString(),
        source: 'extension',
        url: url || null,
        summary: result.summary || 'Content analysis',
        claimsCount: result.claims?.length || 0
      });
      
      if (history.length > 100) {
        history.pop();
      }
      
      await chrome.storage.local.set({ analysisHistory: history });
    }
  } catch (error) {
    console.error('Error storing analysis in history:', error);
  }
}

// Function to check for high-risk content and notify
async function checkAndNotifyHighRiskContent(result) {
  try {
    const settings = await chrome.storage.local.get('settings');
    if (!settings.settings?.notificationsEnabled) {
      return;
    }
    
    if (result.claims && result.claims.length > 0) {
      const highRiskClaims = result.claims.filter(claim => 
        claim.credibilityScore !== undefined && claim.credibilityScore < 0.3
      );
      
      if (highRiskClaims.length > 0) {
        await showNotification(
          NOTIFICATION_TYPES.HIGH_RISK_CONTENT,
          `Warning: ${highRiskClaims.length} low-credibility claims detected!`
        );
      }
    }
  } catch (error) {
    console.error('Error checking high-risk content:', error);
  }
}

// Function to show notifications
async function showNotification(type, message) {
  try {
    const settings = await chrome.storage.local.get('settings');
    if (!settings.settings?.notificationsEnabled) {
      return;
    }
    
    let iconUrl = 'assets/icon-48.png';
    let title = 'FactShield AI';
    
    switch (type) {
      case NOTIFICATION_TYPES.HIGH_RISK_CONTENT:
        title = 'FactShield AI - Warning';
        iconUrl = 'assets/icon-48.png';
        break;
      case NOTIFICATION_TYPES.ANALYSIS_COMPLETE:
        title = 'FactShield AI - Analysis Complete';
        break;
      case NOTIFICATION_TYPES.ERROR:
        title = 'FactShield AI - Error';
        break;
    }
    
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: iconUrl,
      title: title,
      message: message
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}
// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  // Open the web app when notification is clicked
  chrome.tabs.create({
    url: 'http://localhost:5173'
  });
  
  // Clear the notification
  chrome.notifications.clear(notificationId);
});

// Periodic maintenance tasks
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cacheCleanup') {
    cleanupExpiredCache();
  } else if (alarm.name === 'tokenRefresh') {
    checkAndRefreshToken();
  }
});

// Set up periodic tasks
chrome.runtime.onStartup.addListener(() => {
  // Cache cleanup every 6 hours
  chrome.alarms.create('cacheCleanup', {
    delayInMinutes: 360, // 6 hours
    periodInMinutes: 360
  });
  
  // Token refresh check every 30 minutes
  chrome.alarms.create('tokenRefresh', {
    delayInMinutes: 30,
    periodInMinutes: 30
  });
});

// Also set up alarms when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('cacheCleanup', {
    delayInMinutes: 360,
    periodInMinutes: 360
  });
  
  chrome.alarms.create('tokenRefresh', {
    delayInMinutes: 30,
    periodInMinutes: 30
  });
});

// Function to check and refresh token if needed
async function checkAndRefreshToken() {
  try {
    const data = await chrome.storage.local.get(['authToken', 'tokenExpiry', 'refreshToken']);
    
    if (!data.authToken || !data.tokenExpiry) {
      return; // No token or expiry info
    }
    
    // Check if token expires within the next 10 minutes
    const tenMinutesFromNow = Date.now() + (10 * 60 * 1000);
    
    if (data.tokenExpiry < tenMinutesFromNow && data.refreshToken) {
      console.log('Token expiring soon, attempting refresh...');
      const refreshResult = await refreshAuthToken();
      
      if (refreshResult.success) {
        console.log('Token refreshed successfully');
      } else {
        console.warn('Token refresh failed:', refreshResult.error);
        // Don't logout automatically, let user continue until token actually expires
      }
    }
  } catch (error) {
    console.error('Error checking token expiry:', error);
  }
}

// Function to clean up expired cache entries
async function cleanupExpiredCache() {
  try {
    const cacheData = await chrome.storage.local.get('analysisCache');
    const cache = cacheData.analysisCache || {};
    const now = Date.now();
    
    let cleanedCount = 0;
    Object.keys(cache).forEach(key => {
      if (isCacheExpired(cache[key].timestamp)) {
        delete cache[key];
        cleanedCount++;
      }
    });
    
    if (cleanedCount > 0) {
      await chrome.storage.local.set({ analysisCache: cache });
      console.log(`Cleaned up ${cleanedCount} expired cache entries`);
    }
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
}

// Function to get cache statistics
async function getCacheStats() {
  try {
    const cacheData = await chrome.storage.local.get('analysisCache');
    const cache = cacheData.analysisCache || {};
    const entries = Object.values(cache);
    
    return {
      totalEntries: entries.length,
      expiredEntries: entries.filter(entry => isCacheExpired(entry.timestamp)).length,
      cacheSize: JSON.stringify(cache).length,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : null
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
}

// Handle extension context menu (if needed)
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for analyzing selected text
  chrome.contextMenus.create({
    id: 'analyzeSelection',
    title: 'Analyze with FactShield AI',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyzeSelection' && info.selectionText) {
    // Send message to content script to analyze selection
    chrome.tabs.sendMessage(tab.id, {
      action: 'analyzeSelection'
    });
  }
});

// Handle tab updates to potentially analyze new content
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only analyze when page is completely loaded
  if (changeInfo.status === 'complete' && tab.url) {
    const settings = await chrome.storage.local.get('settings');
    
    // Check if auto-analyze is enabled
    if (settings.settings?.autoAnalyze) {
      // Skip certain URLs
      if (!tab.url.startsWith('chrome://') && 
          !tab.url.startsWith('chrome-extension://') &&
          !tab.url.startsWith('moz-extension://')) {
        
        // Wait a bit for content to load, then trigger analysis
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, {
            action: 'analyzePage'
          }).catch(() => {
            // Ignore errors (content script might not be loaded)
          });
        }, 2000);
      }
    }
  }
});