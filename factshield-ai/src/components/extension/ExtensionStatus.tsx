import React from 'react';
import { useExtensionDetection } from '../../hooks/useExtensionDetection';
import { useAuth } from '../../contexts/AuthContext';

interface ExtensionStatusProps {
  className?: string;
  showInstallPrompt?: boolean;
}

/**
 * Component that shows the browser extension connection status
 */
const ExtensionStatus: React.FC<ExtensionStatusProps> = ({ 
  className = '',
  showInstallPrompt = true 
}) => {
  const { isExtensionInstalled, isChecking } = useExtensionDetection();
  const { authState } = useAuth();

  if (isChecking) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-600">Checking extension...</span>
      </div>
    );
  }

  if (!isExtensionInstalled) {
    return showInstallPrompt ? (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
          <div className="flex-1">
            <h3 className="font-medium text-blue-900 mb-1">
              Browser Extension Not Detected
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Install the FactShield AI browser extension to analyze web content in real-time.
            </p>
            <a
              href="/browser-extension"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Install Extension
            </a>
          </div>
        </div>
      </div>
    ) : null;
  }

  // Extension is installed
  const isConnected = isExtensionInstalled && authState.isAuthenticated;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
      <span className="text-sm text-gray-700">
        Extension {isConnected ? 'Connected' : 'Installed'}
      </span>
      {!isConnected && authState.isAuthenticated && (
        <span className="text-xs text-yellow-600 ml-1">
          (Authentication pending)
        </span>
      )}
    </div>
  );
};

export default ExtensionStatus;