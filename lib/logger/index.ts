import pino from "pino";

/**
 * Base logger configuration and utility
 *
 * Configuration:
 * - Set LOG_LEVEL environment variable to control logging level (trace, debug, info, warn, error, fatal)
 * - In development: pretty-printed colored logs with timestamps
 * - In production: JSON-formatted logs for structured logging
 */

/**
 * Creates a child logger with the specified module name
 */
export const createLogger = (module: string) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  return pino({
    level: process.env.LOG_LEVEL || "info",
    browser: {
      asObject: true,
    },
    ...(isDevelopment && {
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
};

/**
 * Default base logger (use createLogger for module-specific loggers)
 */
const logger = createLogger("app");

export default logger;
