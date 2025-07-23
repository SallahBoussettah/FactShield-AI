import React, { useState, useEffect } from 'react';
import type { AdminUser } from './UserManagement';
import RoleManagement from './RoleManagement';
import RolePermissionDisplay from './RolePermissionDisplay';

interface UserDetailProps {
  user: AdminUser | null;
  isCreating: boolean;
  onUpdate: (user: AdminUser) => void;
  onCreate: (user: AdminUser) => void;
  onCancel: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({
  user,
  isCreating,
  onUpdate,
  onCreate,
  onCancel
}) => {
  // Form state
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    roles: ['user'],
    status: 'active'
  });

  // Form validation state
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  // Show permissions view toggle
  const [showPermissions, setShowPermissions] = useState(false);

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        roles: user.roles || ['user'],
        status: user.status
      });
      setErrors({});
    } else if (isCreating) {
      setFormData({
        name: '',
        email: '',
        roles: ['user'],
        status: 'active'
      });
      setErrors({});
    }
    setShowPermissions(false);
  }, [user, isCreating]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation errors when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle role changes
  const handleRoleChange = (roles: string[]) => {
    setFormData(prev => ({ ...prev, roles }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isCreating) {
      // Create new user
      onCreate({
        id: 'temp-id', // Will be replaced by the parent component
        name: formData.name!,
        email: formData.email!,
        roles: formData.roles || ['user'],
        status: formData.status as 'active' | 'inactive' | 'suspended',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '-'
      });
    } else if (user) {
      // Update existing user
      onUpdate({
        ...user,
        name: formData.name!,
        email: formData.email!,
        roles: formData.roles,
        status: formData.status as 'active' | 'inactive' | 'suspended'
      });
    }
  };

  // If no user is selected and not creating, show empty state
  if (!user && !isCreating) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-full bg-[var(--color-neutral-100)]">
          <svg className="w-8 h-8 text-[var(--color-neutral-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-[var(--color-neutral-900)]">No User Selected</h3>
        <p className="mt-2 text-sm text-[var(--color-neutral-500)]">
          Select a user from the list to view and edit their details, or click "Add User" to create a new user.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-neutral-200)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">
            {isCreating ? 'Create New User' : 'Edit User'}
          </h2>

          {!isCreating && (
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setShowPermissions(!showPermissions)}
                className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-600)] flex items-center"
              >
                {showPermissions ? 'Edit User' : 'View Permissions'}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPermissions ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {showPermissions && !isCreating ? (
        <div className="p-6 space-y-6">
          <h3 className="text-base font-medium text-[var(--color-neutral-900)] mb-4">
            Permissions for {user?.name}
          </h3>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-[var(--color-neutral-700)] mb-2">
              Assigned Roles
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.roles?.map(role => (
                <span
                  key={role}
                  className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium
                    ${role === 'admin'
                      ? 'bg-[var(--color-danger-100)] text-[var(--color-danger-800)]'
                      : role === 'editor'
                        ? 'bg-[var(--color-warning-100)] text-[var(--color-warning-800)]'
                        : role === 'analyst'
                          ? 'bg-[var(--color-info-100)] text-[var(--color-info-800)]'
                          : 'bg-[var(--color-primary-100)] text-[var(--color-primary-800)]'
                    }
                  `}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <RolePermissionDisplay showAllRoles={false} />

          <div className="flex justify-end pt-4 border-t border-[var(--color-neutral-200)]">
            <button
              type="button"
              onClick={() => setShowPermissions(false)}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-600)]"
            >
              Back to Edit
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--color-neutral-700)]">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              className={`mt-1 block w-full border rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--color-primary)] ${errors.name
                  ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]'
                  : 'border-[var(--color-neutral-300)] focus:border-[var(--color-primary)]'
                }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.name}</p>
            )}
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-neutral-700)]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
              className={`mt-1 block w-full border rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--color-primary)] ${errors.email
                  ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]'
                  : 'border-[var(--color-neutral-300)] focus:border-[var(--color-primary)]'
                }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.email}</p>
            )}
          </div>

          {/* Status field */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-[var(--color-neutral-700)]">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status || 'active'}
              onChange={handleChange}
              className="mt-1 block w-full border border-[var(--color-neutral-300)] rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <p className="mt-1 text-xs text-[var(--color-neutral-500)]">
              {formData.status === 'active'
                ? 'User can log in and access the system.'
                : formData.status === 'inactive'
                  ? 'User cannot log in but account is preserved.'
                  : 'User account is temporarily suspended.'}
            </p>
          </div>

          {/* Role management */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
              Roles
            </label>
            <RoleManagement
              selectedRoles={formData.roles || []}
              onChange={handleRoleChange}
            />
          </div>

          {/* Password reset section - only for existing users */}
          {!isCreating && user && (
            <div className="pt-4 border-t border-[var(--color-neutral-200)]">
              <h3 className="text-sm font-medium text-[var(--color-neutral-700)] mb-3">Password Management</h3>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-[var(--color-neutral-300)] rounded-lg text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Send Password Reset Link
              </button>
            </div>
          )}

          {/* User metadata - only show for existing users */}
          {!isCreating && user && (
            <div className="pt-4 border-t border-[var(--color-neutral-200)]">
              <h3 className="text-sm font-medium text-[var(--color-neutral-700)] mb-3">User Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[var(--color-neutral-500)]">User ID</p>
                  <p className="font-mono text-[var(--color-neutral-900)]">{user.id}</p>
                </div>
                <div>
                  <p className="text-[var(--color-neutral-500)]">Created</p>
                  <p className="text-[var(--color-neutral-900)]">{user.createdAt}</p>
                </div>
                <div>
                  <p className="text-[var(--color-neutral-500)]">Last Login</p>
                  <p className="text-[var(--color-neutral-900)]">{user.lastLogin}</p>
                </div>
                <div>
                  <p className="text-[var(--color-neutral-500)]">Account Status</p>
                  <p className={`font-medium 
                    ${formData.status === 'active'
                      ? 'text-[var(--color-success)]'
                      : formData.status === 'inactive'
                        ? 'text-[var(--color-neutral-500)]'
                        : 'text-[var(--color-warning)]'
                    }`}
                  >
                    {formData.status ? formData.status.charAt(0).toUpperCase() + formData.status.slice(1) : 'Active'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--color-neutral-200)]">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-[var(--color-neutral-300)] rounded-lg text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-600)]"
            >
              {isCreating ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserDetail;