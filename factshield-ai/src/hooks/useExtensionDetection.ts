import { useState, useEffect } from 'react';

/**
 * Hook to detect if the FactShield AI browser extension is installed
 */
export const useExtensionDetection = () => {
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkExtension = async () => {
      try {
        // Method 1: Try to communicate with extension
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          // Try to send a message to the extension
          // Note: This requires the extension to handle this message type
          chrome.runtime.sendMessage(
            'your-extension-id', // You'll need to replace this with actual extension ID
            { action: 'ping' },
            (response) => {
              if (!chrome.runtime.lastError && response) {
                setIsExtensionInstalled(true);
              } else {
                setIsExtensionInstalled(false);
              }
              setIsChecking(false);
            }
          );
        } else {
          // Method 2: Check for extension-specific DOM elements or global variables
          // The extension content script might inject something we can detect
          const checkForExtensionMarkers = () => {
            // Check if extension content script has run
            const extensionMarker = document.querySelector('[data-factshield-extension]');
            const extensionGlobal = (window as any).factshieldExtension;
            
            if (extensionMarker || extensionGlobal) {
              setIsExtensionInstalled(true);
            } else {
              setIsExtensionInstalled(false);
            }
            setIsChecking(false);
          };

          // Check immediately and after a short delay
          checkForExtensionMarkers();
          setTimeout(checkForExtensionMarkers, 1000);
        }
      } catch (error) {
        console.error('Error checking for extension:', error);
        setIsExtensionInstalled(false);
        setIsChecking(false);
      }
    };

    checkExtension();
  }, []);

  return { isExtensionInstalled, isChecking };
};

/**
 * Hook to handle extension-specific authentication flow
 */
export const useExtensionAuth = () => {
  const [isExtensionAuthFlow, setIsExtensionAuthFlow] = useState(false);

  useEffect(() => {
    // Check if this page was opened for extension authentication
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    const redirect = urlParams.get('redirect');
    
    if (source === 'extension' || redirect === 'extension_auth') {
      setIsExtensionAuthFlow(true);
    }
  }, []);

  return { isExtensionAuthFlow };
};