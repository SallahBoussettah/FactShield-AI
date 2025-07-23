// DOM Elements
const createAccountBtn = document.getElementById('create-account-btn');
const settingsBtn = document.getElementById('settings-btn');
const getStartedBtn = document.getElementById('get-started-btn');

// Default API endpoint
const API_BASE_URL = 'https://api.factshield-ai.com';

// Event listeners
createAccountBtn.addEventListener('click', () => {
  // Get API endpoint from settings
  chrome.storage.local.get('settings', (data) => {
    const settings = data.settings || { apiEndpoint: API_BASE_URL };
    const endpoint = settings.apiEndpoint || API_BASE_URL;
    
    // Open registration page in a new tab
    chrome.tabs.create({ url: `${endpoint}/auth/register?source=extension` });
  });
});

settingsBtn.addEventListener('click', () => {
  // Open options page
  chrome.runtime.openOptionsPage();
});

getStartedBtn.addEventListener('click', () => {
  // Close this tab
  window.close();
});