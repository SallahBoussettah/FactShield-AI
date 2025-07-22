// API client with authentication interceptors

import { isTokenExpired } from '../utils/tokenUtils';
import * as authService from './authService';
import { getAuthToken, setAuthToken } from '../utils/secureStorage';

// Base API URL - should be configured from environment variables in a real app
const API_URL = '/api';

/**
 * Custom fetch function with authentication
 * - Automatically adds the authentication token to requests
 * - Handles token refresh if the token is expired
 * - Handles authentication errors
 */
export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Get the token from secure storage
  let token = getAuthToken();
  
  // Check if the token is expired and needs to be refreshed
  if (token && isTokenExpired(token)) {
    try {
      // Try to refresh the token
      const refreshResponse = await authService.refreshToken();
      token = refreshResponse.token;
      setAuthToken(token);
    } catch (error) {
      // If token refresh fails, clear the token and throw an error
      throw new Error('Authentication expired. Please log in again.');
    }
  }
  
  // Prepare headers with authentication token if available
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Make the request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  // Handle authentication errors
  if (response.status === 401) {
    // Clear authentication data using secure storage utilities
    import('../utils/secureStorage').then(({ clearAuthData }) => {
      clearAuthData();
    });
    
    // Throw an error to be handled by the calling code
    throw new Error('Authentication failed. Please log in again.');
  }
  
  return response;
};

/**
 * GET request with authentication
 */
export const get = async <T>(endpoint: string): Promise<T> => {
  const response = await authenticatedFetch(endpoint);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * POST request with authentication
 */
export const post = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await authenticatedFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * PUT request with authentication
 */
export const put = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await authenticatedFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * DELETE request with authentication
 */
export const del = async <T>(endpoint: string): Promise<T> => {
  const response = await authenticatedFetch(endpoint, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Upload file with authentication
 */
export const uploadFile = async <T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add any additional data to the form data
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }
  
  const response = await authenticatedFetch(endpoint, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  return await response.json();
};