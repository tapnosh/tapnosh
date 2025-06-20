"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/context/OrderContext";
import Image from "next/image";
import { Minus, Plus, ShoppingBasket, X } from "lucide-react";
import { Dispatch, useState } from "react";
import { MenuItem } from "@/types/menu/Menu";
import { useCurrency } from "@/hooks/useCurrency";
import { useNotification } from "@/context/NotificationBar";
import { AnimatePresence, motion } from "motion/react";
import { RemoveScroll } from "react-remove-scroll";
import { categoryIcons } from "./menu-item";

export const MenuItemModal = ({
  open,
  setOpen,
  menuItem,
  canBeAddedToTab = false,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
  menuItem?: MenuItem;
  canBeAddedToTab?: boolean;
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
    const price = formatCurrency(
      item.price.amount * _amount,
      item.price.currency,
    );

    addItem(item, _amount);
    setOpen(false);

    openNotification(
      <div className="flex items-center justify-between gap-4 px-2">
        <div className="flex flex-col">
          <span className="text-primary-foreground font-semibold">
            Added {item.name}
          </span>
          <span className="text-sm">For {price}</span>
        </div>
        <ShoppingBasket className="h-6 w-6" />
      </div>,
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <RemoveScroll forwardProps>
            <motion.div
              layout
              drag="y"
              dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.offset.y < -100) {
                  setOpen(false);
                }
              }}
              layoutId={`item-${menuItem?.id}`}
              style={{
                borderRadius: "32px",
                maxHeight: "calc(100dvh - 2rem)",
                backgroundColor: "var(--background)",
                width: "calc(100% - 2rem)",
              }}
              transition={{
                type: "spring",
                duration: 0.6,
              }}
              role="dialog"
              aria-modal="true"
              className="sticky top-4 right-4 bottom-4 left-4 z-50 mx-auto flex max-w-[calc(100vw-2rem)] flex-col items-stretch overflow-clip border shadow-[0px_0px_0.5rem_rgba(0,0,0,0.15)] sm:max-w-md"
            >
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:bg-muted-foreground hover:text-secondary absolute top-4 right-4 z-10 rounded-full p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <article className="flex flex-col overflow-auto p-4 pb-0">
                <header>
                  <div className="flex flex-wrap gap-1.5">
                    {menuItem?.categories?.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs"
                      >
                        <span className="mr-1">
                          {
                            categoryIcons[
                              category as keyof typeof categoryIcons
                            ]
                          }
                        </span>
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <motion.h2
                    className="font-display-median mt-3 font-normal"
                    initial={{ opacity: 0, y: "50%" }}
                    animate={{ opacity: 1, y: "0%" }}
                    exit={{ opacity: 0, y: "50%" }}
                    transition={{ delay: 0.2, type: "tween", duration: 0.3 }}
                  >
                    {menuItem?.name}
                  </motion.h2>
                  <motion.span
                    className="text-muted-foreground mt-1 block italic"
                    initial={{ opacity: 0, y: "50%" }}
                    animate={{ opacity: 1, y: "0%" }}
                    exit={{ opacity: 0, y: "50%" }}
                    transition={{ delay: 0.3, type: "tween", duration: 0.3 }}
                  >
                    {menuItem?.description}
                  </motion.span>
                </header>
                <div className="pb-4">
                  <div className="flex flex-col pt-3">
                    <motion.h6
                      initial={{ opacity: 0, y: "50%" }}
                      animate={{ opacity: 1, y: "0%" }}
                      exit={{ opacity: 0, y: "50%" }}
                      transition={{ delay: 0.4, type: "tween", duration: 0.3 }}
                      className="font-display-median text-foreground block uppercase"
                    >
                      Ingredients
                    </motion.h6>
                    <motion.span
                      initial={{ opacity: 0, y: "50%" }}
                      animate={{ opacity: 1, y: "0%" }}
                      exit={{ opacity: 0, y: "50%" }}
                      transition={{ delay: 0.5, type: "tween", duration: 0.3 }}
                      className="text-muted-foreground mb-1 block"
                    >
                      {menuItem?.ingredients?.join(" • ")}
                    </motion.span>
                  </div>
                  {menuItem?.image && (
                    <motion.div
                      layoutId={`item-image-${menuItem?.id}`}
                      className="relative aspect-square flex-1 pt-2"
                    >
                      <Image
                        src={
                          Array.isArray(menuItem.image)
                            ? menuItem.image[0]?.url
                            : menuItem.image
                        }
                        alt={menuItem.name}
                        width={80}
                        height={80}
                        quality={50}
                        className="pointer-events-none h-full w-full rounded-md object-cover"
                      />
                    </motion.div>
                  )}
                </div>
                {canBeAddedToTab && (
                  <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.2, type: "tween", duration: 0.3 }}
                    className="border-muted bg-background sticky bottom-0 mt-auto flex items-end justify-between border-t pt-2 pb-4"
                  >
                    <div className="flex flex-col items-start gap-2">
                      <h3 className="font-display mt-1 font-normal md:text-2xl">
                        {formatCurrency(
                          menuItem?.price.amount || 0,
                          menuItem?.price.currency,
                        )}
                      </h3>
                      <div className="border-muted-foreground flex items-center overflow-clip rounded-md border">
                        <button
                          onClick={() => handleDecrement()}
                          className="hover:bg-muted p-2 transition-colors"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        <span className="px-3">{amount}</span>
                        <button
                          onClick={() => handleIncrement()}
                          className="hover:bg-muted p-2 transition-colors"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/75 text-primary-foreground"
                        onClick={() => handleAddToTab(menuItem!, +amount)}
                      >
                        <ShoppingBasket /> Add{" "}
                        {formatCurrency(
                          +amount * (menuItem?.price.amount || 0),
                          menuItem?.price.currency,
                        )}
                      </Button>
                    </div>
                  </motion.footer>
                )}
              </article>
            </motion.div>
          </RemoveScroll>
        </>
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
