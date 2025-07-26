// Authentication Settings Page Script

// DOM Elements
const authStatus = document.getElementById('auth-status');
const authStatusText = document.getElementById('auth-status-text');
const userInfo = document.getElementById('user-info');
const tokenInfo = document.getElementById('token-info');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userType = document.getElementById('user-type');
const tokenStatus = document.getElementById('token-status');
const tokenExpiry = document.getElementById('token-expiry');
const tokenRefreshed = document.getElementById('token-refreshed');

const loginBtn = document.getElementById('login-btn');
const refreshTokenBtn = document.getElementById('refresh-token-btn');
const logoutBtn = document.getElementById('logout-btn');
const refreshStatusBtn = document.getElementById('refresh-status-btn');
const clearCacheBtn = document.getElementById('clear-cache-btn');

// Website URL
const WEBSITE_URL = 'http://localhost:5173';

/**
 * Update the UI based on authentication status
 */
async function updateAuthStatus() {
  try {
    // Show loading state
    authStatusText.textContent = 'Checking authentication status...';
    setButtonLoading(refreshStatusBtn, true);
    
    // Get auth status from service worker
    const response = await chrome.runtime.sendMessage({ action: 'getAuthStatus' });
    
    if (response.isAuthenticated && response.userData) {
      // User is authenticated
      showAuthenticatedState(response.userData, response);
    } else {
      // User is not authenticated
      showUnauthenticatedState(response);
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    showErrorState(error.message);
  } finally {
    setButtonLoading(refreshStatusBtn, false);
  }
}

/**
 * Show authenticated state
 */
function showAuthenticatedState(userData, authResponse) {
  // Update status indicator
  authStatus.className = 'auth-status authenticated';
  authStatus.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>Authenticated and connected to FactShield AI</span>
  `;
  
  // Show user information
  userName.textContent = userData.name || 'Not provided';
  userEmail.textContent = userData.email || 'Not provided';
  userType.textContent = userData.accountType || userData.role || 'Standard';
  userInfo.classList.remove('hidden');
  
  // Show token information
  updateTokenInfo(authResponse);
  tokenInfo.classList.remove('hidden');
  
  // Show/hide buttons
  loginBtn.classList.add('hidden');
  refreshTokenBtn.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
  
  // Show token refresh notification if it happened
  if (authResponse.tokenRefreshed) {
    showNotification('Session automatically refreshed', 'success');
  }
}

/**
 * Show unauthenticated state
 */
function showUnauthenticatedState(authResponse) {
  // Update status indicator
  authStatus.className = 'auth-status not-authenticated';
  authStatus.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>Not authenticated - Please log in to use FactShield AI</span>
  `;
  
  // Hide user and token information
  userInfo.classList.add('hidden');
  tokenInfo.classList.add('hidden');
  
  // Show/hide buttons
  loginBtn.classList.remove('hidden');
  refreshTokenBtn.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  
  // Show token expiry notification if applicable
  if (authResponse.tokenExpired) {
    showNotification('Your session has expired. Please log in again.', 'warning');
  }
}

/**
 * Show error state
 */
function showErrorState(errorMessage) {
  authStatus.className = 'auth-status not-authenticated';
  authStatus.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>Error checking authentication: ${errorMessage}</span>
  `;
  
  userInfo.classList.add('hidden');
  tokenInfo.classList.add('hidden');
  loginBtn.classList.remove('hidden');
  refreshTokenBtn.classList.add('hidden');
  logoutBtn.classList.add('hidden');
}

/**
 * Update token information display
 */
async function updateTokenInfo(authResponse) {
  try {
    const data = await chrome.storage.local.get(['tokenExpiry', 'authToken']);
    
    tokenStatus.textContent = 'Valid';
    
    if (data.tokenExpiry) {
      const expiryDate = new Date(data.tokenExpiry);
      const now = new Date();
      const timeUntilExpiry = expiryDate.getTime() - now.getTime();
      
      if (timeUntilExpiry > 0) {
        const hours = Math.floor(timeUntilExpiry / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60));
        tokenExpiry.textContent = `${expiryDate.toLocaleString()} (${hours}h ${minutes}m remaining)`;
      } else {
        tokenExpiry.textContent = 'Expired';
        tokenStatus.textContent = 'Expired';
      }
    } else {
      tokenExpiry.textContent = 'No expiry information';
    }
    
    // Show when token was last refreshed (if available)
    const lastRefresh = localStorage.getItem('lastTokenRefresh');
    if (lastRefresh) {
      tokenRefreshed.textContent = new Date(lastRefresh).toLocaleString();
    } else {
      tokenRefreshed.textContent = 'Not available';
    }
  } catch (error) {
    console.error('Error updating token info:', error);
    tokenStatus.textContent = 'Error';
    tokenExpiry.textContent = 'Error loading information';
    tokenRefreshed.textContent = 'Error loading information';
  }
}

/**
 * Set button loading state
 */
function setButtonLoading(button, loading) {
  if (loading) {
    button.disabled = true;
    const originalContent = button.innerHTML;
    button.dataset.originalContent = originalContent;
    button.innerHTML = `<div class="loading"></div> Loading...`;
  } else {
    button.disabled = false;
    if (button.dataset.originalContent) {
      button.innerHTML = button.dataset.originalContent;
      delete button.dataset.originalContent;
    }
  }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(n => n.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    max-width: 400px;
  `;
  
  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.background = '#10b981';
      break;
    case 'warning':
      notification.style.background = '#f59e0b';
      break;
    case 'error':
      notification.style.background = '#ef4444';
      break;
    default:
      notification.style.background = '#3b82f6';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Event Listeners

// Login button
loginBtn.addEventListener('click', () => {
  chrome.tabs.create({ 
    url: `${WEBSITE_URL}/login?source=extension&redirect=extension_auth`,
    active: true
  });
  
  // Listen for authentication completion
  const messageListener = (message, sender, sendResponse) => {
    if (message.action === 'extensionAuth' && message.success) {
      showNotification('Successfully logged in!', 'success');
      updateAuthStatus();
      chrome.runtime.onMessage.removeListener(messageListener);
    }
  };
  
  chrome.runtime.onMessage.addListener(messageListener);
  
  // Remove listener after 5 minutes
  setTimeout(() => {
    chrome.runtime.onMessage.removeListener(messageListener);
  }, 5 * 60 * 1000);
});

// Refresh token button
refreshTokenBtn.addEventListener('click', async () => {
  try {
    setButtonLoading(refreshTokenBtn, true);
    
    const response = await chrome.runtime.sendMessage({ action: 'refreshToken' });
    
    if (response.success) {
      showNotification('Session refreshed successfully!', 'success');
      localStorage.setItem('lastTokenRefresh', new Date().toISOString());
      await updateAuthStatus();
    } else {
      showNotification('Failed to refresh session: ' + (response.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    showNotification('Error refreshing session', 'error');
  } finally {
    setButtonLoading(refreshTokenBtn, false);
  }
});

// Logout button
logoutBtn.addEventListener('click', async () => {
  try {
    setButtonLoading(logoutBtn, true);
    
    const response = await chrome.runtime.sendMessage({ action: 'logout' });
    
    if (response.success) {
      showNotification('Logged out successfully', 'success');
      await updateAuthStatus();
    } else {
      showNotification('Logout failed: ' + (response.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    showNotification('Error during logout', 'error');
  } finally {
    setButtonLoading(logoutBtn, false);
  }
});

// Refresh status button
refreshStatusBtn.addEventListener('click', updateAuthStatus);

// Clear cache button
clearCacheBtn.addEventListener('click', async () => {
  try {
    setButtonLoading(clearCacheBtn, true);
    
    const response = await chrome.runtime.sendMessage({ action: 'clearCache' });
    
    if (response.success) {
      showNotification('Analysis cache cleared successfully', 'success');
    } else {
      showNotification('Failed to clear cache: ' + (response.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
    showNotification('Error clearing cache', 'error');
  } finally {
    setButtonLoading(clearCacheBtn, false);
  }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  updateAuthStatus();
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});