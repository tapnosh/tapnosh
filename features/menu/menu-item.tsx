"use client";

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { Button } from "@/components/ui/forms/button";
import { useCurrency } from "@/hooks/useCurrency";
import { MenuItem } from "@/types/menu/Menu";

import { getAllergenIcon, getFoodTypeIcon } from "./utils/icons";

const MotionButton = motion.create(Button);

// Menu Item Card Component
export function MenuItemCard({
  item,
  isAvailable,
  onAddToCart,
  onClick,
}: {
  item: MenuItem;
  isAvailable: boolean;
  onAddToCart?: (item: MenuItem) => void;
  onClick?: (item: MenuItem) => void;
}) {
  const { formatCurrency } = useCurrency();
  const t = useTranslations("categories");

  const imgSrc = useMemo(() => {
    return Array.isArray(item.image) ? item.image[0]?.url : item.image;
  }, [item.image]);

  return (
    <motion.div
      layout
      key={item.id}
      layoutId={`item-${item?.id}`}
      role="button"
      style={{ borderRadius: "1rem" }}
      transition={{
        type: "spring",
        duration: 0.4,
      }}
      className="cursor-pointer space-y-4"
      onClick={() => onClick?.(item)}
    >
      <div className="flex flex-row items-stretch justify-between gap-4 border-b pb-4">
        {imgSrc && (
          <motion.div
            layoutId={`item-image-${item?.id}`}
            className="relative aspect-square max-w-24 flex-1 sm:max-w-32 md:max-w-40 xl:max-w-52"
          >
            <Image
              src={imgSrc}
              alt={item.name}
              width={256}
              height={256}
              quality={50}
              className="h-full w-full rounded-md object-cover"
            />
          </motion.div>
        )}
        <div className="flex flex-1 flex-col">
          <header className="flex items-start justify-between gap-1 pb-0.5">
            <span className="font-display-median text-lg leading-5 lg:text-2xl">
              {item.name}
            </span>
            <div className="mt-1 flex items-center gap-1">
              <span className="font-display-median text-lg leading-5 font-semibold lg:text-xl">
                {formatCurrency(item.price.amount, item.price.currency)}
              </span>
            </div>
          </header>
          <span className="text-muted-foreground pr-15 text-sm leading-4 italic">
            {item?.description}
          </span>
          <footer className="mt-2 flex flex-1 gap-2">
            <div className="flex flex-col justify-between gap-2">
              {/* Allergens */}
              {item.allergen_ids && item.allergen_ids.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  {item.allergen_ids.map((allergenId) => {
                    const AllergenIcon = getAllergenIcon(allergenId);
                    return (
                      <div
                        key={allergenId}
                        className="bg-secondary text-secondary-foreground flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                        title={t(allergenId)}
                      >
                        <AllergenIcon className="h-3.5 w-3.5" />
                        <span>{t(allergenId)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {item.food_type_ids && item.food_type_ids.length > 0 && (
                <div className="mt-auto flex flex-wrap items-center gap-1">
                  {item.food_type_ids.map((foodTypeId) => {
                    const FoodTypeIcon = getFoodTypeIcon(foodTypeId);
                    return (
                      <div
                        key={foodTypeId}
                        className="bg-primary/10 text-primary flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
                        title={t(foodTypeId)}
                      >
                        <FoodTypeIcon className="h-3.5 w-3.5" />
                        <span>{t(foodTypeId)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {isAvailable && onAddToCart && (
              <MotionButton
                layoutId={`item-add-to-cart-${item?.id}`}
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart?.(item);
                }}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </MotionButton>
            )}
          </footer>
        </div>
      </div>

      {/* <CardFooter className="px-4">
        {!isAvailable && (
          <Badge variant="outline" className="text-muted-foreground">
            Not Available
          </Badge>
        )}
      </CardFooter> */}
    </motion.div>
  );
}
