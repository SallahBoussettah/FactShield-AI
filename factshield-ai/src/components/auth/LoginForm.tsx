import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import type { LoginFormData } from '../../types/auth';
import { getEmailError } from '../../utils/validation';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  successMessage?: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  onForgotPassword,
  isLoading = false,
  error = null,
  successMessage = null
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSubmitted, setForgotPasswordSubmitted] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  // Compute validation errors
  const errors = {
    email: touched.email || formSubmitted ? getEmailError(formData.email) : '',
    password: touched.password || formSubmitted 
      ? (formData.password ? '' : 'Password is required') 
      : ''
  };

  const forgotPasswordEmailError = forgotPasswordSubmitted 
    ? getEmailError(forgotPasswordEmail) 
    : '';

  // Check if form is valid
  const isFormValid = !errors.email && !errors.password;
  const isForgotPasswordValid = !forgotPasswordEmailError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (isFormValid) {
      await onSubmit(formData);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordSubmitted(true);
    
    if (isForgotPasswordValid) {
      try {
        setForgotPasswordLoading(true);
        setForgotPasswordError(null);
        await onForgotPassword(forgotPasswordEmail);
        setForgotPasswordSuccess(true);
      } catch (err) {
        setForgotPasswordError(
          err instanceof Error 
            ? err.message 
            : 'Failed to process password reset request. Please try again.'
        );
      } finally {
        setForgotPasswordLoading(false);
      }
    }
  };

  if (forgotPasswordMode) {
    return (
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-[var(--color-neutral-900)] mb-6">
          Reset your password
        </h2>
        
        {forgotPasswordSuccess ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-[var(--color-success-50)] border border-[var(--color-success-200)] text-[var(--color-success-700)] rounded-md">
              Password reset instructions have been sent to your email.
            </div>
            <Button
              variant="outline"
              onClick={() => setForgotPasswordMode(false)}
              className="mt-2"
            >
              Back to login
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-[var(--color-neutral-600)]">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            {forgotPasswordError && (
              <div className="mb-4 p-3 bg-[var(--color-danger-50)] border border-[var(--color-danger-200)] text-[var(--color-danger-700)] rounded-md">
                {forgotPasswordError}
              </div>
            )}
            
            <form onSubmit={handleForgotPasswordSubmit} noValidate>
              <div className="mb-4">
                <label 
                  htmlFor="forgotPasswordEmail" 
                  className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgotPasswordEmail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    forgotPasswordEmailError 
                      ? 'border-[var(--color-danger-300)] focus:ring-[var(--color-danger-200)]' 
                      : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary-200)]'
                  }`}
                  placeholder="Enter your email"
                  disabled={forgotPasswordLoading}
                />
                {forgotPasswordEmailError && (
                  <p className="mt-1 text-sm text-[var(--color-danger-500)]">
                    {forgotPasswordEmailError}
                  </p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotPasswordMode(false)}
                  disabled={forgotPasswordLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={forgotPasswordLoading}
                  className="flex-1"
                >
                  Send Instructions
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-[var(--color-neutral-900)] mb-6">
        Sign in to your account
      </h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-[var(--color-success-50)] border border-[var(--color-success-200)] text-[var(--color-success-700)] rounded-md">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-[var(--color-danger-50)] border border-[var(--color-danger-200)] text-[var(--color-danger-700)] rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email 
                ? 'border-[var(--color-danger-300)] focus:ring-[var(--color-danger-200)]' 
                : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary-200)]'
            }`}
            placeholder="Enter your email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-[var(--color-danger-500)]">{errors.email}</p>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-[var(--color-neutral-700)]"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setForgotPasswordMode(true)}
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.password 
                ? 'border-[var(--color-danger-300)] focus:ring-[var(--color-danger-200)]' 
                : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary-200)]'
            }`}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-[var(--color-danger-500)]">{errors.password}</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary-500)] border-[var(--color-neutral-300)] rounded"
              disabled={isLoading}
            />
            <label 
              htmlFor="rememberMe" 
              className="ml-2 block text-sm text-[var(--color-neutral-700)]"
            >
              Remember me
            </label>
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mb-4"
        >
          Sign In
        </Button>
        
        <p className="text-center text-sm text-[var(--color-neutral-600)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-primary)] hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;