import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LocationState {
  from?: string;
}

/**
 * Hook to handle authentication redirects
 * - Redirects authenticated users away from auth pages
 * - Can be used on login/register pages
 * 
 * @param redirectTo - Where to redirect authenticated users (default: '/dashboard')
 * @returns void
 */
export const useAuthRedirect = (redirectTo: string = '/dashboard'): void => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as LocationState | null;
  const from = state?.from || redirectTo;

  useEffect(() => {
    // If user is authenticated and not loading, redirect them
    if (authState.isAuthenticated && !authState.loading) {
      navigate(from, { replace: true });
    }
  }, [authState.isAuthenticated, authState.loading, navigate, from]);
};