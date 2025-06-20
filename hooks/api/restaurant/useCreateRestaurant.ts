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

export const useCreateRestaurant = () => {
  const { fetchClient } = useFetchClient();
  const { mutateAsync: uploadImages } = useUploadImage();

  return useMutation<Restaurant, TranslatedError, RestaurantFormData>({
    mutationFn: async (data) => {
      try {
        const validatedData = RestaurantFormSchema.parse(data);

        const images = data.images
          .filter((image) => "file" in image)
          .map(({ file }) => file);

        const imageBlobs = await uploadImages(images);

        return await fetchClient<Restaurant>("restaurants", {
          method: "POST",
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
