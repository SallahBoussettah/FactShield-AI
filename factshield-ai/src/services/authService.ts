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
    // For development/demo purposes, simulate a successful response
    // In a real implementation, this would use the API client
    // return await post<AuthResponse>('/auth/register', data);

    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock response with roles and token expiration
    return {
      user: {
        id: 'user-123',
        name: data.name,
        email: data.email,
        roles: ['user'] // Default role for new users
      },
      token: 'mock-jwt-token',
      expiresAt: Date.now() + 3600000 // Token expires in 1 hour
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Log in a user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    // For development/demo purposes, simulate a successful response
    // In a real implementation, this would use the API client
    // return await post<AuthResponse>('/auth/login', data);

    // Simulate API call with a delay
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
      token: 'mock-jwt-token',
      expiresAt: Date.now() + 3600000 // Token expires in 1 hour
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    // For development/demo purposes, simulate a successful response
    // In a real implementation, this would use the API client
    // await post<void>('/auth/forgot-password', { email });

    // Note: email parameter is intentionally unused in this mock implementation
    console.log('Password reset requested for:', email);
    // but would be used in a real implementation to send the reset link

    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // No return value needed for this endpoint
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
    // For development/demo purposes, simulate a successful response
    // In a real implementation, this would use the API client
    // await post<void>('/auth/logout', {});

    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Clear auth data using secure storage utilities
    import('../utils/secureStorage').then(({ clearAuthData }) => {
      clearAuthData();
    });
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
    // For development/demo purposes, simulate a successful response
    // In a real implementation, this would use the API client
    // return await post<AuthResponse>('/auth/refresh', {});

    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get the current user from secure storage
    const user = await import('../utils/secureStorage').then(({ getUserData }) => {
      const userData = getUserData();
      if (!userData) {
        throw new Error('No user found');
      }
      return userData;
    });

    // Ensure user has roles (for backward compatibility)
    if (!user.roles) {
      user.roles = ['user'];
    }

    // Mock response with token expiration
    return {
      user,
      token: 'refreshed-mock-jwt-token',
      expiresAt: Date.now() + 3600000 // Token expires in 1 hour
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};