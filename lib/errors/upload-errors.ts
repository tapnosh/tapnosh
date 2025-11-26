import { Data } from "effect";

/**
 * Error thrown when image upload fails
 */
export class UploadError extends Data.TaggedError("UploadError")<{
  readonly error: unknown;
  readonly statusCode: 400;
  readonly message: "Failed to upload image";
}> {}
