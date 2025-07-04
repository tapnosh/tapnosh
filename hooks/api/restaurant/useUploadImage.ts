import { useMutation } from "@tanstack/react-query";
import { TranslatedError } from "@/types/api/Error";
import { upload } from "@vercel/blob/client";
import { type PutBlobResult } from "@vercel/blob";

import { z } from "zod";
import { ImageValidationSchema } from "@/types/image/BlobImage";

export const useUploadImage = () => {
  return useMutation<PutBlobResult[], TranslatedError, File[]>({
    mutationFn: async (data) => {
      try {
        const result = await Promise.allSettled(
          data.map(async (image) => {
            ImageValidationSchema.parse(image);
            return await upload(image.name, image, {
              access: "public",
              handleUploadUrl: "/api/image/upload",
            });
          }),
        );

        return result
          .map((blob) => (blob.status === "fulfilled" ? blob.value : null))
          .filter(Boolean) as PutBlobResult[];
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw {
            translationKey: "parse.error",
            status: 422,
            message: error.errors.map((e) => e.message).join(", "),
          };
        }

        throw error as TranslatedError;
      }
    },
  });
};
