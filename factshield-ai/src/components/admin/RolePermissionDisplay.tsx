import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Define available roles and their descriptions
const roleDefinitions = {
  admin: {
    name: 'Administrator',
    description: 'Full access to all system features and settings',
    permissions: [
      'Manage users and roles',
      'Access all content moderation tools',
      'Configure system settings',
      'View all analytics data',
      'Manage AI model configurations'
    ]
  },
  editor: {
    name: 'Content Editor',
    description: 'Can review and moderate content',
    permissions: [
      'Review flagged content',
      'Approve or reject content',
      'View content analytics',
      'Access content moderation tools'
    ]
  },
  analyst: {
    name: 'Analyst',
    description: 'Can view and analyze system data',
    permissions: [
      'View analytics dashboards',
      'Export reports',
      'View content trends',
      'Access historical data'
    ]
  },
  user: {
    name: 'Standard User',
    description: 'Basic access to platform features',
    permissions: [
      'Submit content for analysis',
      'View personal history',
      'Access personal analytics',
      'Manage account settings'
    ]
  }
};

interface RolePermissionDisplayProps {
  showAllRoles?: boolean;
  compact?: boolean;
}

/**
 * Component to display role information and permissions
 * Can show all roles or just the current user's roles
 */
const RolePermissionDisplay: React.FC<RolePermissionDisplayProps> = ({
  showAllRoles = false,
  compact = false
}) => {
  const { authState } = useAuth();
  const { user } = authState;
  
  // Determine which roles to display
  const rolesToDisplay = showAllRoles 
    ? Object.keys(roleDefinitions) 
    : user?.roles || [];

  if (rolesToDisplay.length === 0) {
    return <p className="text-[var(--color-neutral-500)]">No roles assigned</p>;
  }

  return (
    <div className="space-y-4">
      {rolesToDisplay.map(role => {
        const roleInfo = roleDefinitions[role as keyof typeof roleDefinitions];
        const isUserRole = user?.roles?.includes(role);
        
        // Skip if role definition not found
        if (!roleInfo) return null;
        
        return (
          <div 
            key={role}
            className={`
              rounded-lg border 
              ${isUserRole 
                ? 'border-[var(--color-primary-200)] bg-[var(--color-primary-50)]' 
                : 'border-[var(--color-neutral-200)] bg-white'
              }
              ${compact ? 'p-3' : 'p-4'}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${compact ? 'text-sm' : 'text-base'} text-[var(--color-neutral-900)]`}>
                  {roleInfo.name}
                  {isUserRole && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                      Current
                    </span>
                  )}
                </h3>
                {!compact && (
                  <p className="text-sm text-[var(--color-neutral-600)] mt-1">
                    {roleInfo.description}
                  </p>
                )}
              </div>
            </div>
            
            {!compact && (
              <div className="mt-3">
                <h4 className="text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider mb-2">
                  Permissions
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                  {roleInfo.permissions.map((permission, index) => (
                    <li key={index} className="text-sm text-[var(--color-neutral-700)] flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RolePermissionDisplay;