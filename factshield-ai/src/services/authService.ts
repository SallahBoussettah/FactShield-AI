// Authentication service for FactShield AI
// Handles API calls related to user authentication

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    roles?: string[]; // Added roles for role-based access control
  };
  token: string;
  expiresAt?: number; // Optional timestamp when the token expires
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const { post } = await import('./apiClient');
    
    const response = await post<{
      success: boolean;
      data: AuthResponse;
      message: string;
    }>('/auth/register', data);

    return response.data;
  } catch (error) {
    
    // Check if this is a network/connection error (backend not available)
    if (error instanceof Error && (
      error.message.includes('Unable to connect to server') ||
      error.message.includes('fetch') || 
      error.message.includes('NetworkError') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('ERR_CONNECTION_REFUSED') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('TypeError')
    )) {
      console.warn('Backend not available, using mock authentication for development');
      
      // Fallback to mock authentication for development
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock response with roles and token expiration
      return {
        user: {
          id: 'user-' + Date.now(),
          name: data.name,
          email: data.email,
          roles: ['user'] // Default role for new users
        },
        token: 'mock-jwt-token-' + Date.now(),
        expiresAt: Date.now() + 3600000 // Token expires in 1 hour
      };
    }
    
    // Re-throw the error with a more user-friendly message if it's an API error
    if (error instanceof Error) {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
    
    throw new Error('Registration failed. Please try again.');
  }
};

/**
 * Log in a user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const { post } = await import('./apiClient');
    const response = await post<{
      success: boolean;
      data: AuthResponse;
      message: string;
    }>('/auth/login', data);

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    
    // Check if this is a network error (backend not available)
    if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('NetworkError'))) {
      console.warn('Backend not available, using mock authentication for development');
      
      // Fallback to mock authentication for development
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock validation - allow demo, user, and admin emails
      const validEmails = ['demo@factshield.ai', 'user@example.com', 'admin@factshield.ai'];
      if (!validEmails.includes(data.email)) {
        throw new Error('Invalid email or password');
      }

      // Determine user roles based on email (for demo purposes)
      const roles = data.email === 'admin@factshield.ai'
        ? ['user', 'admin']
        : ['user'];

      // Mock response with roles and token expiration
      return {
        user: {
          id: 'user-123',
          name: 'Demo User',
          email: data.email,
          roles
        },
        token: 'mock-jwt-token-' + Date.now(),
        expiresAt: Date.now() + 3600000 // Token expires in 1 hour
      };
    }
    
    throw error;
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const { post } = await import('./apiClient');
    await post<{
      success: boolean;
      message: string;
    }>('/auth/forgot-password', { email });
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    const { post } = await import('./apiClient');
    await post<{
      success: boolean;
      message: string;
    }>('/auth/logout', {});
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear auth data on error
    import('../utils/secureStorage').then(({ clearAuthData }) => {
      clearAuthData();
    });
  }
};

/**
 * Refresh the JWT token
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const { post } = await import('./apiClient');
    const response = await post<{
      success: boolean;
      data: AuthResponse;
      message: string;
    }>('/auth/refresh', {});

    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};