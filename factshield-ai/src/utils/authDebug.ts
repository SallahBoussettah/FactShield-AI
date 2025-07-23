import { clearAuthData, getAuthToken, getUserData } from './secureStorage';

/**
 * Debug utility to check and clear authentication data
 */
export const debugAuth = () => {
  console.log('=== Auth Debug Info ===');
  console.log('Token:', getAuthToken());
  console.log('User:', getUserData());
  console.log('=====================');
};

/**
 * Clear all authentication data (useful for debugging)
 */
export const clearAllAuthData = () => {
  clearAuthData();
  localStorage.clear();
  sessionStorage.clear();
  console.log('All authentication data cleared');
};

/**
 * Check if we're in development mode and backend is available
 */
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/health');
    return response.ok;
  } catch (error) {
    console.warn('Backend not available:', error);
    return false;
  }
};