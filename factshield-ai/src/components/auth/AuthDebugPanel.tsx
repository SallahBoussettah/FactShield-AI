import React from 'react';
import { clearAllAuthData, debugAuth } from '../../utils/authDebug';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
const AuthDebugPanel: React.FC = () => {
  const { authState, logout } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm">
      <h3 className="text-sm font-bold mb-2">Auth Debug Panel</h3>
      <div className="text-xs mb-2">
        <p>Authenticated: {authState.isAuthenticated ? 'Yes' : 'No'}</p>
        <p>Loading: {authState.loading ? 'Yes' : 'No'}</p>
        <p>User: {authState.user?.email || 'None'}</p>
        <p>Error: {authState.error || 'None'}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={debugAuth}
        >
          Log Auth Info
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            try {
              const response = await fetch('http://localhost:3001/health');
              const data = await response.json();
              console.log('✅ Backend health check:', data);
              alert('Backend is running! Check console for details.');
            } catch (error) {
              console.error('❌ Backend health check failed:', error);
              alert('Backend connection failed! Check console for details.');
            }
          }}
        >
          Test Backend
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={clearAllAuthData}
        >
          Clear All Data
        </Button>
        {authState.isAuthenticated && (
          <Button
            size="sm"
            variant="outline"
            onClick={logout}
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuthDebugPanel;