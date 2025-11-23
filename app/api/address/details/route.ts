import { Effect } from "effect";
import { type NextRequest, NextResponse } from "next/server";

import {
  fetchAddressDetails,
  getGoogleMapsApiKey,
  validatePlaceId,
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

    // Get and validate placeId parameter
    const searchParams = request.nextUrl.searchParams;
    const placeId = yield* validatePlaceId(searchParams.get("placeId"));

    // Get API key
    const apiKey = yield* getGoogleMapsApiKey();

    // Fetch address details
    const addressDetails = yield* fetchAddressDetails(placeId, apiKey);

    return NextResponse.json({ address: addressDetails });
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
