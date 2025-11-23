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
 * Error thrown when required parameter is missing
 */
export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string;
  readonly statusCode: 400;
}> {}
