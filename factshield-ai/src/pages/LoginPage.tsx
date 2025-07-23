import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import type { LoginFormData } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

interface LocationState {
  message?: string;
  from?: string;
}

const LoginPage: React.FC = () => {
  const { authState, login, forgotPassword, clearErrors } = useAuth();
  const location = useLocation();
  
  // Redirect if user is already authenticated
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
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">FactShield AI</h1>
          <p className="text-[var(--color-neutral-600)]">
            Sign in to access your fact-checking dashboard
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