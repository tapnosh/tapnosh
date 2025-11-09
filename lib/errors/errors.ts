import { Data } from "effect";

/**
 * Error thrown when request body parsing fails
 */
export class ParseError extends Data.TaggedError("ParseError")<{
  readonly error: unknown;
  readonly statusCode: 400;
  readonly message: "Invalid request body";
}> {}

/**
 * Error thrown when authentication service fails
 */
export class AuthError extends Data.TaggedError("AuthError")<{
  readonly error: unknown;
  readonly statusCode: 500;
  readonly message: "Authentication service error";
}> {}

/**
 * Error thrown when token retrieval fails
 */
export class TokenError extends Data.TaggedError("TokenError")<{
  readonly error: unknown;
  readonly statusCode: 500;
  readonly message: "Failed to retrieve authentication token";
}> {}

/**
 * Error thrown when user is not authorized
 */
export class UnauthorizedError extends Data.TaggedError("UnauthorizedError")<{
  readonly message: string;
  readonly statusCode: 401;
}> {}

/**
 * Error thrown when image upload fails
 */
export class UploadError extends Data.TaggedError("UploadError")<{
  readonly error: unknown;
  readonly statusCode: 400;
  readonly message: "Failed to upload image";
}> {}

/**
 * Union type of all API errors
 */
export type ApiError =
  | ParseError
  | AuthError
  | TokenError
  | UnauthorizedError
  | UploadError;
