/**
 * Enhanced Logger Utility
 * Centralized logging with timestamps, structured format, and remote logging support
 */

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
  HTTP = "HTTP",
}

/**
 * Structured log entry interface
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  context?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

/**
 * Remote logger interface for custom implementations
 */
export interface RemoteLogger {
  log: (entry: LogEntry) => Promise<void> | void;
}

/**
 * Logger configuration
 */
class LoggerConfig {
  private static remoteLogger?: RemoteLogger;
  private static enableConsoleInProduction = false;
  private static logToRemoteInDevelopment = false;

  static setRemoteLogger(logger: RemoteLogger) {
    this.remoteLogger = logger;
  }

  static getRemoteLogger(): RemoteLogger | undefined {
    return this.remoteLogger;
  }

  static setConsoleInProduction(enable: boolean) {
    this.enableConsoleInProduction = enable;
  }

  static shouldLogToConsole(): boolean {
    return isDevelopment || this.enableConsoleInProduction;
  }

  static setRemoteInDevelopment(enable: boolean) {
    this.logToRemoteInDevelopment = enable;
  }

  static shouldLogToRemote(): boolean {
    return isProduction || this.logToRemoteInDevelopment;
  }
}

/**
 * Format timestamp in ISO 8601 format
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Get color for console output based on log level
 */
function getLogColor(level: LogLevel): string {
  const colors = {
    [LogLevel.ERROR]: "\x1b[31m", // Red
    [LogLevel.WARN]: "\x1b[33m", // Yellow
    [LogLevel.INFO]: "\x1b[36m", // Cyan
    [LogLevel.DEBUG]: "\x1b[35m", // Magenta
    [LogLevel.HTTP]: "\x1b[32m", // Green
  };
  return colors[level] || "\x1b[0m";
}

const resetColor = "\x1b[0m";

/**
 * Create structured log entry
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  data?: any,
  context?: string
): LogEntry {
  const entry: LogEntry = {
    level,
    message,
    timestamp: getTimestamp(),
    context,
  };

  if (data !== undefined) {
    entry.data = data;
  }

  // Add browser context if available
  if (typeof window !== "undefined") {
    entry.url = window.location.href;
    entry.userAgent = navigator.userAgent;
  }

  return entry;
}

/**
 * Log to console with formatting
 */
function logToConsole(entry: LogEntry) {
  if (!LoggerConfig.shouldLogToConsole()) return;

  const color = getLogColor(entry.level);
  const prefix = `${color}[${entry.level}]${resetColor}`;
  const timestamp = `\x1b[90m${entry.timestamp}${resetColor}`;
  const contextStr = entry.context
    ? `\x1b[90m[${entry.context}]${resetColor}`
    : "";

  const logMessage = `${timestamp} ${prefix} ${contextStr} ${entry.message}`;

  switch (entry.level) {
    case LogLevel.ERROR:
      console.error(logMessage, entry.data || "");
      break;
    case LogLevel.WARN:
      console.warn(logMessage, entry.data || "");
      break;
    case LogLevel.DEBUG:
      console.debug(logMessage, entry.data || "");
      break;
    default:
      console.log(logMessage, entry.data || "");
  }
}

/**
 * Send log to remote service
 */
async function logToRemote(entry: LogEntry) {
  if (!LoggerConfig.shouldLogToRemote()) return;

  const remoteLogger = LoggerConfig.getRemoteLogger();
  if (!remoteLogger) return;

  try {
    await remoteLogger.log(entry);
  } catch (error) {
    // Avoid infinite loop - don't log remote logging errors
    if (isDevelopment) {
      console.error("Failed to send log to remote service:", error);
    }
  }
}

/**
 * Main logging function
 */
function log(level: LogLevel, message: string, data?: any, context?: string) {
  const entry = createLogEntry(level, message, data, context);

  // Log to console
  logToConsole(entry);

  // Log to remote service
  logToRemote(entry);
}

/**
 * Enhanced Logger with structured logging
 */
export const logger = {
  /**
   * Log error messages
   */
  error: (message: string, data?: any, context?: string) => {
    log(LogLevel.ERROR, message, data, context);
  },

  /**
   * Log warning messages
   */
  warn: (message: string, data?: any, context?: string) => {
    log(LogLevel.WARN, message, data, context);
  },

  /**
   * Log info messages
   */
  info: (message: string, data?: any, context?: string) => {
    log(LogLevel.INFO, message, data, context);
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (message: string, data?: any, context?: string) => {
    if (isDevelopment) {
      log(LogLevel.DEBUG, message, data, context);
    }
  },

  /**
   * Log HTTP requests/responses
   */
  http: (message: string, data?: any, context?: string) => {
    log(LogLevel.HTTP, message, data, context);
  },

  /**
   * Configure logger
   */
  configure: (config: {
    remoteLogger?: RemoteLogger;
    consoleInProduction?: boolean;
    remoteInDevelopment?: boolean;
  }) => {
    if (config.remoteLogger) {
      LoggerConfig.setRemoteLogger(config.remoteLogger);
    }
    if (config.consoleInProduction !== undefined) {
      LoggerConfig.setConsoleInProduction(config.consoleInProduction);
    }
    if (config.remoteInDevelopment !== undefined) {
      LoggerConfig.setRemoteInDevelopment(config.remoteInDevelopment);
    }
  },
};
