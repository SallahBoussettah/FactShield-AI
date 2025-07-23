// FactShield AI Extension Options Script

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const loggedOutView = document.getElementById('logged-out-view');
const loggedInView = document.getElementById('logged-in-view');
const userEmail = document.getElementById('user-email');
const messageContainer = document.getElementById('message-container');

// Form elements
const highlightClaims = document.getElementById('highlight-claims');
const autoAnalyze = document.getElementById('auto-analyze');
const notificationsEnabled = document.getElementById('notifications-enabled');
const apiEndpoint = document.getElementById('api-endpoint');
const syncHistory = document.getElementById('sync-history');
const accountLinking = document.getElementById('account-linking');

// Default settings
const defaultSettings = {
  highlightClaims: true,
  autoAnalyze: false,
  notificationsEnabled: true,
  apiEndpoint: 'http://localhost:5173/api',
  syncHistory: true,
  accountLinking: true
};

/**
 * Shows a message notification
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error, info)
 */
function showMessage(message, type = 'info') {
  // Create message element
  const messageElement = document.createElement('div');
  
  // Set classes based on message type
  let bgColor, textColor, borderColor;
  
  switch (type) {
    case 'success':
      bgColor = 'bg-secondary/10';
      textColor = 'text-secondary';
      borderColor = 'border-l-secondary';
      break;
    case 'error':
      bgColor = 'bg-danger/10';
      textColor = 'text-danger';
      borderColor = 'border-l-danger';
      break;
    default: // info
      bgColor = 'bg-primary/10';
      textColor = 'text-primary';
      borderColor = 'border-l-primary';
  }
  
  // Add classes to the message element
  messageElement.className = `message ${bgColor} ${textColor} ${borderColor} py-3 px-4 rounded-md shadow-md border-l-4 mb-2`;
  messageElement.textContent = message;
  
  // Add message to container
  messageContainer.appendChild(messageElement);
  
  // Remove message after 3 seconds
  setTimeout(() => {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(10px)';
    messageElement.style.transition = 'opacity 0.3s, transform 0.3s';
    
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 300);
  }, 3000);
}

/**
 * Load settings from storage
 */
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
    
    // Apply new settings
    if (settings.accountLinking !== undefined) {
      accountLinking.checked = settings.accountLinking;
    }
    
    // Apply light theme
    applyTheme();
  } catch (error) {
    console.error('Error loading settings:', error);
    // Apply default settings
    applySettings(defaultSettings);
  }
}

/**
 * Save settings to storage
 */
async function saveSettings() {
  try {
    const settings = {
      highlightClaims: highlightClaims.checked,
      autoAnalyze: autoAnalyze.checked,
      notificationsEnabled: notificationsEnabled.checked,
      apiEndpoint: apiEndpoint.value.trim(),
      syncHistory: syncHistory.checked,
      accountLinking: accountLinking.checked
    };
    
    await chrome.storage.local.set({ settings });
    
    // Apply light theme
    applyTheme();
    
    // Show success message
    showMessage('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showMessage('Error saving settings. Please try again.', 'error');
  }
}

/**
 * Reset settings to defaults
 */
function resetToDefaults() {
  // Apply default settings to form
  applySettings(defaultSettings);
  
  // Show message
  showMessage('Settings reset to defaults. Click Save to apply.', 'info');
}

/**
 * Apply settings to form
 * @param {Object} settings - The settings to apply
 */
function applySettings(settings) {
  highlightClaims.checked = settings.highlightClaims;
  autoAnalyze.checked = settings.autoAnalyze;
  notificationsEnabled.checked = settings.notificationsEnabled;
  apiEndpoint.value = settings.apiEndpoint;
  syncHistory.checked = settings.syncHistory;
  accountLinking.checked = settings.accountLinking !== undefined ? settings.accountLinking : true;
}

/**
 * Apply light theme
 */
function applyTheme() {
  const htmlElement = document.documentElement;
  
  // Always use light theme
  htmlElement.classList.remove('theme-dark');
  htmlElement.classList.add('theme-light');
}

/**
 * Check authentication status
 */
async function checkAuthStatus() {
  try {
    const authData = await chrome.storage.local.get(['authToken', 'userData']);
    
    if (authData.authToken && authData.userData) {
      // User is logged in
      userEmail.textContent = authData.userData.email || 'user@example.com';
      loggedOutView.classList.add('hidden');
      loggedInView.classList.remove('hidden');
    } else {
      // User is not logged in
      loggedOutView.classList.remove('hidden');
      loggedInView.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    // Assume not logged in
    loggedOutView.classList.remove('hidden');
    loggedInView.classList.add('hidden');
  }
}

/**
 * Generate device linking code
 * @returns {string} A random 6-character code
 */
function generateLinkingCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar-looking characters
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  
  return code;
}

// Initialize options page
document.addEventListener('DOMContentLoaded', async () => {
  // Load settings
  await loadSettings();
  
  // Check authentication status
  await checkAuthStatus();
});

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
    loggedInView.classList.add('hidden');
    loggedOutView.classList.remove('hidden');
    
    // Show message
    showMessage('Logged out successfully.', 'success');
  } catch (error) {
    console.error('Error during logout:', error);
    showMessage('Error logging out. Please try again.', 'error');
  }
});

saveBtn.addEventListener('click', saveSettings);
resetBtn.addEventListener('click', resetToDefaults);