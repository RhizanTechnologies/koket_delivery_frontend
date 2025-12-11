/**
 * Remote Logger Examples
 * Demonstrates how to integrate with popular logging services
 */

import { RemoteLogger, LogEntry, LogLevel } from "./logger";

/**
 * Example: Send logs to a custom backend endpoint
 */
export class BackendLogger implements RemoteLogger {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async log(entry: LogEntry): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Silently fail to avoid infinite loops
      console.error("Failed to send log to backend:", error);
    }
  }
}

/**
 * Example: Send logs to console.log (for testing)
 */
export class ConsoleRemoteLogger implements RemoteLogger {
  log(entry: LogEntry): void {
    console.log("[REMOTE LOG]", entry);
  }
}

/**
 * Example: Buffer logs and send in batches
 */
export class BatchLogger implements RemoteLogger {
  private buffer: LogEntry[] = [];
  private batchSize: number;
  private endpoint: string;
  private flushInterval: number;
  private timerId?: NodeJS.Timeout;

  constructor(endpoint: string, batchSize = 10, flushInterval = 5000) {
    this.endpoint = endpoint;
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;

    // Auto-flush on interval
    this.timerId = setInterval(() => this.flush(), flushInterval);

    // Flush on page unload
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => this.flush());
    }
  }

  log(entry: LogEntry): void {
    this.buffer.push(entry);

    // Flush if buffer is full
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const logsToSend = [...this.buffer];
    this.buffer = [];

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logs: logsToSend }),
      });
    } catch (error) {
      // Silently fail
      console.error("Failed to flush logs:", error);
    }
  }

  destroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.flush();
  }
}

/**
 * Example: Filter logs by level before sending
 */
export class FilteredLogger implements RemoteLogger {
  private baseLogger: RemoteLogger;
  private allowedLevels: Set<LogLevel>;

  constructor(baseLogger: RemoteLogger, allowedLevels: LogLevel[]) {
    this.baseLogger = baseLogger;
    this.allowedLevels = new Set(allowedLevels);
  }

  log(entry: LogEntry): void {
    if (this.allowedLevels.has(entry.level)) {
      this.baseLogger.log(entry);
    }
  }
}

/**
 * Example: Sentry Integration (pseudo-code)
 * Install @sentry/browser and configure:
 *
 * import * as Sentry from "@sentry/browser";
 *
 * export class SentryLogger implements RemoteLogger {
 *   log(entry: LogEntry): void {
 *     if (entry.level === LogLevel.ERROR) {
 *       Sentry.captureException(new Error(entry.message), {
 *         level: "error",
 *         extra: entry.data,
 *         tags: {
 *           context: entry.context,
 *           url: entry.url,
 *         },
 *       });
 *     } else if (entry.level === LogLevel.WARN) {
 *       Sentry.captureMessage(entry.message, {
 *         level: "warning",
 *         extra: entry.data,
 *       });
 *     }
 *   }
 * }
 */

/**
 * Example: LogRocket Integration (pseudo-code)
 * Install logrocket and configure:
 *
 * import LogRocket from "logrocket";
 *
 * export class LogRocketLogger implements RemoteLogger {
 *   log(entry: LogEntry): void {
 *     if (entry.level === LogLevel.ERROR) {
 *       LogRocket.captureException(new Error(entry.message), {
 *         extra: entry.data,
 *         tags: { context: entry.context },
 *       });
 *     }
 *   }
 * }
 */

/**
 * Example: Datadog Integration (pseudo-code)
 * Install @datadog/browser-logs and configure:
 *
 * import { datadogLogs } from "@datadog/browser-logs";
 *
 * export class DatadogLogger implements RemoteLogger {
 *   log(entry: LogEntry): void {
 *     const logMethod = {
 *       [LogLevel.ERROR]: datadogLogs.logger.error,
 *       [LogLevel.WARN]: datadogLogs.logger.warn,
 *       [LogLevel.INFO]: datadogLogs.logger.info,
 *       [LogLevel.DEBUG]: datadogLogs.logger.debug,
 *       [LogLevel.HTTP]: datadogLogs.logger.info,
 *     }[entry.level];
 *
 *     logMethod(entry.message, entry.data, {
 *       context: entry.context,
 *       url: entry.url,
 *       timestamp: entry.timestamp,
 *     });
 *   }
 * }
 */

/**
 * Setup logger configuration
 * Call this in your app initialization (e.g., in layout.tsx or _app.tsx)
 */
export function setupRemoteLogging() {
  // Example: Only send errors and warnings to remote in production
  if (process.env.NODE_ENV === "production") {
    const remoteEndpoint = process.env.NEXT_PUBLIC_LOG_ENDPOINT;

    if (remoteEndpoint) {
      const baseLogger = new BatchLogger(remoteEndpoint, 20, 10000);
      const filteredLogger = new FilteredLogger(baseLogger, [
        LogLevel.ERROR,
        LogLevel.WARN,
      ]);

      return filteredLogger;
    }
  }

  // Development: no remote logging
  return undefined;
}
