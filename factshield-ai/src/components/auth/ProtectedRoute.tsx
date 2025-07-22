import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: string | string[]; // Optional role-based access control
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login',
  requiredRole
}) => {
  const { authState } = useAuth();
  const location = useLocation();

  // Check if the user has the required role(s)
  const hasRequiredRole = (): boolean => {
    // If no specific role is required, just check if authenticated
    if (!requiredRole) return true;
    
    // For future implementation: check user roles against required roles
    // This is a placeholder for when role-based access control is implemented
    // For now, we'll just return true if the user is authenticated
    return true;
  };

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
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If authenticated but doesn't have required role, show unauthorized message
  // This is for future role-based access control implementation
  if (!hasRequiredRole()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p className="mb-6 text-center">
          You don't have permission to access this page.
        </p>
        <a 
          href="/"
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[color-mix(in_srgb,var(--color-primary),black_10%)]"
        >
          Go Home
        </a>
      </div>
    );
  }

  // User is authenticated and has required role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;