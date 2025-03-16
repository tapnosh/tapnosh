import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Beef } from "lucide-react";
import { MenuItem } from "@/types/menu";

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
          <h4 className="text-header text-wrap">{item.name}</h4>
          <p className="leading-4 text-wrap">{item.name}</p>
          <span className="text-muted-foreground mb-1 text-wrap">
            {item.ingredients.join(" • ")}
          </span>
          <div className="flex gap-1">
            {item.tags.map((tag) => (
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
