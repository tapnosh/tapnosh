import { useMutation } from "@tanstack/react-query";
import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import {
  RestaurantFormData,
  RestaurantFormSchema,
} from "@/types/restaurant/Create";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { z } from "zod";

export const useCreateRestaurant = () => {
  const { fetchClient } = useFetchClient();

  return useMutation<Restaurant, TranslatedError, RestaurantFormData>({
    mutationFn: async (data) => {
      try {
        const validatedData = RestaurantFormSchema.parse(data);

        return await fetchClient<Restaurant>("restaurants", {
          method: "POST",
          body: JSON.stringify(validatedData),
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
