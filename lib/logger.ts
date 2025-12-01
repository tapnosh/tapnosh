import pino from "pino";

/**
 * Base logger configuration and utility
 *
 * Configuration:
 * - Set LOG_LEVEL environment variable to control logging level (trace, debug, info, warn, error, fatal)
 * - In development: pretty-printed colored logs with timestamps
 * - In production: JSON-formatted logs for structured logging
 *
 * Usage:
 * Create module-specific loggers in their respective directories:
 * ```typescript
 * import { createLogger } from "@/lib/logger";
 *
 * export const myModuleLogger = createLogger("my-module");
 *
 * myModuleLogger.info({ count: 10 }, "Processing items");
 * ```
 */

/**
 * Creates a child logger with the specified module name
 */
export const createLogger = (module: string) =>
  pino({
    level: "info",
    browser: {
      asObject: true,
    },
    ...(process.env.NODE_ENV === "development" && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    }),
  }).child({ module });

/**
 * Default base logger (use createLogger for module-specific loggers)
 */
const logger = createLogger("app");

export default logger;
