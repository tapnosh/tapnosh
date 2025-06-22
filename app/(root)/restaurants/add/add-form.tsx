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
import { queryClient } from "@/providers/QueryProvider";
import { useRouter } from "next/navigation";

export function RestaurantFormCreate() {
  const router = useRouter();
  const { mutateAsync, isPending } = useRestaurantMutation();
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
      const res = await mutateAsync(data);
      openNotification(
        <BasicNotificationBody
          title="Success"
          description="Restaurant created successfully!"
          variant="success"
        />,
      );
      form.reset();
      queryClient.refetchQueries();
      router.push(`/restaurants/${res.slug}`);
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
