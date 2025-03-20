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
import { MenuItem } from "@/types/menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

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
    <Card
      role="button"
      className="cursor-pointer transition-shadow hover:shadow-lg"
      onClick={() => (isAvailable ? onClick(item) : undefined)}
    >
      <CardContent className="flex flex-row justify-between gap-4">
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
        </div>
        {item.image && (
          <div className="aspect-square">
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              className="h-full w-full rounded-md object-cover"
            />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <span className="font-bold">${item.price.toFixed(2)}</span>
        {isAvailable && (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(e, item);
            }}
            className="ml-auto"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add to tab
          </Button>
        )}
        {!isAvailable && (
          <Badge variant="outline" className="text-muted-foreground">
            Not Available
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
