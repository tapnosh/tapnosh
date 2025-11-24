import { useMutation } from "@tanstack/react-query";
import { type PutBlobResult } from "@vercel/blob";
import { z } from "zod";

import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import {
  RestaurantFormData,
  RestaurantFormSchema,
} from "@/types/restaurant/Create";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { tryCatch } from "@/utils/tryCatch";

import { useUploadImage } from "./useUploadImage";

type RestaurantMutationData<T extends "POST" | "PUT" | "DELETE"> =
  T extends "DELETE" ? { id: string } : RestaurantFormData;

export const useRestaurantMutation = <T extends "POST" | "PUT" | "DELETE">(
  method: T = "POST" as T,
) => {
  const { fetchClient } = useFetchClient();
  const { mutateAsync: uploadImages } = useUploadImage();

  return useMutation<Restaurant, TranslatedError, RestaurantMutationData<T>>({
    mutationFn: async (data) => {
      if ((method === "PUT" || method === "DELETE") && !data.id) {
        throw {
          translationKey: "restaurant.id.required",
          status: 400,
          message: "Restaurant ID is required for update and delete operations",
        };
      }

      // For DELETE operations, skip validation and image processing
      if (method === "DELETE") {
        const endpoint = `restaurants/${data.id}`;

        const [fetchError, result] = await tryCatch(
          fetchClient<Restaurant>(endpoint, {
            method,
          }),
        );

        if (fetchError) {
          throw fetchError;
        }

        return result;
      }

      // TypeScript now knows data is RestaurantFormData for POST/PUT
      const formData = data as RestaurantFormData;

      // Skip validation for DELETE operations
      let validatedData = {};
      const [parseError, parsed] = tryCatch(() =>
        RestaurantFormSchema.parse(formData),
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

      const images = Object.groupBy(formData.images, (image) =>
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
        method === "POST" ? "restaurants" : `restaurants/${formData.id}`;

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
