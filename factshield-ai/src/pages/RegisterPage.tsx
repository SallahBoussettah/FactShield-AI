import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';
import type { RegisterFormData } from '../types/auth';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register(data);
      // Redirect to login page after successful registration
      navigate('/login', { 
        state: { message: 'Registration successful! Please sign in.' }
      });
    } catch (error) {
      // Error handling is done in the RegisterForm component
      throw error;
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
        
        <RegisterForm onSubmit={handleRegister} />
        
      </div>
    </div>
  );
};

export default RegisterPage;