"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { BasicNotificationBody } from "@/components/ui/feedback/basic-notification";
import { useNotification } from "@/context/NotificationBar";
import { RestaurantDeleteForm } from "@/features/forms/restaurant-delete-form";
import { useRestaurantMutation } from "@/hooks/api/restaurant/useRestaurantMutation";
import { queryClient } from "@/providers/QueryProvider";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { tryCatch } from "@/utils/tryCatch";

export function RestaurantFormDelete({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const router = useRouter();
  const { mutateAsync, isPending } = useRestaurantMutation("DELETE");
  const { openNotification } = useNotification();

  const form = useForm<{ confirmationSlug: string }>({
    defaultValues: {
      confirmationSlug: "",
    },
  });

  const onSubmit = async () => {
    const [error] = await tryCatch(mutateAsync({ id: restaurant.id }));

    if (error) {
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
        description="Restaurant deleted successfully!"
        variant="warning"
      />,
    );
    queryClient.refetchQueries();
    router.push("/my-restaurants");
  };

  return (
    <RestaurantDeleteForm
      restaurantName={restaurant.name}
      restaurantSlug={restaurant.slug!}
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
    />
  );
}
