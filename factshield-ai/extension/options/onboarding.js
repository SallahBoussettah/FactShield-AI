// DOM Elements
const createAccountBtn = document.getElementById('create-account-btn');
const settingsBtn = document.getElementById('settings-btn');
const getStartedBtn = document.getElementById('get-started-btn');

// Default API endpoint
const API_BASE_URL = 'http://localhost:5173/api';

// Event listeners
createAccountBtn.addEventListener('click', () => {
  // Open registration page in a new tab
  chrome.tabs.create({ url: `http://localhost:5173/register?source=extension` });
});

settingsBtn.addEventListener('click', () => {
  // Open options page
  chrome.runtime.openOptionsPage();
});

getStartedBtn.addEventListener('click', () => {
  // Close this tab
  window.close();
});