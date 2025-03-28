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

export const RestaurantMenuItem = ({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}) => {
  return (
    <Button
      variant="ghost"
      className="-mx-4 h-auto items-start justify-between"
      onClick={() => onClick(item)}
      asChild
    >
      <div className="flex flex-1 gap-4 py-4">
        <div className="flex max-w-sm flex-col">
          <h3 className="font-display-median font-black text-wrap">
            {item.name}
          </h3>
          <p className="leading-4 text-wrap">{item.name}</p>
          <span className="text-muted-foreground mb-1 text-wrap">
            {item.ingredients.join(" • ")}
          </span>
          <div className="flex gap-1">
            {item.categories.map((tag) => (
              <Badge key={tag} variant="destructive">
                <Beef /> {tag}
              </Badge>
            ))}
          </div>
          <h6 className="font-display text-primary mt-1 font-bold">
            {item.price.toLocaleString("pl-PL", {
              style: "currency",
              currency: item.currency,
            })}
          </h6>
        </div>

        <div className="relative aspect-square min-h-28 min-w-28 overflow-clip rounded-sm sm:min-h-36 sm:min-w-36">
          <Image
            src={item.image}
            alt="Tikka masala"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </Button>
  );
};

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
        type: "tween",
        duration: 0.2,
      }}
      className="hover:bg-muted cursor-pointer space-y-4 border py-4"
      onClick={() => onClick(item)}
    >
      <CardContent className="flex flex-row items-start justify-between gap-4 px-4">
        <div className="flex flex-1 flex-col">
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>{item.name}</CardDescription>
          <div className="mt-3">
            <p className="text-sm">{item.ingredients.join(" • ")}</p>
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
          <div className="relative aspect-square shrink-0">
            {isAvailable && (
              <Button
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(e, item);
                }}
                className="absolute right-0 bottom-0 translate-1/4 translate-y-1/4"
              >
                <ShoppingBasket className="h-4 w-4" />
              </Button>
            )}
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              quality={50}
              className="h-full w-full rounded-md object-cover"
            />
          </div>
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
