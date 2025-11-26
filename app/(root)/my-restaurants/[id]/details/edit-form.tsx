"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { BasicNotificationBody } from "@/components/ui/feedback/basic-notification";
import { useNotification } from "@/context/NotificationBar";
import { RestaurantDetailsForm } from "@/features/forms/restaurant-details-form";
import { useRestaurantMutation } from "@/hooks/api/restaurant/useRestaurantMutation";
import {
  RestaurantFormData,
  RestaurantFormSchema,
} from "@/types/restaurant/Create";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { tryCatch } from "@/utils/tryCatch";

export function RestaurantFormEdit({ restaurant }: { restaurant: Restaurant }) {
  const { mutateAsync, isPending } = useRestaurantMutation("PUT");
  const { openNotification } = useNotification();

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(RestaurantFormSchema),
    defaultValues: {
      name: "",
      description: "",
      theme_id: "",
      images: [],
      categories: [],
    },
  });

  useEffect(() => {
    if (restaurant) {
      form.reset({
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        theme_id: restaurant.theme.id,
        images: restaurant.images || [],
        categories: restaurant.categories,
        address: restaurant.address,
        phoneNumber: restaurant.phoneNumber,
        facebookUrl: restaurant.facebookUrl,
        instagramUrl: restaurant.instagramUrl,
        reservationUrl: restaurant.reservationUrl,
        priceRange: restaurant.priceRange,
      });
    }
  }, [restaurant, form]);

  const onSubmit = async (data: RestaurantFormData) => {
    const [error] = await tryCatch(mutateAsync(data));

    if (error) {
      console.error("Error creating restaurant:", error);
      openNotification(
        <BasicNotificationBody
          title="Error"
          description={
            error instanceof Error
              ? error.message
              : "An unexpected error occurred"
          }
          variant="error"
        />,
      );
      return;
    }

    openNotification(
      <BasicNotificationBody
        title="Success"
        description="Restaurant created successfully!"
        variant="success"
      />,
    );
    form.reset();
  };

  return (
    <RestaurantDetailsForm
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      submitLabel="Update Details"
    />
  );
}
