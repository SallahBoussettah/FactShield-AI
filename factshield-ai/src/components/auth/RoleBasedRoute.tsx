import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  roles: string[];
  redirectTo?: string;
}

/**
 * A component that restricts access to routes based on user roles
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  roles,
  redirectTo = '/unauthorized' 
}) => {
  const { authState, hasRole } = useAuth();

  // Show loading state while checking authentication
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but doesn't have required role, redirect to unauthorized page
  if (!hasRole(roles)) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is authenticated and has required role, render the protected content
  return <>{children}</>;
};

export default RoleBasedRoute;