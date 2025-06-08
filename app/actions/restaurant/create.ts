"use server";

import { authFetch } from "@/lib/api/client";
import {
  RestaurantFormData,
  RestaurantSchema,
} from "@/types/restaurants/Create";
import { z } from "zod";

export async function createRestaurant(data: RestaurantFormData) {
  try {
    const validatedData = RestaurantSchema.parse(data);

    const response = await authFetch("restaurants", {
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
