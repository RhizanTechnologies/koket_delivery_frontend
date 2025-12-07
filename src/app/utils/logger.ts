/**
 * Logger Utility
 * Centralized logging that can be disabled in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log error messages (only in development)
   */
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },

  /**
   * Log warning messages (only in development)
   */
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },

  /**
   * Log info messages (only in development)
   */
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  },
};
