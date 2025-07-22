import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfileSection: React.FC = () => {
  const { authState, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!authState.user) {
    return null;
  }

  return (
    <div className="relative p-4" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-full flex items-center p-3 text-sm rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-medium">
          {getInitials(authState.user.name)}
        </div>
        
        {/* User info */}
        <div className="ml-3 flex-1 text-left">
          <p className="font-medium text-[var(--color-neutral-900)] truncate">
            {authState.user.name}
          </p>
          <p className="text-xs text-[var(--color-neutral-500)] truncate">
            {authState.user.email}
          </p>
        </div>
        
        {/* Dropdown arrow */}
        <svg 
          className={`w-4 h-4 text-[var(--color-neutral-400)] transition-transform ${
            dropdownOpen ? 'rotate-180' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-[var(--color-neutral-200)] py-2 z-50">
          <div className="px-4 py-2 border-b border-[var(--color-neutral-200)]">
            <p className="text-sm font-medium text-[var(--color-neutral-900)]">
              {authState.user.name}
            </p>
            <p className="text-xs text-[var(--color-neutral-500)]">
              {authState.user.email}
            </p>
            {authState.user.roles && authState.user.roles.length > 0 && (
              <div className="mt-1">
                {authState.user.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-block px-2 py-1 text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full mr-1"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="py-1">
            <button
              onClick={() => {
                setDropdownOpen(false);
                // Navigate to profile settings when implemented
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Settings
            </button>
            
            <button
              onClick={() => {
                setDropdownOpen(false);
                // Navigate to account settings when implemented
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Account Settings
            </button>
            
            <div className="border-t border-[var(--color-neutral-200)] mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileSection;