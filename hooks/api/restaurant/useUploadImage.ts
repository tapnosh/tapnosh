import { useMutation } from "@tanstack/react-query";
import { TranslatedError } from "@/types/api/Error";
import { upload } from "@vercel/blob/client";
import { type PutBlobResult } from "@vercel/blob";

import { z } from "zod";
import { ImageValidationSchema } from "@/types/image/BlobImage";
import { tryCatch } from "@/lib/tryCatch";

export const useUploadImage = () => {
  return useMutation<PutBlobResult[], TranslatedError, File[]>({
    mutationFn: async (data) => {
      const [error, result] = await tryCatch(
        Promise.allSettled(
          data.map(async (image) => {
            ImageValidationSchema.parse(image);
            return await upload(image.name, image, {
              access: "public",
              handleUploadUrl: "/api/image/upload",
            });
          }),
        ),
      );

      if (error) {
        if (error instanceof z.ZodError) {
          throw {
            translationKey: "parse.error",
            status: 422,
            message: error.errors.map((e) => e.message).join(", "),
          };
        }
        throw error;
      }

      return result
        .map((blob) => (blob.status === "fulfilled" ? blob.value : null))
        .filter(Boolean) as PutBlobResult[];
    },
  });
};
