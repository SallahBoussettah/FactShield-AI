// DOM Elements
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const loggedOutView = document.getElementById('logged-out-view');
const loggedInView = document.getElementById('logged-in-view');
const userEmail = document.getElementById('user-email');

// Form elements
const highlightClaims = document.getElementById('highlight-claims');
const autoAnalyze = document.getElementById('auto-analyze');
const notificationsEnabled = document.getElementById('notifications-enabled');
const apiEndpoint = document.getElementById('api-endpoint');
const syncHistory = document.getElementById('sync-history');

// Default settings
const defaultSettings = {
  highlightClaims: true,
  autoAnalyze: false,
  notificationsEnabled: true,
  apiEndpoint: 'http://localhost:5173/api',
  syncHistory: true
};

// Load settings and auth status when options page is opened
document.addEventListener('DOMContentLoaded', async () => {
  // Load settings
  loadSettings();

  // Check authentication status
  checkAuthStatus();
});

// Function to load settings from storage
async function loadSettings() {
  try {
    const data = await chrome.storage.local.get('settings');
    const settings = data.settings || defaultSettings;

    // Apply settings to form
    highlightClaims.checked = settings.highlightClaims;
    autoAnalyze.checked = settings.autoAnalyze;
    notificationsEnabled.checked = settings.notificationsEnabled;
    apiEndpoint.value = settings.apiEndpoint;
    syncHistory.checked = settings.syncHistory;
  } catch (error) {
    console.error('Error loading settings:', error);
    // Apply default settings
    applySettings(defaultSettings);
  }
}

// Function to save settings to storage
async function saveSettings() {
  try {
    const settings = {
      highlightClaims: highlightClaims.checked,
      autoAnalyze: autoAnalyze.checked,
      notificationsEnabled: notificationsEnabled.checked,
      apiEndpoint: apiEndpoint.value.trim(),
      syncHistory: syncHistory.checked
    };

    await chrome.storage.local.set({ settings });

    // Show success message
    showMessage('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showMessage('Error saving settings. Please try again.', 'error');
  }
}

// Function to reset settings to defaults
function resetToDefaults() {
  // Apply default settings to form
  applySettings(defaultSettings);

  // Show message
  showMessage('Settings reset to defaults. Click Save to apply.', 'info');
}

// Function to apply settings to form
function applySettings(settings) {
  highlightClaims.checked = settings.highlightClaims;
  autoAnalyze.checked = settings.autoAnalyze;
  notificationsEnabled.checked = settings.notificationsEnabled;
  apiEndpoint.value = settings.apiEndpoint;
  syncHistory.checked = settings.syncHistory;
}

// Function to check authentication status
async function checkAuthStatus() {
  try {
    const authData = await chrome.storage.local.get(['authToken', 'userData']);

    if (authData.authToken && authData.userData) {
      // User is logged in
      userEmail.textContent = authData.userData.email || 'user@example.com';
      loggedOutView.style.display = 'none';
      loggedInView.style.display = 'block';
    } else {
      // User is not logged in
      loggedOutView.style.display = 'block';
      loggedInView.style.display = 'none';
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    // Assume not logged in
    loggedOutView.style.display = 'block';
    loggedInView.style.display = 'none';
  }
}

// Function to show message
function showMessage(message, type = 'info') {
  // Remove existing message if any
  const existingMessage = document.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `message message-${type}`;
  messageElement.textContent = message;

  // Add message to page
  document.querySelector('.options-container').appendChild(messageElement);

  // Remove message after 3 seconds
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.remove();
    }
  }, 3000);
}

// Event listeners
loginBtn.addEventListener('click', () => {
  // Open login page in a new tab
  chrome.tabs.create({ url: `http://localhost:5173/login?source=extension` });
});

registerBtn.addEventListener('click', () => {
  // Open registration page in a new tab
  chrome.tabs.create({ url: `http://localhost:5173/register?source=extension` });
});

logoutBtn.addEventListener('click', async () => {
  try {
    // Clear auth data
    await chrome.storage.local.remove(['authToken', 'userData']);

    // Update UI
    loggedInView.style.display = 'none';
    loggedOutView.style.display = 'block';

    // Show message
    showMessage('Logged out successfully.', 'success');
  } catch (error) {
    console.error('Error during logout:', error);
    showMessage('Error logging out. Please try again.', 'error');
  }
});

saveBtn.addEventListener('click', saveSettings);
resetBtn.addEventListener('click', resetToDefaults);

// Add CSS for messages
const style = document.createElement('style');
style.textContent = `
  .message {
    position: fixed;
    bottom: 16px;
    right: 16px;
    padding: 12px 16px;
    border-radius: 4px;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    animation: slide-in 0.3s ease-out;
  }
  
  @keyframes slide-in {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .message-success {
    background-color: #ecfdf5;
    color: #065f46;
    border-left: 4px solid #10b981;
  }
  
  .message-error {
    background-color: #fee2e2;
    color: #b91c1c;
    border-left: 4px solid #ef4444;
  }
  
  .message-info {
    background-color: #eff6ff;
    color: #1e40af;
    border-left: 4px solid #3b82f6;
  }
`;
document.head.appendChild(style);