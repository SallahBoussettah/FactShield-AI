// API client with authentication interceptors

import { isTokenExpired } from '../utils/tokenUtils';
import { getAuthToken, clearAuthData } from '../utils/secureStorage';
// Base API URL - configured from environment variables
const API_URL = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 'http://localhost:3001/api';

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
    // Clear expired token instead of trying to refresh to avoid circular dependency
    clearAuthData();
    token = null;
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
    // Try to get the specific error message from the response
    try {
      const errorData = await response.json();
      // Only clear auth data if this is a token-related error, not login credentials
      if (token && (errorData.message?.includes('token') || errorData.message?.includes('expired'))) {
        clearAuthData();
      }
      // Throw the specific error message from the backend
      throw new Error(errorData.message || 'Authentication failed. Please check your credentials.');
    } catch (parseError) {
      // If we can't parse the response, fall back to generic message
      if (token) {
        clearAuthData();
      }
      throw new Error('Authentication failed. Please check your credentials.');
    }
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
  try {
    const response = await authenticatedFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle validation errors
      if (response.status === 400 && errorData.errors) {
        const validationErrors = errorData.errors.map((err: any) => err.msg).join(', ');
        throw new Error(validationErrors);
      }

      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    throw error;
  }
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