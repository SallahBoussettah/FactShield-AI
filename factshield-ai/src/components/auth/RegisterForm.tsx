import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import type { RegisterFormData } from '../../types/auth';
import { 
  getEmailError, 
  getPasswordError, 
  getConfirmPasswordError, 
  getNameError 
} from '../../utils/validation';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  error = null
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  // Compute validation errors
  const errors = {
    name: touched.name || formSubmitted ? getNameError(formData.name) : '',
    email: touched.email || formSubmitted ? getEmailError(formData.email) : '',
    password: touched.password || formSubmitted ? getPasswordError(formData.password) : '',
    confirmPassword: touched.confirmPassword || formSubmitted 
      ? getConfirmPasswordError(formData.password, formData.confirmPassword) 
      : ''
  };

  // Check if form is valid
  const isFormValid = !errors.name && !errors.email && !errors.password && !errors.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-[var(--color-neutral-900)] mb-6">
        Create your account
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-[var(--color-danger-50)] border border-[var(--color-danger-200)] text-[var(--color-danger-700)] rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.name 
                ? 'border-[var(--color-danger-300)] focus:ring-[var(--color-danger-200)]' 
                : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary-200)]'
            }`}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-[var(--color-danger-500)]">{errors.name}</p>
          )}
        </div>
        
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
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1"
          >
            Password
          </label>
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
            placeholder="Create a password"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-[var(--color-danger-500)]">{errors.password}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="confirmPassword" 
            className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.confirmPassword 
                ? 'border-[var(--color-danger-300)] focus:ring-[var(--color-danger-200)]' 
                : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary-200)]'
            }`}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-[var(--color-danger-500)]">{errors.confirmPassword}</p>
          )}
        </div>
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mb-4"
        >
          Create Account
        </Button>
        
        <p className="text-center text-sm text-[var(--color-neutral-600)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;