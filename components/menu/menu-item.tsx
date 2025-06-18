"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Beef,
  Beer,
  Coffee,
  Droplets,
  Fish,
  Leaf,
  Milk,
  Plus,
  Wheat,
  Wine,
} from "lucide-react";
import { motion } from "motion/react";
import { MenuItem } from "@/types/menu/Menu";

export const categoryIcons = {
  meat: <Beef className="h-4 w-4" />,
  vegan: <Leaf className="h-4 w-4" />,
  vegetarian: <Leaf className="h-4 w-4" />,
  "gluten-free": <Wheat className="h-4 w-4 line-through" />,
  "dairy-free": <Milk className="h-4 w-4 line-through" />,
  seafood: <Fish className="h-4 w-4" />,
  alcoholic: <Wine className="h-4 w-4" />,
  "non-alcoholic": <Droplets className="h-4 w-4" />,
  hot: <Coffee className="h-4 w-4" />,
  cold: <Beer className="h-4 w-4" />,
};

const MotionButton = motion(Button);

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
      <div className="flex flex-row items-start justify-between gap-4 border-b pb-4">
        {item.image && (
          <motion.div
            layoutId={`item-image-${item?.id}`}
            className="relative aspect-square max-w-24 flex-1 sm:max-w-32 md:max-w-40 xl:max-w-52"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              quality={50}
              className="h-full w-full rounded-md object-cover"
            />
          </motion.div>
        )}
        <div className="flex flex-1 flex-col">
          <header className="flex items-start justify-between">
            <span className="font-display-median text-lg">{item.name}</span>
            <span className="font-display-median text-lg font-semibold">
              ${item.price.toFixed(2)}
            </span>
          </header>
          <span className="text-muted-foreground pr-15 text-sm italic">
            {item?.description}
          </span>
          <footer className="mt-2 flex items-center justify-between gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-sm">{item.ingredients.join(" • ")}</span>
              <div className="flex flex-wrap gap-1.5">
                {item.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    <span className="mr-1">
                      {categoryIcons[category as keyof typeof categoryIcons]}
                    </span>
                    {category}
                  </Badge>
                ))}
              </div>
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
