import { MenuItem } from "@/types/menu/Menu";

/**
 * Find a dish by its ID in the menu schema
 */
export function findDishById(menu: { items: MenuItem[] }[], dishId: string) {
  for (let groupIndex = 0; groupIndex < menu.length; groupIndex++) {
    const group = menu[groupIndex];
    for (let itemIndex = 0; itemIndex < group.items.length; itemIndex++) {
      const item = group.items[itemIndex];
      if (item.id === dishId) {
        return { item, groupIndex, itemIndex };
      }
    }
  }
  return null;
}
