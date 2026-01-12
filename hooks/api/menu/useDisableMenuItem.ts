import { useMutation } from "@tanstack/react-query";

import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { MenuItem } from "@/types/menu/Menu";

export interface DisableMenuItemData {
  menuItemId: string;
  restaurantId: string;
  disabledFrom: Date | null;
  disabledUntil?: Date | null;
}

export interface DisableMenuItemResponse {
  success: boolean;
  menuItem: MenuItem;
  disabledUntil: string;
}

export const useDisableMenuItem = () => {
  const { fetchClient } = useFetchClient();

  return useMutation<
    DisableMenuItemResponse,
    TranslatedError,
    DisableMenuItemData
  >({
    mutationFn: async (data) => {
      const response = await fetchClient<DisableMenuItemResponse>(
        "/menu/disable-item",
        {
          method: "POST",
          body: JSON.stringify({
            menuItemId: data.menuItemId,
            restaurantId: data.restaurantId,
            disabledFrom: data.disabledFrom?.toISOString() ?? null,
            disabledUntil: data.disabledUntil?.toISOString() ?? null,
          }),
        },
      );

      return response;
    },
  });
};
