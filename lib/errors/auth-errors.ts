import { Data } from "effect";

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
