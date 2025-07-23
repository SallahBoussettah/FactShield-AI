import React from 'react';

interface RoleManagementProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
}

/**
 * Component for managing user roles
 * Allows selecting and deselecting roles with visual indicators
 */
const RoleManagement: React.FC<RoleManagementProps> = ({
  selectedRoles,
  onChange
}) => {
  // Available roles with their display properties
  const availableRoles = [
    { 
      id: 'admin', 
      name: 'Administrator', 
      description: 'Full access to all system features',
      bgColor: 'bg-[var(--color-danger-100)]',
      textColor: 'text-[var(--color-danger-800)]',
      borderColor: 'border-[var(--color-danger-200)]'
    },
    { 
      id: 'editor', 
      name: 'Content Editor', 
      description: 'Can review and moderate content',
      bgColor: 'bg-[var(--color-warning-100)]',
      textColor: 'text-[var(--color-warning-800)]',
      borderColor: 'border-[var(--color-warning-200)]'
    },
    { 
      id: 'analyst', 
      name: 'Analyst', 
      description: 'Can view and analyze system data',
      bgColor: 'bg-[var(--color-info-100)]',
      textColor: 'text-[var(--color-info-800)]',
      borderColor: 'border-[var(--color-info-200)]'
    },
    { 
      id: 'user', 
      name: 'User', 
      description: 'Basic access to platform features',
      bgColor: 'bg-[var(--color-primary-100)]',
      textColor: 'text-[var(--color-primary-800)]',
      borderColor: 'border-[var(--color-primary-200)]'
    }
  ];

  // Toggle role selection
  const toggleRole = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      // Don't allow removing the last role
      if (selectedRoles.length === 1) {
        return;
      }
      onChange(selectedRoles.filter(id => id !== roleId));
    } else {
      onChange([...selectedRoles, roleId]);
    }
  };

  return (
    <div className="space-y-3">
      {availableRoles.map(role => {
        const isSelected = selectedRoles.includes(role.id);
        
        return (
          <div 
            key={role.id}
            onClick={() => toggleRole(role.id)}
            className={`
              p-3 rounded-lg border cursor-pointer transition-all
              ${isSelected 
                ? `${role.bgColor} ${role.borderColor}` 
                : 'bg-white border-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-50)]'
              }
            `}
          >
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className={`text-sm font-medium ${isSelected ? role.textColor : 'text-[var(--color-neutral-900)]'}`}>
                    {role.name}
                  </h3>
                  {role.id === 'admin' && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[var(--color-danger-100)] text-[var(--color-danger-800)]">
                      Restricted
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 ${isSelected ? role.textColor : 'text-[var(--color-neutral-500)]'}`}>
                  {role.description}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <div className={`
                  w-5 h-5 rounded-full border flex items-center justify-center
                  ${isSelected 
                    ? `${role.bgColor} border-2 ${role.borderColor}` 
                    : 'border-[var(--color-neutral-300)]'
                  }
                `}>
                  {isSelected && (
                    <svg className={`w-3 h-3 ${role.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Role selection hint */}
      <p className="text-xs text-[var(--color-neutral-500)] mt-2">
        Click on a role to toggle selection. Users must have at least one role.
      </p>
    </div>
  );
};

export default RoleManagement;