// Authentication bridge content script
// This script runs on your website to facilitate authentication with the extension

// Only run on your website domains
const ALLOWED_DOMAINS = ['localhost:5173', 'localhost:3000', 'factshield-ai.com'];
const currentDomain = window.location.host;

if (ALLOWED_DOMAINS.some(domain => currentDomain.includes(domain))) {
  
  // Listen for authentication events from the website
  window.addEventListener('message', (event) => {
    // Verify origin
    if (!ALLOWED_DOMAINS.some(domain => event.origin.includes(domain))) {
      return;
    }
    
    // Handle extension authentication
    if (event.data.type === 'EXTENSION_AUTH') {
      handleExtensionAuth(event.data);
    }
  });
  
  // Function to handle extension authentication
  function handleExtensionAuth(authData) {
    console.log('Auth bridge: Received auth data', authData);
    
    if (authData.success && authData.token) {
      console.log('Auth bridge: Sending to extension background script');
      
      // Send authentication data to extension
      chrome.runtime.sendMessage({
        action: 'extensionAuth',
        success: true,
        token: authData.token,
        user: authData.user,
        expiresAt: authData.expiresAt,
        refreshToken: authData.refreshToken
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Extension communication error:', chrome.runtime.lastError);
          return;
        }
        
        console.log('Auth bridge: Extension response', response);
        
        if (response && response.success) {
          // Show success message on the website
          showAuthSuccessMessage();
          
          // Close the window after a delay if it was opened for extension auth
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('source') === 'extension') {
            setTimeout(() => {
              window.close();
            }, 2000);
          }
        }
      });
    } else {
      console.log('Auth bridge: Invalid auth data', authData);
    }
  }
  
  // Function to show success message on the website
  function showAuthSuccessMessage() {
    // Create or update success message
    let successMessage = document.getElementById('extension-auth-success');
    
    if (!successMessage) {
      successMessage = document.createElement('div');
      successMessage.id = 'extension-auth-success';
      successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      `;
      
      // Add animation keyframes
      if (!document.getElementById('extension-auth-styles')) {
        const styles = document.createElement('style');
        styles.id = 'extension-auth-styles';
        styles.textContent = `
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
        document.head.appendChild(styles);
      }
      
      document.body.appendChild(successMessage);
    }
    
    successMessage.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <div>
          <div style="font-weight: 600;">Extension Connected!</div>
          <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">
            You're now logged in to FactShield AI extension
          </div>
        </div>
      </div>
    `;
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      if (successMessage) {
        successMessage.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
          }
        }, 300);
      }
    }, 4000);
  }
  
  // Check if this page was opened for extension authentication
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('source') === 'extension') {
    // Add a visual indicator that this is for extension auth
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      color: white;
      text-align: center;
      padding: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    indicator.textContent = '🔗 Connecting to FactShield AI Extension...';
    document.body.appendChild(indicator);
    
    // Listen for successful authentication from your app
    const checkForAuth = () => {
      // Check for tokens using your secure storage keys
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      console.log('Auth bridge: Checking for auth', { hasToken: !!token, hasUserData: !!userData });
      
      if (token && userData) {
        try {
          // Decrypt the data (simple XOR decryption to match your secure storage)
          const decryptedToken = decrypt(token);
          const decryptedUserData = decrypt(userData);
          const user = JSON.parse(decryptedUserData);
          
          console.log('Auth bridge: Found auth data, posting message');
          
          window.postMessage({
            type: 'EXTENSION_AUTH',
            success: true,
            token: decryptedToken,
            user: user,
            expiresAt: null, // You can add token expiry if available
            refreshToken: null
          }, window.location.origin);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };
    
    // Simple decryption function to match your secure storage
    const decrypt = (value) => {
      try {
        const ENCRYPTION_KEY = 'factshield-secure-storage-key';
        return Array.from(value)
          .map(char => 
            String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(0))
          )
          .join('');
      } catch (error) {
        console.error('Decryption error:', error);
        return value;
      }
    };
    
    // Listen for authentication success from your React app
    const handleStorageChange = () => {
      checkForAuth();
    };
    
    // Listen for localStorage changes (when user logs in)
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from your React app
    window.addEventListener('factshield-auth-success', (event) => {
      if (event.detail && event.detail.token) {
        window.postMessage({
          type: 'EXTENSION_AUTH',
          success: true,
          token: event.detail.token,
          user: event.detail.user,
          expiresAt: event.detail.expiresAt,
          refreshToken: event.detail.refreshToken
        }, window.location.origin);
      }
    });
    
    // Check periodically for authentication
    const authCheckInterval = setInterval(() => {
      checkForAuth();
    }, 2000);
    
    // Stop checking after 5 minutes
    setTimeout(() => {
      clearInterval(authCheckInterval);
      window.removeEventListener('storage', handleStorageChange);
    }, 5 * 60 * 1000);
    
    // Also check immediately
    setTimeout(checkForAuth, 500);
  }
}