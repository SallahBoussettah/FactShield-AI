/**
 * Extension Authentication Integration
 * Handles authentication flow between the website and browser extension
 */

export interface ExtensionAuthData {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Check if the current page is being accessed from the extension
 */
export function isFromExtension(): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('source') === 'extension';
}

/**
 * Check if this is an extension authentication redirect
 */
export function isExtensionAuthRedirect(): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('redirect') === 'extension_auth';
}

/**
 * Send authentication data to the extension
 */
export function sendAuthToExtension(authData: ExtensionAuthData): void {
  try {
    // Send message to extension
    if (window.chrome && window.chrome.runtime) {
      window.chrome.runtime.sendMessage({
        action: 'extensionAuth',
        success: true,
        token: authData.token,
        user: authData.user
      });
    }
    
    // Also try postMessage for content script communication
    window.postMessage({
      type: 'FACTSHIELD_AUTH',
      action: 'extensionAuth',
      success: true,
      token: authData.token,
      user: authData.user
    }, '*');
    
    console.log('Authentication data sent to extension');
  } catch (error) {
    console.error('Failed to send auth data to extension:', error);
  }
}

/**
 * Handle successful login for extension users
 */
export function handleExtensionLogin(token: string, user: any): void {
  if (isFromExtension() && isExtensionAuthRedirect()) {
    // Send auth data to extension
    sendAuthToExtension({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
    // Show success message and close tab
    showExtensionAuthSuccess(user.name);
  }
}

/**
 * Handle successful registration for extension users
 */
export function handleExtensionRegistration(token: string, user: any): void {
  if (isFromExtension() && isExtensionAuthRedirect()) {
    // Send auth data to extension
    sendAuthToExtension({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
    // Show success message and close tab
    showExtensionAuthSuccess(user.name);
  }
}

/**
 * Show extension authentication success message
 */
function showExtensionAuthSuccess(userName: string): void {
  // Create success overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  overlay.innerHTML = `
    <div style="
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      text-align: center;
      max-width: 400px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    ">
      <div style="
        width: 64px;
        height: 64px;
        background: #10b981;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h2 style="
        font-size: 1.5rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.5rem;
      ">Authentication Successful!</h2>
      <p style="
        color: #6b7280;
        margin-bottom: 1.5rem;
      ">Welcome back, ${userName}! You're now logged in to the FactShield AI extension.</p>
      <p style="
        color: #9ca3af;
        font-size: 0.875rem;
      ">This tab will close automatically in a few seconds...</p>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Close the tab after 3 seconds
  setTimeout(() => {
    window.close();
  }, 3000);
}

/**
 * Add extension authentication styles to the page
 */
export function addExtensionAuthStyles(): void {
  if (isFromExtension()) {
    // Add a subtle indicator that this is from the extension
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 1rem;
      right: 1rem;
      background: #4f46e5;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      z-index: 1000;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;
    indicator.textContent = '🔗 Extension Login';
    
    document.body.appendChild(indicator);
    
    // Remove indicator after 5 seconds
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 5000);
  }
}

/**
 * Initialize extension authentication integration
 */
export function initializeExtensionAuth(): void {
  // Add styles if from extension
  addExtensionAuthStyles();
  
  // Listen for messages from extension
  window.addEventListener('message', (event) => {
    if (event.data.type === 'FACTSHIELD_EXTENSION_REQUEST') {
      // Handle extension requests if needed
      console.log('Extension request received:', event.data);
    }
  });
  
  console.log('Extension authentication integration initialized');
}