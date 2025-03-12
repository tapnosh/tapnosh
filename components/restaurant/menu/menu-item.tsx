import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Beef } from "lucide-react";
import { Dispatch } from "react";
import { MenuItem } from "@/types/menu";
import { useOrder } from "@/context/OrderContext";

export const RestaurantMenuItem = ({
  item,
  setOpen,
}: {
  item: MenuItem;
  setOpen: Dispatch<boolean>;
}) => {
  const { addItem } = useOrder();

  return (
    <Button
      variant="ghost"
      className="h-auto justify-between items-start -mx-4"
      onClick={() => {
        addItem(item);
        setOpen(true);
      }}
      asChild
    >
      <div className="flex gap-4 py-4 flex-1">
        <div className="flex flex-col max-w-sm">
          <h4 className="text-header text-wrap">{item.name}</h4>
          <p className="text-wrap leading-4">{item.name}</p>
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
          <h6 className="font-display font-bold mt-1 text-primary">
            {item.price.toLocaleString("pl-PL", {
              style: "currency",
              currency: item.currency,
            })}
          </h6>
        </div>

        <div className="relative aspect-square min-h-28 min-w-28 sm:min-h-36 sm:min-w-36 rounded-sm overflow-clip">
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
