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
  ShoppingBasket,
  Wheat,
  Wine,
} from "lucide-react";
import { MenuItem } from "@/types/menu";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";

const categoryIcons = {
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

const MotionCardTitle = motion(CardTitle);
const MotionCardDescription = motion(CardDescription);
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
  onAddToCart: (e: React.MouseEvent, item: MenuItem) => void;
  onClick: (item: MenuItem) => void;
}) {
  return (
    <motion.div
      layout
      layoutId={`item-${item?.id}`}
      role="button"
      style={{ borderRadius: "1rem" }}
      transition={{
        type: "spring",
        duration: 0.4,
      }}
      className="hover:bg-muted cursor-pointer space-y-4 border py-4"
      onClick={() => onClick(item)}
    >
      <CardContent className="flex flex-row items-start justify-between gap-4 px-4">
        <div className="flex flex-1 flex-col">
          <MotionCardTitle layoutId={`item-title-${item?.id}`}>
            {item.name}
          </MotionCardTitle>
          <MotionCardDescription layoutId={`item-description-${item?.id}`}>
            {item.name}
          </MotionCardDescription>
          <div className="mt-3">
            <motion.span
              layoutId={`item-ingredients-${item?.id}`}
              className="text-sm"
            >
              {item.ingredients.join(" • ")}
            </motion.span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {item.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                <span className="mr-1">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                </span>
                {category}
              </Badge>
            ))}
          </div>
          <span className="mt-3 font-bold">${item.price.toFixed(2)}</span>
        </div>
        {item.image && (
          <motion.div
            layoutId={`item-image-${item?.id}`}
            className="relative aspect-square shrink-0"
          >
            {isAvailable && (
              <MotionButton
                layoutId={`item-add-to-cart-${item?.id}`}
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(e, item);
                }}
                className="absolute right-0 bottom-0 translate-1/4 translate-y-1/4"
              >
                <ShoppingBasket className="h-4 w-4" />
              </MotionButton>
            )}
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
      </CardContent>

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
