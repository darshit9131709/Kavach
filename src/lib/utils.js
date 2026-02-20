/**
 * Utility functions for Kavach platform
 * Common helper functions used across the application
 */

/**
 * Format error messages for API responses
 */
export function formatError(error) {
  if (error instanceof Error) {
    return {
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };
  }
  return { message: String(error) };
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate random string (useful for tokens, IDs, etc.)
 */
export function generateRandomString(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
