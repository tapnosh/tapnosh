import { Data } from "effect";

/**
 * Error thrown when configuration is missing
 */
export class ConfigError extends Data.TaggedError("ConfigError")<{
  readonly message: string;
  readonly statusCode: 500;
}> {}
