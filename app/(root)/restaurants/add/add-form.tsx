"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { BasicNotificationBody } from "@/components/ui/feedback/basic-notification";
import { useNotification } from "@/context/NotificationBar";
import { RestaurantDetailsForm } from "@/features/forms/restaurant-details-form";
import { useRestaurantMutation } from "@/hooks/api/restaurant/useRestaurantMutation";
import { queryClient } from "@/providers/QueryProvider";
import {
  RestaurantFormData,
  RestaurantFormSchema,
} from "@/types/restaurant/Create";
import { tryCatch } from "@/utils/tryCatch";

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
    const [error, res] = await tryCatch(mutateAsync(data));

    if (error) {
      openNotification(
        <BasicNotificationBody
          title="Error"
          description="An unexpected error occurred"
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
    queryClient.refetchQueries();
    router.push(`/restaurants/${res.slug}`);
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
