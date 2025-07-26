import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthToken, getUserData } from '../../utils/secureStorage';

/**
 * Component that handles authentication bridge with the browser extension
 * This should be included in your app when extension authentication is needed
 */
const ExtensionAuthBridge: React.FC = () => {
  const { authState } = useAuth();

  useEffect(() => {
    // Function to send auth data to extension
    const sendAuthToExtension = () => {
      console.log('ExtensionAuthBridge: Checking auth state', {
        isAuthenticated: authState.isAuthenticated,
        hasUser: !!authState.user
      });
      
      if (authState.isAuthenticated && authState.user) {
        const token = getAuthToken();
        console.log('ExtensionAuthBridge: Got token', { hasToken: !!token, tokenLength: token?.length });
        
        if (token) {
          // Dispatch custom event for extension
          const authEvent = new CustomEvent('factshield-auth-success', {
            detail: {
              token,
              user: authState.user,
              expiresAt: null, // You can add token expiry if available
              refreshToken: null // Add refresh token if available
            }
          });
          window.dispatchEvent(authEvent);
          console.log('ExtensionAuthBridge: Dispatched custom event');

          // Also post message for extension content script
          window.postMessage({
            type: 'EXTENSION_AUTH',
            success: true,
            token,
            user: authState.user,
            expiresAt: null,
            refreshToken: null
          }, window.location.origin);
          console.log('ExtensionAuthBridge: Posted message to window');
        }
      }
    };

    // Send auth data when component mounts and user is authenticated
    if (authState.isAuthenticated) {
      sendAuthToExtension();
    }

    // Listen for auth state changes
    const handleAuthChange = () => {
      if (authState.isAuthenticated) {
        sendAuthToExtension();
      }
    };

    // Set up a small delay to ensure auth state is fully loaded
    const timer = setTimeout(handleAuthChange, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [authState.isAuthenticated, authState.user]);

  // This component doesn't render anything visible
  return null;
};

export default ExtensionAuthBridge;