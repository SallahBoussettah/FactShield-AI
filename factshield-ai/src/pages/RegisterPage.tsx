import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import type { RegisterFormData } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

const RegisterPage: React.FC = () => {
  const { authState, register } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if user is already authenticated
  useAuthRedirect();

  const handleRegister = async (formData: RegisterFormData) => {
    try {
      await register(formData);
      
      // On successful registration, redirect to login
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your new account.' 
        } 
      });
    } catch (err) {
      // Error is handled in the auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-neutral-50)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">FactShield AI</h1>
          <p className="text-[var(--color-neutral-600)]">
            Create an account to start fact-checking content
          </p>
        </div>
        
        <RegisterForm 
          onSubmit={handleRegister} 
          isLoading={authState.loading} 
          error={authState.error} 
        />
      </div>
    </div>
  );
};

export default RegisterPage;