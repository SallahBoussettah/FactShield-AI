// Authentication related types

export interface User {
  id: string;
  name: string;
  email: string;
  roles?: string[]; // User roles for role-based access control
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  tokenExpiry?: number; // Timestamp when the token expires
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  authState: AuthState;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  clearErrors: () => void;
  refreshToken: () => Promise<any>; // Added method to manually refresh token
  hasRole: (role: string | string[]) => boolean; // Check if user has specific role(s)
}