import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

/**
 * A component that restricts access based on user roles
 * Only renders children if the user has at least one of the allowed roles
 * Otherwise redirects to the fallback path or renders nothing
 */
const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/dashboard'
}) => {
  const { authState, hasRole } = useAuth();
  const { isAuthenticated, loading } = authState;

  // Show nothing while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has any of the allowed roles
  const hasAccess = hasRole(allowedRoles);

  // If no access, redirect to fallback path
  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  // User has access, render children
  return <>{children}</>;
};

export default RoleBasedAccess;