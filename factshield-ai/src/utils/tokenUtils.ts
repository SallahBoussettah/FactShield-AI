// Utility functions for JWT token management

/**
 * Get the JWT token from local storage
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Set the JWT token in local storage
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Remove the JWT token from local storage
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Check if the JWT token is expired
 * @param token - The JWT token to check
 * @returns boolean - True if the token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Get the expiration time from the token
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    
    // Check if the token is expired
    return Date.now() >= exp;
  } catch (error) {
    // If there's an error parsing the token, assume it's expired
    return true;
  }
};

/**
 * Get the remaining time until the token expires (in milliseconds)
 * @param token - The JWT token to check
 * @returns number - The remaining time in milliseconds, or 0 if the token is expired
 */
export const getTokenRemainingTime = (token: string): number => {
  try {
    // Get the expiration time from the token
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    
    // Calculate the remaining time
    const remainingTime = exp - Date.now();
    
    // Return 0 if the token is expired, otherwise return the remaining time
    return remainingTime > 0 ? remainingTime : 0;
  } catch (error) {
    // If there's an error parsing the token, return 0
    return 0;
  }
};

/**
 * Get the user ID from the JWT token
 * @param token - The JWT token
 * @returns string | null - The user ID, or null if it couldn't be extracted
 */
export const getUserIdFromToken = (token: string): string | null => {
  try {
    // Get the user ID from the token
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  } catch (error) {
    // If there's an error parsing the token, return null
    return null;
  }
};