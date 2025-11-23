import { Effect } from "effect";
import { type NextRequest, NextResponse } from "next/server";

import {
  fetchAddressPredictions,
  getGoogleMapsApiKey,
  validateInput,
} from "@/features/address/address-effects";
import {
  authenticateUser,
  getAuthToken,
  validateUserAuthorization,
} from "@/lib/auth/auth-effects";
import {
  AuthError,
  ConfigError,
  GoogleMapsError,
  TokenError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/errors/errors";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const program = Effect.gen(function* () {
    // Authenticate user
    const { getToken, userId } = yield* authenticateUser();
    const token = yield* getAuthToken(getToken);
    yield* validateUserAuthorization(token, userId);

    // Get and validate input parameter
    const searchParams = request.nextUrl.searchParams;
    const input = yield* validateInput(searchParams.get("input"));

    // Get API key
    const apiKey = yield* getGoogleMapsApiKey();

    // Fetch predictions
    const predictions = yield* fetchAddressPredictions(input, apiKey);

    return NextResponse.json({ predictions });
  }).pipe(
    Effect.catchAll((error) => {
      if (
        error instanceof UnauthorizedError ||
        error instanceof AuthError ||
        error instanceof TokenError ||
        error instanceof ValidationError ||
        error instanceof ConfigError ||
        error instanceof GoogleMapsError
      ) {
        return Effect.succeed(
          NextResponse.json(
            { error: error.message },
            { status: error.statusCode },
          ),
        );
      }

      return Effect.succeed(
        NextResponse.json({ error: "Unknown error" }, { status: 500 }),
      );
    }),
  );

  return Effect.runPromise(program);
}
