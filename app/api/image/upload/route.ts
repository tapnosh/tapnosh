import { type HandleUploadBody } from "@vercel/blob/client";
import { Effect } from "effect";
import { NextResponse } from "next/server";

import { uploadImageToBlob } from "@/features/image/image-effects";
import {
  authenticateUser,
  getAuthToken,
  parseRequestBody,
  validateUserAuthorization,
} from "@/lib/auth/auth-effects";
import {
  AuthError,
  ParseError,
  TokenError,
  UnauthorizedError,
  UploadError,
} from "@/lib/errors/errors";

export async function POST(request: Request): Promise<NextResponse> {
  const program = Effect.gen(function* () {
    const body = yield* parseRequestBody<HandleUploadBody>(request);

    const { getToken, userId } = yield* authenticateUser();

    const token = yield* getAuthToken(getToken);

    yield* validateUserAuthorization(token, userId);

    const jsonResponse = yield* uploadImageToBlob(body, request);

    return NextResponse.json(jsonResponse);
  }).pipe(
    Effect.catchAll((error) => {
      if (
        error instanceof UnauthorizedError ||
        error instanceof ParseError ||
        error instanceof AuthError ||
        error instanceof TokenError ||
        error instanceof UploadError
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
