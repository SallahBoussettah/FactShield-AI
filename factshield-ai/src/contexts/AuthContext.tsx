import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import type { 
  AuthState, 
  AuthContextType, 
  User, 
  LoginFormData, 
  RegisterFormData 
} from '../types/auth';
import * as authService from '../services/authService';
import { getTokenRemainingTime, isTokenExpired } from '../utils/tokenUtils';
import { 
  getAuthToken, 
  setAuthToken,
  getUserData,
  setUserData,
  clearAuthData
} from '../utils/secureStorage';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

// Action types
type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_SUCCESS' }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const refreshTimerRef = useRef<number | null>(null);

  // Function to refresh the token
  const refreshToken = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await authService.refreshToken();
      setAuthToken(response.token);
      setUserData(response.user);
      
      // Schedule the next token refresh
      scheduleTokenRefresh(response.token);
      
      return response;
    } catch {
      // Clear authentication on refresh failure
      clearAuthData();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // Function to schedule token refresh
  const scheduleTokenRefresh = useCallback((token: string) => {
    // Clear any existing refresh timer
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    // Get time until token expiration (with 1-minute buffer)
    const timeUntilExpiry = getTokenRemainingTime(token);
    
    // If token is valid and not expired
    if (timeUntilExpiry > 0) {
      // Refresh when token is at 90% of its lifetime or 5 minutes before expiry, whichever is sooner
      const refreshTime = Math.min(timeUntilExpiry * 0.9, timeUntilExpiry - 5 * 60 * 1000);
      
      // Schedule refresh (minimum 10 seconds to avoid immediate refresh)
      const refreshDelay = Math.max(refreshTime, 10 * 1000);
      
      refreshTimerRef.current = window.setTimeout(() => {
        refreshToken();
      }, refreshDelay);
    }
  }, [refreshToken]);

  // Check if user is already logged in on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getAuthToken();
        const user = getUserData();
        
        if (!token || !user) {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
        
        // Check if token is expired
        if (isTokenExpired(token)) {
          // Try to refresh the token
          try {
            const response = await refreshToken();
            if (response) {
              dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
            } else {
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          } catch (error) {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          // Token is still valid
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          
          // Schedule token refresh
          scheduleTokenRefresh(token);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUser();
    
    // Cleanup function to clear the refresh timer
    return () => {
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
      }
    };
  }, [refreshToken, scheduleTokenRefresh]);

  // Login function
  const login = async (formData: LoginFormData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login(formData);
      
      // Store authentication data securely
      setAuthToken(response.token);
      setUserData(response.user);
      
      // Schedule token refresh
      scheduleTokenRefresh(response.token);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
      throw error;
    }
  };

  // Register function
  const register = async (formData: RegisterFormData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { confirmPassword: _, ...registerData } = formData;
      await authService.register(registerData);
      
      dispatch({ type: 'REGISTER_SUCCESS' });
    } catch (error) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear authentication data securely
      clearAuthData();
      
      // Clear any scheduled token refresh
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  // Check if user has specific role(s)
  const hasRole = (role: string | string[]): boolean => {
    // If user is not authenticated or has no roles, return false
    if (!state.isAuthenticated || !state.user || !state.user.roles) {
      return false;
    }

    // If checking for multiple roles (any match)
    if (Array.isArray(role)) {
      return role.some(r => state.user?.roles?.includes(r));
    }
    
    // Check for a single role
    return state.user.roles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        authState: state,
        login,
        register,
        logout,
        forgotPassword,
        clearErrors,
        refreshToken,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};