// FactShield AI Extension Onboarding Script

// DOM Elements
const createAccountBtn = document.getElementById('create-account-btn');
const settingsBtn = document.getElementById('settings-btn');
const getStartedBtn = document.getElementById('get-started-btn');
const linkDeviceBtn = document.getElementById('link-device-btn');

// Default API endpoint
const API_BASE_URL = 'http://localhost:5173/api';

/**
 * Check if user is already logged in
 */
async function checkAuthStatus() {
  try {
    const authData = await chrome.storage.local.get(['authToken', 'userData']);
    
    if (authData.authToken && authData.userData) {
      // User is already logged in, update UI
      createAccountBtn.textContent = 'Go to Dashboard';
      createAccountBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: `http://localhost:5173/dashboard` });
      });
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
  }
}

/**
 * Initialize onboarding page
 */
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthStatus();
});

// Create account button click handler
createAccountBtn.addEventListener('click', () => {
  // Open registration page in a new tab
  chrome.tabs.create({ url: `http://localhost:5173/register?source=extension` });
});

// Settings button click handler
settingsBtn.addEventListener('click', () => {
  // Open options page
  chrome.runtime.openOptionsPage();
});

// Get started button click handler
getStartedBtn.addEventListener('click', () => {
  // Close this tab
  window.close();
});

// Link device button click handler
linkDeviceBtn.addEventListener('click', async () => {
  try {
    // Check if user is logged in
    const authData = await chrome.storage.local.get(['authToken', 'userData']);
    
    if (authData.authToken && authData.userData) {
      // User is logged in, open device linking page
      chrome.tabs.create({ url: `http://localhost:5173/account/devices?source=extension` });
    } else {
      // User is not logged in, open login page
      chrome.tabs.create({ url: `http://localhost:5173/login?source=extension&redirect=account/devices` });
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    // Open login page as fallback
    chrome.tabs.create({ url: `http://localhost:5173/login?source=extension` });
  }
});