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

        const validatedData = RestaurantFormSchema.parse(data);

        const images = data.images
          .filter((image) => "file" in image)
          .map(({ file }) => file);

        const imageBlobs = await uploadImages(images);

        const endpoint =
          method === "POST" ? "restaurants" : `restaurants/${data.id}`;

        return await fetchClient<Restaurant>(endpoint, {
          method,
          body: JSON.stringify({
            ...validatedData,
            images: imageBlobs,
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
