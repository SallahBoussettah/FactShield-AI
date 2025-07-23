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
const API_BASE_URL = 'https://api.factshield-ai.com';

// Check authentication status on popup open
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const authData = await chrome.storage.local.get('authToken');
    if (authData.authToken) {
      // User is logged in
      const userData = await chrome.storage.local.get('userData');
      if (userData.userData) {
        userName.textContent = userData.userData.name || 'User';
        loggedOutView.style.display = 'none';
        loggedInView.style.display = 'block';
      }
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
  }
});

// Login button click handler
loginBtn.addEventListener('click', () => {
  // Open login page in a new tab
  chrome.tabs.create({ url: `${API_BASE_URL}/auth/login?source=extension` });
});

// Register button click handler
registerBtn.addEventListener('click', () => {
  // Open registration page in a new tab
  chrome.tabs.create({ url: `${API_BASE_URL}/auth/register?source=extension` });
});

// Logout button click handler
logoutBtn.addEventListener('click', async () => {
  try {
    await chrome.storage.local.remove(['authToken', 'userData']);
    loggedInView.style.display = 'none';
    loggedOutView.style.display = 'block';
  } catch (error) {
    console.error('Error during logout:', error);
  }
});

// Analyze current page button click handler
analyzePageBtn.addEventListener('click', async () => {
  try {
    // Show loading state
    analysisResults.innerHTML = '<p>Analyzing page...</p>';
    
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script to analyze the page
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'analyzePage' },
      (response) => {
        if (chrome.runtime.lastError) {
          analysisResults.innerHTML = '<p>Error: Could not connect to page. Please refresh and try again.</p>';
          return;
        }
        
        if (response && response.status === 'analyzing') {
          analysisResults.innerHTML = '<p>Analysis in progress. Results will appear on the page.</p>';
        }
      }
    );
  } catch (error) {
    console.error('Error analyzing page:', error);
    analysisResults.innerHTML = '<p>Error analyzing page. Please try again.</p>';
  }
});

// Analyze selection button click handler
analyzeSelectionBtn.addEventListener('click', async () => {
  try {
    // Show loading state
    analysisResults.innerHTML = '<p>Analyzing selection...</p>';
    
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script to analyze the selection
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'analyzeSelection' },
      (response) => {
        if (chrome.runtime.lastError) {
          analysisResults.innerHTML = '<p>Error: Could not connect to page. Please refresh and try again.</p>';
          return;
        }
        
        if (response && response.status === 'analyzing') {
          analysisResults.innerHTML = '<p>Analysis in progress. Results will appear on the page.</p>';
        } else if (response && response.status === 'noSelection') {
          analysisResults.innerHTML = '<p>No text selected. Please select text to analyze.</p>';
        }
      }
    );
  } catch (error) {
    console.error('Error analyzing selection:', error);
    analysisResults.innerHTML = '<p>Error analyzing selection. Please try again.</p>';
  }
});

// Settings button click handler
settingsBtn.addEventListener('click', () => {
  // Open options page
  chrome.runtime.openOptionsPage();
});