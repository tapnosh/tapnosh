"use server";

import { authFetch } from "@/lib/api/client";
import {
  RestaurantThemeFormData,
  RestaurantThemeFormSchema,
} from "@/types/theme/Create";
import { RestaurantTheme } from "@/types/theme/Theme";
import { z } from "zod";

export async function createTheme(_: unknown, data: RestaurantThemeFormData) {
  try {
    const validatedData = RestaurantThemeFormSchema.parse(data);

    const response = await authFetch("restaurant-theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const result = (await response.json()) as RestaurantTheme;

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
