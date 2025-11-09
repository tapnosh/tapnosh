"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotification } from "@/context/NotificationBar";
import { BasicNotificationBody } from "@/components/ui/feedback/basic-notification";
import {
  RestaurantFormData,
  RestaurantFormSchema,
} from "@/types/restaurant/Create";
import { useRestaurantMutation } from "@/hooks/api/restaurant/useRestaurantMutation";
import { RestaurantDetailsForm } from "@/features/forms/restaurant-details-form";
import { useEffect } from "react";
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
      category_ids: [],
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
        category_ids: restaurant.categories?.map((c) => c.id),
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
