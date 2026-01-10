"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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

const DEFAULT_OPERATING_HOURS = {
  monday: { openFrom: "09:00", openUntil: "22:00" },
  tuesday: { openFrom: "09:00", openUntil: "22:00" },
  wednesday: { openFrom: "09:00", openUntil: "22:00" },
  thursday: { openFrom: "09:00", openUntil: "22:00" },
  friday: { openFrom: "09:00", openUntil: "22:00" },
  saturday: { openFrom: "09:00", openUntil: "22:00" },
  sunday: { openFrom: "09:00", openUntil: "22:00" },
};

export function RestaurantFormEdit({ restaurant }: { restaurant: Restaurant }) {
  const t = useTranslations("restaurants.form.fields.actions");
  const tToast = useTranslations("common.toast");

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
      operatingHours: DEFAULT_OPERATING_HOURS,
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
        operatingHours: restaurant.operatingHours || DEFAULT_OPERATING_HOURS,
      });
    }
  }, [restaurant, form]);

  const onSubmit = async (data: RestaurantFormData) => {
    const [error] = await tryCatch(mutateAsync(data));

    if (error) {
      openNotification(
        <BasicNotificationBody
          title={tToast("error")}
          description={
            error instanceof Error ? error.message : tToast("unexpectedError")
          }
          variant="error"
        />,
      );
      return;
    }

    openNotification(
      <BasicNotificationBody
        title={tToast("success")}
        description={tToast("restaurantUpdated")}
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
      submitLabel={t("updateDetails")}
    />
  );
}
