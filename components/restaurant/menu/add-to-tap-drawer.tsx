"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useOrder } from "@/context/OrderContext";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import {
  Beef,
  CirclePlus,
  Minus,
  Plus,
  ShoppingBasket,
  Wheat,
} from "lucide-react";
import { Dispatch, useState } from "react";
import { Input } from "@/components/ui/input";
import { MenuItem } from "@/types/menu";
import { useCurrency } from "@/hooks/useCurrency";
import { toast } from "sonner";

export const AddToTapDrawer = ({
  open,
  setOpen,
  menuItem,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
  menuItem?: MenuItem;
}) => {
  const [amount, setAmount] = useState<number | string>(1);
  const { addItem, removeItem } = useOrder();

  const isMobile = useIsMobile();

  const { formatCurrency } = useCurrency();

  const handleIncrement = () => {
    setAmount((prev) => (+prev >= 9 ? prev : +prev + 1));
  };

  const handleDecrement = () => {
    setAmount((prev) => (+prev <= 1 ? prev : +prev - 1));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === "" || /^[1-9]$/.test(newValue)) {
      setAmount(newValue === "" ? "" : +newValue);
    }
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setAmount(1);
    }
  };

  const handleAddToTab = (item: MenuItem, amnt?: number | string) => {
    const _amount = amnt ? +amnt : 1;
    const price = formatCurrency(item.price * _amount, item.currency);

    addItem(item, _amount);
    setOpen(false);
    toast("Added to your tab", {
      description: `${_amount} x ${item.name} for ${price}`,
      action: {
        label: "Undo",
        onClick: () => removeItem(item.id),
      },
    });
  };

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader className="flex-row justify-between gap-4">
          <div className="overflow-clip">
            <DrawerTitle className="text-header truncate font-black">
              Add to tab
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground truncate">
              Change amount or add to tab
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <article className="overflow-y-auto p-4 pb-0">
          <div className="relative aspect-square min-h-28 min-w-28 overflow-clip rounded-sm sm:min-h-36 sm:min-w-36">
            <Image
              src={menuItem?.image || ""}
              alt={menuItem?.name || ""}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 justify-between gap-4 py-4">
            <div className="flex max-w-sm flex-col">
              <span className="font-display-median text-header font-black text-wrap">
                {menuItem?.name}
              </span>
              <p className="leading-4 text-wrap">Dish long description</p>
              <span className="text-muted-foreground mb-1 text-wrap">
                {["item", "item2", "item3"].join(" • ")}
              </span>
              <div className="flex gap-1">
                <Badge variant="destructive">
                  <Beef /> Meat
                </Badge>
                <Badge variant="secondary">
                  <Wheat /> Gluten
                </Badge>
              </div>
              <h6 className="font-display text-primary mt-1 font-bold">
                {formatCurrency(menuItem?.price || 0, menuItem?.currency)}
              </h6>
            </div>
            <div className="flex shrink-0 items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => handleDecrement()}
                disabled={+amount <= 1}
              >
                <Minus className="h-3 w-3" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <Input
                type="number"
                min="1"
                value={amount}
                onChange={handleAmountChange}
                onBlur={handleBlur}
                className="h-8 w-12 [appearance:textfield] rounded-none text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => handleIncrement()}
                disabled={+amount >= 9}
              >
                <Plus className="h-3 w-3" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
          </div>
        </article>
        <DrawerFooter className="flex-row items-center justify-between">
          <div>
            <h6>Total price</h6>
            <span className="font-display text-primary font-bold">
              {formatCurrency(
                +amount * (menuItem?.price || 0),
                menuItem?.currency,
              )}
            </span>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleAddToTab(menuItem!, +amount)}>
              <CirclePlus /> Add
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddToTab(menuItem!, +amount)}
            >
              <ShoppingBasket /> Add and finish
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

// "use client";

// import { clsx } from "clsx";
// import { useState } from "react";
// import { Drawer } from "vaul";

// const snapPoints = ["148px", "355px", 1];

// export function AddToTapDrawer() {
//   const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

//   return (
//     <Drawer.Root
//       snapPoints={snapPoints}
//       activeSnapPoint={snap}
//       setActiveSnapPoint={setSnap}
//     >
//       <Drawer.Trigger className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white">
//         Open Drawer
//       </Drawer.Trigger>
//       <Drawer.Overlay className="fixed inset-0 bg-black/40" />
//       <Drawer.Portal>
//         <Drawer.Content
//           data-testid="content"
//           className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]"
//         >
//           Some text
//         </Drawer.Content>
//       </Drawer.Portal>
//     </Drawer.Root>
//   );
// }
