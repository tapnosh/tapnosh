import { unstable_ViewTransition as ViewTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { RestaurantCarousel } from "./restaurant-carousel";
import { Button } from "../ui/button";
import Link from "next/link";

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  district: string;
  foodType: string;
  images: string[];
  rating: number;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
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
          <div className="flex gap-2">
            <Badge variant="outline" className="font-medium">
              {restaurant.foodType}
            </Badge>
            <Badge variant="secondary" className="font-medium">
              {restaurant.district}
            </Badge>
          </div>
        </div>
        <ViewTransition name={`description-${restaurant.id}`}>
          <p className="text-muted-foreground mb-3 italic">
            {restaurant.description}
          </p>
        </ViewTransition>
        <div className="text-muted-foreground mb-4 flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
          <span>{restaurant.address}</span>
        </div>

        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/restaurants/${restaurant.id}`}> Order</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/restaurants/${restaurant.id}`}> View Menu</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
