/**
 * Secure storage utility for sensitive data like authentication tokens
 * Uses encryption when available and falls back to localStorage
 */

// Simple encryption key (in a real app, this would be more secure)
const ENCRYPTION_KEY = 'factshield-secure-storage-key';

/**
 * Encrypt a string value
 * This is a simple implementation for demo purposes
 * In a production app, use a proper encryption library
 */
const encrypt = (value: string): string => {
  try {
    // Simple XOR encryption for demo purposes
    // In a real app, use a proper encryption library
    return Array.from(value)
      .map(char => 
        String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(0))
      )
      .join('');
  } catch (error) {
    console.error('Encryption error:', error);
    return value;
  }
};

/**
 * Decrypt a string value
 * This is a simple implementation for demo purposes
 * In a production app, use a proper encryption library
 */
const decrypt = (value: string): string => {
  try {
    // Simple XOR decryption (same as encryption with XOR)
    return Array.from(value)
      .map(char => 
        String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(0))
      )
      .join('');
  } catch (error) {
    console.error('Decryption error:', error);
    return value;
  }
};

/**
 * Set an item in secure storage
 */
export const setSecureItem = (key: string, value: string): void => {
  try {
    const encryptedValue = encrypt(value);
    localStorage.setItem(key, encryptedValue);
  } catch (error) {
    console.error('Error setting secure item:', error);
    // Fallback to regular localStorage
    localStorage.setItem(key, value);
  }
};

/**
 * Get an item from secure storage
 */
export const getSecureItem = (key: string): string | null => {
  try {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null;
    
    return decrypt(encryptedValue);
  } catch (error) {
    console.error('Error getting secure item:', error);
    // Fallback to regular localStorage
    return localStorage.getItem(key);
  }
};

/**
 * Remove an item from secure storage
 */
export const removeSecureItem = (key: string): void => {
  localStorage.removeItem(key);
};

/**
 * Clear all items from secure storage
 */
export const clearSecureStorage = (): void => {
  localStorage.clear();
};

/**
 * Store authentication token securely
 */
export const setAuthToken = (token: string): void => {
  setSecureItem('token', token);
};

/**
 * Get authentication token from secure storage
 */
export const getAuthToken = (): string | null => {
  return getSecureItem('token');
};

/**
 * Remove authentication token from secure storage
 */
export const removeAuthToken = (): void => {
  removeSecureItem('token');
};

/**
 * Store user data securely
 */
export const setUserData = (userData: any): void => {
  setSecureItem('user', JSON.stringify(userData));
};

/**
 * Get user data from secure storage
 */
export const getUserData = (): any | null => {
  const userData = getSecureItem('user');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Remove user data from secure storage
 */
export const removeUserData = (): void => {
  removeSecureItem('user');
};

/**
 * Clear all authentication data from secure storage
 */
export const clearAuthData = (): void => {
  removeAuthToken();
  removeUserData();
};