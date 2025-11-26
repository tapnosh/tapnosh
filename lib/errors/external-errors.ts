import { Data } from "effect";

/**
 * Error thrown when Google Maps API request fails
 */
export class GoogleMapsError extends Data.TaggedError("GoogleMapsError")<{
  readonly error: unknown;
  readonly statusCode: number;
  readonly message: string;
}> {}
