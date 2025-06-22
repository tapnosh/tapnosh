import { useMutation } from "@tanstack/react-query";
import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { z } from "zod";
import { useUploadImage } from "../restaurant/useUploadImage";
import { Builder, BuilderSchema } from "@/types/builder/BuilderSchema";

export const useMenuMutation = () => {
  const { fetchClient } = useFetchClient();
  const { mutateAsync: uploadImages } = useUploadImage();

  return useMutation<
    Restaurant,
    TranslatedError,
    { schema: Builder; id?: string; restaurantId: string; delete?: boolean }
  >({
    mutationFn: async (data) => {
      try {
        const validatedData = BuilderSchema.parse(data.schema);

        // Extract all image files from menu items
        const images = validatedData.menu.flatMap(({ items }) =>
          items.flatMap((item) =>
            item.image[0] && "file" in item.image[0]
              ? { file: item.image[0].file, itemId: item.id }
              : [],
          ),
        );

        // Upload all images at once and get back array of URLs
        const uploadedImageUrls = await uploadImages(images.map((i) => i.file));

        // Update the schema with uploaded image URLs
        const updatedSchema = {
          ...validatedData,
          menu: validatedData.menu.map((section) => ({
            ...section,
            items: section.items.map((item) => {
              if (item.image[0] && "file" in item.image[0]) {
                const imageIndex = images.findIndex(
                  (img) => img.itemId === item.id,
                );
                return {
                  ...item,
                  image: [
                    imageIndex !== -1
                      ? uploadedImageUrls[imageIndex]
                      : item.image[0].url,
                  ],
                };
              }
              return item;
            }),
          })),
        };

        // Use the updated schema for the API call
        const schema = { ...updatedSchema };

        const endpoint = data.id
          ? `restaurants/${data.restaurantId}/menu/${data.id}`
          : `restaurants/${data.restaurantId}/menu`;

        let method: "POST" | "PUT" | "DELETE" = "POST";
        if (data.id) {
          method = "PUT";
        }
        if (data.delete) {
          method = "DELETE";
        }

        return await fetchClient<Restaurant>(endpoint, {
          method,
          body: JSON.stringify({
            schema,
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
