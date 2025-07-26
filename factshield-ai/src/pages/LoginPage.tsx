import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import type { LoginFormData } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { useExtensionAuth } from '../hooks/useExtensionDetection';
import ExtensionAuthBridge from '../components/extension/ExtensionAuthBridge';

interface LocationState {
  message?: string;
  from?: string;
}

const LoginPage: React.FC = () => {
  const { authState, login, forgotPassword, clearErrors } = useAuth();
  const location = useLocation();
  const { isExtensionAuthFlow } = useExtensionAuth();
  
  // Redirect if user is already authenticated (unless it's extension auth flow)
  useAuthRedirect();
  
  // Get message from location state (e.g., after successful registration)
  const state = location.state as LocationState | null;
  const successMessage = state?.message || null;

  const handleLogin = async (formData: LoginFormData) => {
    try {
      await login(formData);
    } catch {
      // Error is handled in the auth context
    }
  };

  const handleForgotPassword = async (email: string) => {
    await forgotPassword(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-neutral-50)] px-4">
      {/* Extension Auth Bridge - handles communication with extension */}
      {isExtensionAuthFlow && <ExtensionAuthBridge />}
      
      <div className="w-full max-w-md">
        {/* Extension Auth Indicator */}
        {isExtensionAuthFlow && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Connecting to Extension</h3>
                <p className="text-sm text-blue-700">
                  Sign in to connect your FactShield AI browser extension
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">FactShield AI</h1>
          <p className="text-[var(--color-neutral-600)]">
            {isExtensionAuthFlow 
              ? 'Sign in to connect your browser extension'
              : 'Sign in to access your fact-checking dashboard'
            }
          </p>
        </div>
        
        <LoginForm 
          onSubmit={handleLogin} 
          onForgotPassword={handleForgotPassword}
          isLoading={authState.loading} 
          error={authState.error}
          successMessage={successMessage}
          onClearError={clearErrors}
        />
      </div>
    </div>
  );
};

export default LoginPage;