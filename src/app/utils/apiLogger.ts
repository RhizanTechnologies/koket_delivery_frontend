/**
 * API Request/Response Logger
 * Logs all API calls with request and response details
 */

import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { logger } from "./logger";

/**
 * Request log data
 */
interface RequestLog {
  method: string;
  url: string;
  headers?: any;
  data?: any;
  params?: any;
}

/**
 * Response log data
 */
interface ResponseLog {
  status: number;
  statusText: string;
  data?: any;
  duration: number;
}

/**
 * Setup API request/response logging interceptors
 * @param axiosInstance - The Axios instance to add interceptors to
 */
export function setupApiLogger(axiosInstance: AxiosInstance) {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: any) => {
      // Store request start time
      config.metadata = { startTime: Date.now() };

      const requestLog: RequestLog = {
        method: config.method?.toUpperCase() || "UNKNOWN",
        url: config.url || "",
        params: config.params,
      };

      // Log request (excluding sensitive data)
      if (config.data && !isSensitiveRequest(config.url || "")) {
        requestLog.data = sanitizeData(config.data);
      }

      logger.http(
        `API Request: ${requestLog.method} ${requestLog.url}`,
        requestLog,
        "API"
      );

      return config;
    },
    (error: AxiosError) => {
      logger.error(
        "API Request Error",
        {
          message: error.message,
          config: error.config,
        },
        "API"
      );
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      const duration = calculateDuration(response.config);

      const responseLog: ResponseLog = {
        status: response.status,
        statusText: response.statusText,
        duration,
      };

      // Include response data for non-sensitive endpoints
      if (!isSensitiveRequest(response.config.url || "")) {
        responseLog.data = sanitizeData(response.data);
      }

      const logLevel = response.status >= 400 ? "warn" : "http";
      logger[logLevel](
        `API Response: ${
          response.status
        } ${response.config.method?.toUpperCase()} ${response.config.url}`,
        responseLog,
        "API"
      );

      return response;
    },
    (error: AxiosError) => {
      const duration = calculateDuration(error.config);
      const status = error.response?.status || 0;

      const errorLog = {
        status,
        statusText: error.response?.statusText || error.message,
        duration,
        message: error.message,
        data: error.response?.data,
      };

      logger.error(
        `API Error: ${status} ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`,
        errorLog,
        "API"
      );

      return Promise.reject(error);
    }
  );
}

/**
 * Calculate request duration
 */
function calculateDuration(config: any): number {
  if (config?.metadata?.startTime) {
    return Date.now() - config.metadata.startTime;
  }
  return 0;
}

/**
 * Check if request contains sensitive data
 */
function isSensitiveRequest(url: string): boolean {
  const sensitivePatterns = [
    /login/i,
    /signup/i,
    /register/i,
    /password/i,
    /auth/i,
    /token/i,
    /payment/i,
    /card/i,
  ];

  return sensitivePatterns.some((pattern) => pattern.test(url));
}

/**
 * Sanitize data to remove sensitive information
 */
function sanitizeData(data: any): any {
  if (!data) return data;

  // If it's a FormData object, don't log it directly
  if (data instanceof FormData) {
    return "[FormData]";
  }

  // If it's not an object, return as is
  if (typeof data !== "object") {
    return data;
  }

  // Create a copy to avoid modifying original
  const sanitized = Array.isArray(data) ? [...data] : { ...data };

  // List of sensitive keys to redact
  const sensitiveKeys = [
    "password",
    "token",
    "accessToken",
    "refreshToken",
    "secret",
    "apiKey",
    "authorization",
    "cardNumber",
    "cvv",
    "pin",
  ];

  // Recursively sanitize object
  Object.keys(sanitized).forEach((key) => {
    if (
      sensitiveKeys.some((sensitive) =>
        key.toLowerCase().includes(sensitive.toLowerCase())
      )
    ) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });

  return sanitized;
}

/**
 * Log API call manually (for non-intercepted calls)
 */
export function logApiCall(
  method: string,
  url: string,
  data?: any,
  response?: any,
  error?: any
) {
  if (error) {
    logger.error(
      `Manual API Error: ${method} ${url}`,
      {
        data: sanitizeData(data),
        error: error.message,
        response: error.response?.data,
      },
      "API"
    );
  } else {
    logger.http(
      `Manual API Call: ${method} ${url}`,
      {
        data: sanitizeData(data),
        response: sanitizeData(response),
      },
      "API"
    );
  }
}
