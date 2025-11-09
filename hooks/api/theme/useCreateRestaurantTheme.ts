import { useMutation } from "@tanstack/react-query";
import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { z } from "zod";
import { RestaurantTheme } from "@/types/theme/Theme";
import {
  RestaurantThemeFormData,
  RestaurantThemeFormSchema,
} from "@/types/theme/Create";
import { tryCatch } from "@/lib/tryCatch";

export const useCreateRestaurantTheme = () => {
  const { fetchClient } = useFetchClient();

  return useMutation<RestaurantTheme, TranslatedError, RestaurantThemeFormData>(
    {
      mutationFn: async (data) => {
        const [parseError, validatedData] = tryCatch(() =>
          RestaurantThemeFormSchema.parse(data),
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

        const [error, result] = await tryCatch(
          fetchClient<RestaurantTheme>("restaurant-theme", {
            method: "POST",
            body: JSON.stringify(validatedData),
          }),
        );

        if (error) {
          throw error;
        }

        return result;
      },
    },
  );
};
