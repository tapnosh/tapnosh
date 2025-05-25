"use server";

import { z } from "zod";

const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  description: z.string().optional(),
  theme_id: z.string().uuid("Invalid theme ID format"),
  //   address: z.string().min(1, "Address is required"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  category_ids: z
    .array(z.string().uuid())
    .min(1, "At least one category must be selected"),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

export async function createRestaurant(data: RestaurantFormData) {
  try {
    const validatedData = restaurantSchema.parse(data);

    const response = await fetch("https://noshtap.onrender.com/restaurants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    console.log(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const result = await response.json();

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error creating restaurant:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Invalid form data: " + error.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
