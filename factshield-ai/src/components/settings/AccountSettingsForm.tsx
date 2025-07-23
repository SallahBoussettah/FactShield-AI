import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AccountSettingsForm: React.FC = () => {
  const { authState } = useAuth();
  const user = authState.user;
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    // Validate password fields only if user is trying to change password
    if (formData.newPassword || formData.confirmPassword) {
      // Current password is required when changing password
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to set a new password';
        valid = false;
      }
      
      // New password requirements
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
        valid = false;
      }
      
      // Confirm password must match
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        valid = false;
      }
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccessMessage('Account settings updated successfully');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Error updating account settings:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="p-4 mb-4 text-sm text-[var(--color-secondary)] bg-[color-mix(in_srgb,var(--color-secondary),white_90%)] rounded-lg">
          {successMessage}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--color-neutral-700)]">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`
            mt-1 block w-full rounded-md border-[var(--color-neutral-300)] 
            shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]
            px-4 py-3 text-base
            ${formErrors.name ? 'border-[var(--color-danger)]' : ''}
          `}
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{formErrors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-neutral-700)]">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`
            mt-1 block w-full rounded-md border-[var(--color-neutral-300)] 
            shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]
            px-4 py-3 text-base
            ${formErrors.email ? 'border-[var(--color-danger)]' : ''}
          `}
        />
        {formErrors.email && (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{formErrors.email}</p>
        )}
      </div>
      
      <div className="border-t border-[var(--color-neutral-200)] pt-6">
        <h3 className="text-lg font-medium text-[var(--color-neutral-900)]">Change Password</h3>
        <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
          Leave blank if you don't want to change your password
        </p>
      </div>
      
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-[var(--color-neutral-700)]">
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className={`
            mt-1 block w-full rounded-md border-[var(--color-neutral-300)] 
            shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]
            px-4 py-3 text-base
            ${formErrors.currentPassword ? 'border-[var(--color-danger)]' : ''}
          `}
        />
        {formErrors.currentPassword && (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{formErrors.currentPassword}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--color-neutral-700)]">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className={`
            mt-1 block w-full rounded-md border-[var(--color-neutral-300)] 
            shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]
            px-4 py-3 text-base
            ${formErrors.newPassword ? 'border-[var(--color-danger)]' : ''}
          `}
        />
        {formErrors.newPassword && (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{formErrors.newPassword}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-neutral-700)]">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`
            mt-1 block w-full rounded-md border-[var(--color-neutral-300)] 
            shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]
            px-4 py-3 text-base
            ${formErrors.confirmPassword ? 'border-[var(--color-danger)]' : ''}
          `}
        />
        {formErrors.confirmPassword && (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{formErrors.confirmPassword}</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            px-6 py-3 bg-[var(--color-primary)] text-white rounded-md text-base
            hover:bg-[color-mix(in_srgb,var(--color-primary),black_10%)]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]
            ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
          `}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default AccountSettingsForm;