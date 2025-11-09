import { auth } from "@clerk/nextjs/server";
import { Effect } from "effect";
import { AuthError, ParseError, TokenError, UnauthorizedError } from "./errors";

/**
 * Parses the request body as JSON
 * @param request - The incoming HTTP request
 * @returns Effect that resolves to the parsed body or fails with ParseError
 */
export const parseRequestBody = <T>(request: Request) =>
  Effect.tryPromise({
    try: () => request.json() as Promise<T>,
    catch: (error) =>
      new ParseError({
        error,
        statusCode: 400,
        message: "Invalid request body",
      }),
  });

/**
 * Authenticates the current user using Clerk
 * @returns Effect that resolves to auth result or fails with AuthError
 */
export const authenticateUser = () =>
  Effect.tryPromise({
    try: () => auth(),
    catch: (error) =>
      new AuthError({
        error,
        statusCode: 500,
        message: "Authentication service error",
      }),
  });

/**
 * Gets the authentication token for the current user
 * @param getToken - Function to retrieve the token
 * @returns Effect that resolves to the token or fails with TokenError
 */
export const getAuthToken = (getToken: () => Promise<string | null>) =>
  Effect.tryPromise({
    try: () => getToken(),
    catch: (error) =>
      new TokenError({
        error,
        statusCode: 500,
        message: "Failed to retrieve authentication token",
      }),
  });

/**
 * Validates that the user is authorized (has both token and userId)
 * @param token - The authentication token
 * @param userId - The user ID
 * @returns Effect that succeeds with user data or fails with UnauthorizedError
 */
export const validateUserAuthorization = (
  token: string | null,
  userId: string | null,
) =>
  // TODO user authorization
  token && userId
    ? Effect.succeed({ token, userId })
    : Effect.fail(
        new UnauthorizedError({
          message: "User unauthorized to upload an image",
          statusCode: 401,
        }),
      );
