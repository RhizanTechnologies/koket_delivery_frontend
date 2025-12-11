/**
 * Utility functions for handling and displaying user-friendly error messages
 */

import { logger } from "./logger";

/**
 * Standardized API Error Response Format
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]> | string[];
  timestamp?: string;
  path?: string;
}

/**
 * API Error Interface
 */
interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
      errors?: Record<string, string[]> | string[];
      statusCode?: number;
    };
    status?: number;
  };
  message?: string;
}

/**
 * Custom Application Error Class
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Convert backend error responses to user-friendly messages
 * @param error - The error object from the API call
 * @param fallbackMessage - Default message if no specific error found
 * @returns User-friendly error message
 */
export function getErrorMessage(
  error: any,
  fallbackMessage: string = "Something went wrong. Please try again."
): string {
  // Handle null or undefined
  if (!error) {
    return fallbackMessage;
  }

  // If error is already a string
  if (typeof error === "string") {
    return error;
  }

  const apiError = error as ApiError;

  // Extract message from response.data
  if (apiError.response?.data) {
    const data = apiError.response.data;

    // Check for specific error message
    if (data.message) {
      return formatErrorMessage(data.message);
    }

    // Check for error field
    if (data.error) {
      return formatErrorMessage(data.error);
    }

    // Check for validation errors (array or object)
    if (data.errors) {
      if (Array.isArray(data.errors)) {
        return data.errors.join(", ");
      } else if (typeof data.errors === "object") {
        const errorMessages = Object.entries(data.errors)
          .map(([field, messages]) => {
            const fieldName = field
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
            return `${fieldName}: ${
              Array.isArray(messages) ? messages.join(", ") : messages
            }`;
          })
          .join("; ");
        return errorMessages;
      }
    }

    // Check for status code specific messages
    const statusCode = data.statusCode || apiError.response.status;
    if (statusCode) {
      return getStatusCodeMessage(statusCode);
    }
  }

  // Check for general error message
  if (apiError.message) {
    return formatErrorMessage(apiError.message);
  }

  return fallbackMessage;
}

/**
 * Format error message to be more user-friendly
 */
function formatErrorMessage(message: string): string {
  // Replace technical terms with user-friendly alternatives
  const replacements: Record<string, string> = {
    "401": "Please log in to continue",
    "403": "You don't have permission to perform this action",
    "404": "The requested resource was not found",
    "500": "Server error. Please try again later",
    "Network Error": "Connection problem. Please check your internet",
    timeout: "Request timed out. Please try again",
    ECONNREFUSED: "Unable to connect to server",
    "validation failed": "Please check your input and try again",
    "invalid token": "Your session has expired. Please log in again",
    "token expired": "Your session has expired. Please log in again",
    unauthorized: "Please log in to continue",
    forbidden: "You don't have permission to perform this action",
  };

  let formattedMessage = message;

  // Check each replacement
  for (const [key, value] of Object.entries(replacements)) {
    if (formattedMessage.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Capitalize first letter
  formattedMessage =
    formattedMessage.charAt(0).toUpperCase() + formattedMessage.slice(1);

  // Add period if missing
  if (!formattedMessage.endsWith(".") && !formattedMessage.endsWith("!")) {
    formattedMessage += ".";
  }

  return formattedMessage;
}

/**
 * Get user-friendly message based on HTTP status code
 */
function getStatusCodeMessage(statusCode: number): string {
  const statusMessages: Record<number, string> = {
    400: "Invalid request. Please check your input.",
    401: "Please log in to continue.",
    403: "You don't have permission to access this resource.",
    404: "The requested resource was not found.",
    408: "Request timed out. Please try again.",
    409: "This action conflicts with existing data.",
    422: "Please check your input and try again.",
    429: "Too many requests. Please wait a moment.",
    500: "Server error. Please try again later.",
    502: "Server is temporarily unavailable.",
    503: "Service temporarily unavailable. Please try again later.",
    504: "Request timed out. Please try again.",
  };

  return statusMessages[statusCode] || "An error occurred. Please try again.";
}

/**
 * Success message formatter for consistent messaging
 */
export function getSuccessMessage(
  action: string,
  resourceName?: string
): string {
  const actions: Record<string, string> = {
    create: "created successfully",
    add: "added successfully",
    update: "updated successfully",
    edit: "updated successfully",
    delete: "deleted successfully",
    remove: "removed successfully",
    submit: "submitted successfully",
    save: "saved successfully",
    send: "sent successfully",
    upload: "uploaded successfully",
  };

  const actionText = actions[action.toLowerCase()] || "completed successfully";
  const resource = resourceName ? `${resourceName} ` : "";

  return `${resource.charAt(0).toUpperCase()}${resource.slice(
    1
  )}${actionText}!`;
}

/**
 * Create standardized API error response
 */
export function createApiErrorResponse(
  message: string,
  statusCode: number = 500,
  errors?: Record<string, string[]> | string[]
): ApiErrorResponse {
  return {
    success: false,
    message: formatErrorMessage(message),
    statusCode,
    errors,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Handle and log errors consistently
 */
export function handleError(
  error: unknown,
  context: string,
  fallbackMessage?: string
): string {
  const errorMessage = getErrorMessage(error, fallbackMessage);

  logger.error(`${context}:`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  return errorMessage;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error?.message?.toLowerCase().includes("network") ||
    error?.message?.toLowerCase().includes("fetch") ||
    error?.code === "ECONNREFUSED" ||
    error?.code === "ENOTFOUND" ||
    !error?.response
  );
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  const statusCode = error?.response?.status || error?.statusCode;
  return statusCode === 401 || statusCode === 403;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: any): boolean {
  const statusCode = error?.response?.status || error?.statusCode;
  return statusCode === 400 || statusCode === 422;
}

/**
 * Retry logic for failed requests
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error && typeof error === "object" && "response" in error) {
        const status = (error as any).response?.status;
        if (status && status >= 400 && status < 500) {
          throw error;
        }
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }

  throw lastError;
}
