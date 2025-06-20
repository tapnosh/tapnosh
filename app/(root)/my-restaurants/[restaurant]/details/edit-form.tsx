"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotification } from "@/context/NotificationBar";
import { BasicNotificationBody } from "@/components/ui/basic-notification";
import {
  RestaurantFormData,
  RestaurantFormSchema,
} from "@/types/restaurant/Create";
import { useRestaurantMutation } from "@/hooks/api/restaurant/useRestaurantMutation";
import { RestaurantDetailsForm } from "@/components/forms/restaurant-details-form";

export function RestaurantFormEdit() {
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

  const onSubmit = async (data: RestaurantFormData) => {
    try {
      await mutateAsync(data);
      openNotification(
        <BasicNotificationBody
          title="Success"
          description="Restaurant created successfully!"
          variant="success"
        />,
      );
      form.reset();
    } catch {
      openNotification(
        <BasicNotificationBody
          title="Error"
          description="An unexpected error occurred"
          variant="error"
        />,
      );
    }
  };

  return (
    <RestaurantDetailsForm
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      submitLabel="Add Restaurant"
    />
  );
}
