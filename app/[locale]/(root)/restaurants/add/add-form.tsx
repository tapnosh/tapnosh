"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { ERROR_MESSAGES } from "@/utils/error-messages";
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

export function RestaurantFormCreate() {
  const t = useTranslations("restaurants.form.errors");
  const tActions = useTranslations("restaurants.form.fields.actions");
  const tToast = useTranslations("common.toast");

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
      categories: [],
      operatingHours: DEFAULT_OPERATING_HOURS,
    },
  });

  const onSubmit = async (data: RestaurantFormData) => {
    const [error, res] = await tryCatch(mutateAsync(data));

    if (error) {
      // Tłumacz błąd z backendu
      const errorMessage =
        error instanceof Error ? error.message : tToast("unexpectedError");
      const errorKey =
        ERROR_MESSAGES[errorMessage as keyof typeof ERROR_MESSAGES];
      const translatedError = errorKey ? t(errorKey) : errorMessage;

      openNotification(
        <BasicNotificationBody
          title={tToast("error")}
          description={translatedError}
          variant="error"
        />,
      );
      return;
    }

    openNotification(
      <BasicNotificationBody
        title={tToast("success")}
        description={tToast("restaurantCreated")}
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
      submitLabel={tActions("addRestaurant")}
    />
  );
}
