"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/context/OrderContext";
import Image from "next/image";
import { Minus, Plus, ShoppingBasket } from "lucide-react";
import { Dispatch, useState } from "react";
import { MenuItem } from "@/types/menu";
import { useCurrency } from "@/hooks/useCurrency";
import { useNotification } from "@/context/NotificationBar";
import { AnimatePresence, motion } from "motion/react";
import { RemoveScroll } from "react-remove-scroll";
import { categoryIcons } from "./menu-item";

export const AddToTabModal = ({
  open,
  setOpen,
  menuItem,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
  menuItem?: MenuItem;
}) => {
  const [amount, setAmount] = useState<number | string>(1);
  const { openNotification } = useNotification();
  const { addItem } = useOrder();

  const { formatCurrency } = useCurrency();

  const handleIncrement = () => {
    setAmount((prev) => (+prev >= 9 ? prev : +prev + 1));
  };

  const handleDecrement = () => {
    setAmount((prev) => (+prev <= 1 ? prev : +prev - 1));
  };

  const handleAddToTab = (item: MenuItem, amnt?: number | string) => {
    const _amount = amnt ? +amnt : 1;
    const price = formatCurrency(item.price * _amount, item.currency);

    addItem(item, _amount);
    setOpen(false);

    openNotification(
      <div className="flex w-full items-center justify-between gap-4 px-6">
        <div className="flex flex-col">
          <span className="text-primary-foreground font-semibold">
            Added {item.name}
          </span>
          <span className="text-sm">For {price}</span>
        </div>
      </div>,
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <RemoveScroll forwardProps>
          <motion.div
            layout
            drag="y"
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                setOpen(false);
              }
            }}
            layoutId={`item-${menuItem?.id}`}
            style={{
              borderRadius: "32px",
              maxHeight: "calc(100vh - 6rem)",
              maxWidth: "32rem",
              backgroundColor: "var(--primary)",
            }}
            transition={{
              type: "spring",
              duration: 0.6,
            }}
            className="text-primary-foreground fixed top-4 right-4 bottom-32 left-4 z-50 m-auto flex flex-col items-stretch p-4 shadow-[0px_0px_0.5rem_rgba(0,0,0,0.15)]"
          >
            <header>
              <div className="flex flex-wrap gap-1.5">
                {menuItem?.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    <span className="mr-1">
                      {categoryIcons[category as keyof typeof categoryIcons]}
                    </span>
                    {category}
                  </Badge>
                ))}
              </div>
              <motion.h2
                className="font-display-median mt-2 font-normal"
                layoutId={`item-title-${menuItem?.id}`}
              >
                {menuItem?.name}
              </motion.h2>
              <motion.span
                className="text-accent italic"
                layoutId={`item-description-${menuItem?.id}`}
              >
                {menuItem?.description}
              </motion.span>
            </header>
            <article>
              <div className="flex flex-col pt-2">
                <h6 className="text-accent uppercase">Ingredients</h6>
                <span className="text-primary-foreground mb-1">
                  {menuItem?.ingredients.join(" • ")}
                </span>
              </div>
              {menuItem?.image && (
                <motion.div
                  layoutId={`item-image-${menuItem?.id}`}
                  className="relative aspect-square flex-1 pt-2"
                >
                  <Image
                    src={menuItem.image}
                    alt={menuItem.name}
                    width={80}
                    height={80}
                    quality={50}
                    className="h-full w-full rounded-md object-cover"
                  />
                </motion.div>
              )}
            </article>
            <footer className="border-accent sticky bottom-0 mt-auto flex items-end justify-between border-t pt-2">
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-primary-foreground mt-1 font-normal">
                  {formatCurrency(menuItem?.price || 0, menuItem?.currency)}
                </h3>
                <div className="border-accent flex items-center rounded-md border">
                  <button
                    onClick={() => handleDecrement()}
                    className="hover:bg-accent p-2 transition-colors"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="px-3">{amount}</span>
                  <button
                    onClick={() => handleIncrement()}
                    className="hover:bg-accent p-2 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="bg-primary-foreground hover:bg-primary-foreground/75 text-primary"
                  onClick={() => handleAddToTab(menuItem!, +amount)}
                >
                  <ShoppingBasket /> Add{" "}
                  {formatCurrency(
                    +amount * (menuItem?.price || 0),
                    menuItem?.currency,
                  )}
                </Button>
              </div>
            </footer>
          </motion.div>
        </RemoveScroll>
      )}
    </AnimatePresence>
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
