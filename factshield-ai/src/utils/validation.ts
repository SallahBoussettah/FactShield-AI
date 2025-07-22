// Form validation utilities

/**
 * Validates an email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 */
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates that two passwords match
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validates that a name is not empty
 */
export const validateName = (name: string): boolean => {
  return name.trim().length > 0;
};

/**
 * Get validation error message for email
 */
export const getEmailError = (email: string): string => {
  if (!email) return 'Email is required';
  if (!validateEmail(email)) return 'Please enter a valid email address';
  return '';
};

/**
 * Get validation error message for password
 */
export const getPasswordError = (password: string): string => {
  if (!password) return 'Password is required';
  if (!validatePassword(password)) {
    return 'Password must be at least 8 characters and contain uppercase, lowercase, and numbers';
  }
  return '';
};

/**
 * Get validation error message for confirm password
 */
export const getConfirmPasswordError = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) return 'Please confirm your password';
  if (!passwordsMatch(password, confirmPassword)) return 'Passwords do not match';
  return '';
};

/**
 * Get validation error message for name
 */
export const getNameError = (name: string): string => {
  if (!validateName(name)) return 'Name is required';
  return '';
};