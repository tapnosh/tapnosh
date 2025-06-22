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

export const useRestaurantMutation = (
  method: "POST" | "PUT" | "DELETE" = "POST",
) => {
  const { fetchClient } = useFetchClient();
  const { mutateAsync: uploadImages } = useUploadImage();

  return useMutation<Restaurant, TranslatedError, RestaurantFormData>({
    mutationFn: async (data) => {
      try {
        if ((method === "PUT" || method === "DELETE") && !data.id) {
          throw {
            translationKey: "restaurant.id.required",
            status: 400,
            message:
              "Restaurant ID is required for update and delete operations",
          };
        }

        // Skip validation for DELETE operations
        let validatedData = {};
        if (method !== "DELETE") {
          validatedData = RestaurantFormSchema.parse(data);
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
          imageBlobs = await uploadImages(
            images.file
              ?.filter(
                (image): image is { file: File; url: string } =>
                  "file" in image,
              )
              .map(({ file }) => file) as File[],
          );
        }

        const endpoint =
          method === "POST" ? "restaurants" : `restaurants/${data.id}`;

        return await fetchClient<Restaurant>(endpoint, {
          method,
          body: JSON.stringify({
            ...validatedData,
            ...(imageBlobs?.length
              ? {
                  images: [...(images?.blob ? images.blob : []), ...imageBlobs],
                }
              : {}),
          }),
        });
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
