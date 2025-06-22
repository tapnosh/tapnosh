"use client";

import { useForm } from "react-hook-form";
import { useNotification } from "@/context/NotificationBar";
import { BasicNotificationBody } from "@/components/ui/basic-notification";
import { useRestaurantMutation } from "@/hooks/api/restaurant/useRestaurantMutation";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { RestaurantDeleteForm } from "@/components/forms/restaurant-delete-form";
import { useRouter } from "next/navigation";
import { queryClient } from "@/providers/QueryProvider";

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
    try {
      await mutateAsync(restaurant);
      openNotification(
        <BasicNotificationBody
          title="Success"
          description="Restaurant deleted successfully!"
          variant="warning"
        />,
      );
      queryClient.refetchQueries();
      router.push("/my-restaurants");
    } catch (error) {
      if (error instanceof Error) {
        openNotification(
          <BasicNotificationBody
            title="Error"
            description={error.message}
            variant="error"
          />,
        );
      } else {
        openNotification(
          <BasicNotificationBody
            title="Error"
            description="An unexpected error occurred"
            variant="error"
          />,
        );
      }
    }
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
