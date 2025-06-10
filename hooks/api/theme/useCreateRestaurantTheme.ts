import { useMutation } from "@tanstack/react-query";
import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { z } from "zod";
import { RestaurantTheme } from "@/types/theme/Theme";
import {
  RestaurantThemeFormData,
  RestaurantThemeFormSchema,
} from "@/types/theme/Create";

export const useCreateRestaurantTheme = () => {
  const { fetchClient } = useFetchClient();

  return useMutation<RestaurantTheme, TranslatedError, RestaurantThemeFormData>(
    {
      mutationFn: async (data) => {
        try {
          const validatedData = RestaurantThemeFormSchema.parse(data);

          return await fetchClient<RestaurantTheme>("restaurant-theme", {
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
    },
  );
};
