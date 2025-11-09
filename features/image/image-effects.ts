import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { Effect } from "effect";
import { UploadError } from "./errors";

/**
 * Configuration for allowed image content types
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/svg",
] as const;

/**
 * Uploads an image to Vercel Blob storage
 * @param body - The upload body containing file information
 * @param request - The HTTP request object
 * @returns Effect that resolves to the upload response or fails with UploadError
 */
export const uploadImageToBlob = (body: HandleUploadBody, request: Request) =>
  Effect.tryPromise({
    try: () =>
      handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
          addRandomSuffix: true,
        }),
        onUploadCompleted: async () => {},
      }),
    catch: (error) =>
      new UploadError({
        error,
        statusCode: 400,
        message: "Failed to upload image",
      }),
  });
