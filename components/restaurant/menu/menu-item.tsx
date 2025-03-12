import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Beef, Wheat } from "lucide-react";
import { Dispatch } from "react";

export const RestaurantMenuItem = ({
  ingredients,
  setOpen,
}: {
  ingredients: string[];
  setOpen: Dispatch<boolean>;
}) => {
  return (
    <Button
      variant="ghost"
      className="h-auto justify-between items-start -mx-4"
      asChild
      onClick={() => setOpen(true)}
    >
      <div className="flex gap-4 py-4 flex-1">
        <div className="flex flex-col max-w-sm">
          <h4 className="text-header">Tikka masala</h4>
          <p className="text-wrap leading-4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <span className="text-muted-foreground mb-1 text-wrap">
            {ingredients.join(" • ")}
          </span>
          <div className="flex gap-1">
            <Badge variant="destructive">
              <Beef /> Meat
            </Badge>
            <Badge variant="green">
              <Wheat /> Gluten
            </Badge>
          </div>
          <h6 className="font-display font-bold mt-1 text-primary">34.00PLN</h6>
        </div>

        <div className="relative aspect-square min-h-32 min-w-32 sm:min-h-36 sm:min-w-36 rounded-sm overflow-clip">
          <Image
            src="https://picsum.photos/500"
            alt="Tikka masala"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </Button>
  );
};
