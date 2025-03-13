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
import { cn } from "@/lib/utils";
import { Beef, ShoppingBasket } from "lucide-react";
import { Dispatch, useState } from "react";

const snapPoints = ["355px", 1];

export const AddToTapDrawer = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
}) => {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  const { items } = useOrder();

  const isMobile = useIsMobile();

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
      snapPoints={isMobile ? snapPoints : []}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      fadeFromIndex={0}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-header font-black">My Tap</DrawerTitle>
          <DrawerDescription>
            This is a summary of your order.
          </DrawerDescription>
        </DrawerHeader>
        <article
          className={cn("p-4 pb-0", {
            "overflow-y-auto": snap === 1,
            "overflow-hidden": snap !== 1,
          })}
        >
          {items.map((item) => {
            return (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex gap-4 py-2 flex-1 justify-between items-center">
                  <div className="flex flex-col">
                    <h6>{item.name}</h6>
                    <span className="text-muted-foreground mb-1 text-wrap text-sm">
                      {item.ingredients.join(" • ")}
                    </span>
                    <div className="flex gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} className="badge badge-destructive">
                          <Beef /> {tag}
                        </Badge>
                      ))}
                    </div>
                    <h6 className="font-display font-bold mt-1 text-primary">
                      {(item.price * item.quantity).toLocaleString("pl-PL", {
                        style: "currency",
                        currency: item.currency,
                      })}
                    </h6>
                  </div>
                  <span className="font-black">{item.quantity}</span>
                </div>
              </div>
            );
          })}
        </article>
        <DrawerFooter>
          <Button>
            <ShoppingBasket /> Checkout
          </Button>
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
