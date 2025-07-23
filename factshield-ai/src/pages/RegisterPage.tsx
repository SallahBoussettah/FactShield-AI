import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';
import type { RegisterFormData } from '../types/auth';

const RegisterPage: React.FC = () => {
  const { authState, register, clearErrors } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register(data);
      // Registration automatically logs the user in, so redirect to dashboard
      navigate('/dashboard');
    } catch {
      // Error is handled in the auth context and will be displayed via authState.error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-neutral-50)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">FactShield AI</h1>
          <p className="text-[var(--color-neutral-600)]">
            Create your account to start fact-checking content
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