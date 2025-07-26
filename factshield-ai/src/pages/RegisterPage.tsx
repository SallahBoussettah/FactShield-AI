import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';
import type { RegisterFormData } from '../types/auth';
import { useExtensionAuth } from '../hooks/useExtensionDetection';
import ExtensionAuthBridge from '../components/extension/ExtensionAuthBridge';

const RegisterPage: React.FC = () => {
  const { authState, register, clearErrors } = useAuth();
  const navigate = useNavigate();
  const { isExtensionAuthFlow } = useExtensionAuth();

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register(data);
      // Registration automatically logs the user in
      if (isExtensionAuthFlow) {
        // For extension auth, stay on page to complete the bridge connection
        // The ExtensionAuthBridge will handle the connection
      } else {
        // Normal flow - redirect to dashboard
        navigate('/dashboard');
      }
    } catch {
      // Error is handled in the auth context and will be displayed via authState.error
    }
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
                  Create your account to connect the FactShield AI browser extension
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">FactShield AI</h1>
          <p className="text-[var(--color-neutral-600)]">
            {isExtensionAuthFlow 
              ? 'Create your account to connect your browser extension'
              : 'Create your account to start fact-checking content'
            }
          </p>
        </div>
        
        <RegisterForm 
          onSubmit={handleRegister} 
          isLoading={authState.loading}
          error={authState.error}
          onClearError={clearErrors}
        />
        
      </div>
    </div>
  );
};

export default RegisterPage;