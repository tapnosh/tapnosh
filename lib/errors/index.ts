// Re-export all errors for convenient importing
// Import all error types for the union type
import type { AuthError, TokenError, UnauthorizedError } from "./auth-errors";
import type { ConfigError } from "./config-errors";
import type { GoogleMapsError } from "./external-errors";
import type { UploadError } from "./upload-errors";
import type { ParseError, ValidationError } from "./validation-errors";

export * from "./auth-errors";
export * from "./validation-errors";
export * from "./upload-errors";
export * from "./external-errors";
export * from "./config-errors";

/**
 * Union type of all API errors
 */
export type ApiError =
  | ParseError
  | AuthError
  | TokenError
  | UnauthorizedError
  | UploadError
  | GoogleMapsError
  | ValidationError
  | ConfigError;
