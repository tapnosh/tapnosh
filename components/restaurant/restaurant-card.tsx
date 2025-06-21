import { unstable_ViewTransition as ViewTransition } from "react";
import { RestaurantCarousel } from "./restaurant-carousel";
import { Button } from "../ui/button";
import Link from "next/link";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { Badge } from "../ui/badge";
import { RestaurantCategory } from "@/types/category/Category";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

function RestaurantBadges({
  categories,
}: {
  categories?: RestaurantCategory[];
}) {
  if (!categories) {
    return <></>;
  }

  return (
    <div className="flex gap-2">
      {categories?.map(({ name, id }) => (
        <Badge key={id} variant="outline" className="font-medium">
          {name}
        </Badge>
      ))}
    </div>
  );
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="group mb-2 border-b pb-4 last:border-0">
      <RestaurantCarousel restaurant={restaurant} />

      <div className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <ViewTransition name={`title-${restaurant.id}`}>
            <h3>{restaurant.name}</h3>
          </ViewTransition>
          <RestaurantBadges categories={restaurant.categories} />
        </div>
        <ViewTransition name={`description-${restaurant.id}`}>
          <p className="text-muted-foreground mb-3 italic">
            {restaurant.description}
          </p>
        </ViewTransition>
        {/* <div className="text-muted-foreground mb-4 flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
          <span>{restaurant.address}</span>
        </div> */}

        <div className="flex gap-2">
          <Button size="lg" asChild>
            <Link href={`/restaurants/${restaurant.id}`}>See the Menu</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
