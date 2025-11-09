import { useMutation } from "@tanstack/react-query";
import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import {
  RestaurantFormData,
  RestaurantFormSchema,
} from "@/types/restaurant/Create";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { z } from "zod";
import { useUploadImage } from "./useUploadImage";
import { PutBlobResult } from "@vercel/blob";
import { tryCatch } from "@/lib/tryCatch";

export const useRestaurantMutation = (
  method: "POST" | "PUT" | "DELETE" = "POST",
) => {
  const { fetchClient } = useFetchClient();
  const { mutateAsync: uploadImages } = useUploadImage();

  return useMutation<Restaurant, TranslatedError, RestaurantFormData>({
    mutationFn: async (data) => {
      if ((method === "PUT" || method === "DELETE") && !data.id) {
        throw {
          translationKey: "restaurant.id.required",
          status: 400,
          message: "Restaurant ID is required for update and delete operations",
        };
      }

      // Skip validation for DELETE operations
      let validatedData = {};
      if (method !== "DELETE") {
        const [parseError, parsed] = tryCatch(() =>
          RestaurantFormSchema.parse(data),
        );

        if (parseError) {
          if (parseError instanceof z.ZodError) {
            throw {
              translationKey: "parse.error",
              status: 422,
              message: parseError.errors.map((e) => e.message).join(", "),
            };
          }
          throw parseError;
        }

        validatedData = parsed;
      }

      const images = Object.groupBy(data.images, (image) =>
        "file" in image ? "file" : "blob",
      );

      let imageBlobs: PutBlobResult[] = [];

      const filesToUpload = images.file
        ?.filter(
          (image): image is { file: File; url: string } => "file" in image,
        )
        .map(({ file }) => file) as File[];

      if (filesToUpload?.length) {
        const [uploadError, uploaded] = await tryCatch(
          uploadImages(
            images.file
              ?.filter(
                (image): image is { file: File; url: string } =>
                  "file" in image,
              )
              .map(({ file }) => file) as File[],
          ),
        );

        if (uploadError) {
          throw uploadError;
        }

        imageBlobs = uploaded;
      }

      const endpoint =
        method === "POST" ? "restaurants" : `restaurants/${data.id}`;

      const [fetchError, result] = await tryCatch(
        fetchClient<Restaurant>(endpoint, {
          method,
          body: JSON.stringify({
            ...validatedData,
            ...(imageBlobs?.length
              ? {
                  images: [...(images?.blob ? images.blob : []), ...imageBlobs],
                }
              : {}),
          }),
        }),
      );

      if (fetchError) {
        throw fetchError;
      }

      return result;
    },
  });
};
