// FactShield AI Extension Popup Script

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const analyzePageBtn = document.getElementById('analyze-page-btn');
const analyzeSelectionBtn = document.getElementById('analyze-selection-btn');
const settingsBtn = document.getElementById('settings-btn');
const loggedOutView = document.getElementById('logged-out-view');
const loggedInView = document.getElementById('logged-in-view');
const userName = document.getElementById('user-name');
const analysisResults = document.getElementById('analysis-results');

// API endpoint - connects to your FactShield AI backend
const API_BASE_URL = 'http://localhost:3001/api';
const WEBSITE_URL = 'http://localhost:5173';

/**
 * Shows a loading indicator in the results container
 */
function showLoading() {
  analysisResults.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full gap-3 py-4">
      <div class="spinner"></div>
      <p class="text-neutral-600">Analyzing content...</p>
    </div>
  `;
}

/**
 * Shows an error message in the results container
 * @param {string} message - The error message to display
 */
function showError(message) {
  analysisResults.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full gap-2 py-4 text-danger">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>${message}</p>
    </div>
  `;
}

/**
 * Shows a message when no selection is made
 */
function showNoSelection() {
  analysisResults.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full gap-2 py-4 text-warning">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>No text selected. Please select text to analyze.</p>
    </div>
  `;
}

/**
 * Shows the default empty state
 */
function showEmptyState() {
  analysisResults.innerHTML = `
    <div class="flex items-center justify-center h-full text-neutral-500">
      <p>Select an analysis option to get started</p>
    </div>
  `;
}

/**
 * Shows analysis in progress message
 */
function showAnalysisInProgress() {
  analysisResults.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full gap-2 py-4 text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <p>Analysis in progress. Results will appear on the page.</p>
    </div>
  `;
}

/**
 * Check authentication status on popup open
 */
async function checkAuthStatus() {
  try {
    // Use the service worker's auth status check
    const response = await chrome.runtime.sendMessage({ action: 'getAuthStatus' });
    
    if (response.isAuthenticated && response.userData) {
      // User is logged in
      userName.textContent = response.userData.name || response.userData.email || 'User';
      loggedOutView.classList.add('hidden');
      loggedInView.classList.remove('hidden');
      
      // Show token refresh notification if it happened
      if (response.tokenRefreshed) {
        showTokenRefreshed();
      }
    } else {
      // User is logged out
      loggedOutView.classList.remove('hidden');
      loggedInView.classList.add('hidden');
      
      // Show specific message if token expired
      if (response.tokenExpired) {
        showTokenExpired();
      }
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    // Fallback to logged out state
    loggedOutView.classList.remove('hidden');
    loggedInView.classList.add('hidden');
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthStatus();
  showEmptyState();
});

// Login button click handler
loginBtn.addEventListener('click', () => {
  // Open login page in a new tab with extension source parameter
  chrome.tabs.create({ 
    url: `${WEBSITE_URL}/login?source=extension&redirect=extension_auth`,
    active: true
  });
  
  // Listen for authentication completion
  listenForAuthCompletion();
});

// Register button click handler
registerBtn.addEventListener('click', () => {
  // Open registration page in a new tab with extension source parameter
  chrome.tabs.create({ 
    url: `${WEBSITE_URL}/register?source=extension&redirect=extension_auth`,
    active: true
  });
  
  // Listen for authentication completion
  listenForAuthCompletion();
});

/**
 * Listen for authentication completion from the website
 */
function listenForAuthCompletion() {
  // Set up a listener for messages from the website
  const messageListener = (message, sender, sendResponse) => {
    if (message.action === 'extensionAuth' && message.success) {
      // Store authentication data
      chrome.storage.local.set({
        authToken: message.token,
        userData: message.user
      }).then(() => {
        // Update UI
        checkAuthStatus();
        
        // Show success message
        showAuthSuccess(message.user.name);
        
        // Remove listener
        chrome.runtime.onMessage.removeListener(messageListener);
        
        // Close the auth tab if it's still open
        if (sender.tab) {
          chrome.tabs.remove(sender.tab.id);
        }
      });
    }
  };
  
  chrome.runtime.onMessage.addListener(messageListener);
  
  // Set a timeout to remove the listener after 5 minutes
  setTimeout(() => {
    chrome.runtime.onMessage.removeListener(messageListener);
  }, 5 * 60 * 1000);
}

/**
 * Show authentication success message
 */
function showAuthSuccess(userName) {
  analysisResults.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full gap-3 py-4 text-secondary">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <p>Welcome back, ${userName}!</p>
      <p class="text-sm text-neutral-600">You're now logged in to FactShield AI</p>
    </div>
  `;
  
  // Clear the message after 3 seconds
  setTimeout(() => {
    showEmptyState();
  }, 3000);
}

/**
 * Show token expired message
 */
function showTokenExpired() {
  analysisResults.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full gap-3 py-4 text-warning">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>Session expired</p>
      <p class="text-sm text-neutral-600">Please log in again to continue</p>
    </div>
  `;
  
  // Clear the message after 5 seconds
  setTimeout(() => {
    showEmptyState();
  }, 5000);
}

/**
 * Show token refreshed message
 */
function showTokenRefreshed() {
  analysisResults.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full gap-3 py-4 text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      <p>Session refreshed</p>
      <p class="text-sm text-neutral-600">Your login has been automatically renewed</p>
    </div>
  `;
  
  // Clear the message after 2 seconds
  setTimeout(() => {
    showEmptyState();
  }, 2000);
}

// Logout button click handler
logoutBtn.addEventListener('click', async () => {
  try {
    // Show loading state
    analysisResults.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full gap-3 py-4">
        <div class="spinner"></div>
        <p class="text-neutral-600">Logging out...</p>
      </div>
    `;
    
    // Use service worker to handle logout
    const response = await chrome.runtime.sendMessage({ action: 'logout' });
    
    if (response.success) {
      loggedInView.classList.add('hidden');
      loggedOutView.classList.remove('hidden');
      
      // Show logout success message
      analysisResults.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full gap-3 py-4 text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <p>Logged out successfully</p>
        </div>
      `;
      
      setTimeout(() => {
        showEmptyState();
      }, 2000);
    } else {
      showError('Logout failed: ' + (response.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error during logout:', error);
    showError('Error during logout. Please try again.');
  }
});

// Analyze current page button click handler
analyzePageBtn.addEventListener('click', async () => {
  try {
    // Show loading state
    showLoading();
    
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script to analyze the page
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'analyzePage' },
      (response) => {
        if (chrome.runtime.lastError) {
          showError('Could not connect to page. Please refresh and try again.');
          return;
        }
        
        if (response && response.status === 'analyzing') {
          showAnalysisInProgress();
        }
      }
    );
  } catch (error) {
    console.error('Error analyzing page:', error);
    showError('Error analyzing page. Please try again.');
  }
});

// Analyze selection button click handler
analyzeSelectionBtn.addEventListener('click', async () => {
  try {
    // Show loading state
    showLoading();
    
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script to analyze the selection
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'analyzeSelection' },
      (response) => {
        if (chrome.runtime.lastError) {
          showError('Could not connect to page. Please refresh and try again.');
          return;
        }
        
        if (response && response.status === 'analyzing') {
          showAnalysisInProgress();
        } else if (response && response.status === 'noSelection') {
          showNoSelection();
        }
      }
    );
  } catch (error) {
    console.error('Error analyzing selection:', error);
    showError('Error analyzing selection. Please try again.');
  }
});

// Settings button click handler
settingsBtn.addEventListener('click', () => {
  // Open options page
  chrome.runtime.openOptionsPage();
});