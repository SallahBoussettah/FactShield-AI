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

// API endpoint (will be configured in the options)
const API_BASE_URL = 'http://localhost:5173/api';

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
    const authData = await chrome.storage.local.get('authToken');
    if (authData.authToken) {
      // User is logged in
      const userData = await chrome.storage.local.get('userData');
      if (userData.userData) {
        userName.textContent = userData.userData.name || 'User';
        loggedOutView.classList.add('hidden');
        loggedInView.classList.remove('hidden');
      }
    } else {
      // User is logged out
      loggedOutView.classList.remove('hidden');
      loggedInView.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthStatus();
  showEmptyState();
});

// Login button click handler
loginBtn.addEventListener('click', () => {
  // Open login page in a new tab
  chrome.tabs.create({ url: `http://localhost:5173/login?source=extension` });
});

// Register button click handler
registerBtn.addEventListener('click', () => {
  // Open registration page in a new tab
  chrome.tabs.create({ url: `http://localhost:5173/register?source=extension` });
});

// Logout button click handler
logoutBtn.addEventListener('click', async () => {
  try {
    await chrome.storage.local.remove(['authToken', 'userData']);
    loggedInView.classList.add('hidden');
    loggedOutView.classList.remove('hidden');
    showEmptyState();
  } catch (error) {
    console.error('Error during logout:', error);
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