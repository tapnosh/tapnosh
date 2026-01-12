"use client";

import { Minus, Plus, ShoppingBasket, TimerOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Dispatch, useMemo, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";

import { Badge } from "@/components/ui/data-display/badge";
import { Button } from "@/components/ui/forms/button";
import { ShareButton } from "@/components/ui/forms/share-button";
import { useNotification } from "@/context/NotificationBar";
import { useOrder } from "@/context/OrderContext";
import { useCurrency } from "@/hooks/useCurrency";
import { MenuItem } from "@/types/menu/Menu";

import { DisableMenuItemModal } from "./disable-menu-item-modal";
import { ItemAvailabilityStatus } from "./menu-item";
import { getAllergenIcon, getFoodTypeIcon } from "./utils/icons";

export const MenuItemModal = ({
  open,
  setOpen,
  menuItem,
  canBeAddedToTab = false,
  restaurantSlug,
  restaurantId,
  availabilityStatus = "available",
  showDisableOption = false,
  onDisableSuccess,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
  menuItem?: MenuItem;
  canBeAddedToTab?: boolean;
  restaurantSlug?: string;
  restaurantId?: string;
  availabilityStatus?: ItemAvailabilityStatus;
  showDisableOption?: boolean;
  onDisableSuccess?: () => void;
}) => {
  const [amount, setAmount] = useState<number | string>(1);
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const { openNotification } = useNotification();
  const { addItem } = useOrder();

  const { formatCurrency } = useCurrency();
  const tCategories = useTranslations("categories");
  const tMenu = useTranslations("restaurants.details");

  const isAvailable = useMemo(
    () => availabilityStatus === "available",
    [availabilityStatus],
  );

  const shareUrl = useMemo(() => {
    if (!restaurantSlug || !menuItem) return "";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/restaurants/${restaurantSlug}/${menuItem.id}`;
  }, [restaurantSlug, menuItem]);

  const imageSrc = useMemo(
    () =>
      Array.isArray(menuItem?.image) ? menuItem.image[0]?.url : menuItem?.image,
    [menuItem?.image],
  );

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

  const handleDisableSuccess = () => {
    setDisableModalOpen(false);
    setOpen(false);
    onDisableSuccess?.();
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
              className="sticky top-4 right-4 bottom-4 left-4 z-50 mx-auto flex max-w-[calc(100vw-2rem)] flex-col items-stretch overflow-clip border shadow-[0px_0px_0.5rem_rgba(0,0,0,0.15)] sm:max-w-xl"
            >
              <div className="absolute top-3 right-3 z-10 flex gap-2">
                {showDisableOption && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDisableModalOpen(true)}
                    className="hover:bg-destructive/20 hover:text-destructive text-muted-foreground rounded-full bg-white/80 backdrop-blur-sm transition-colors dark:bg-black/50"
                    title="Disable menu item"
                  >
                    <TimerOff className="size-5" />
                  </Button>
                )}
                {restaurantSlug && shareUrl && (
                  <ShareButton
                    url={shareUrl}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted-foreground hover:text-secondary text-muted-foreground rounded-full bg-white/80 backdrop-blur-sm transition-colors dark:bg-black/50"
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:bg-muted-foreground hover:text-secondary rounded-full bg-white/80 p-1 backdrop-blur-sm transition-colors dark:bg-black/50"
                >
                  <X className="size-5" />
                </Button>
              </div>
              <article className="flex flex-col overflow-auto p-4 pb-0">
                <header>
                  <motion.h2
                    className="font-display-median mt-8 font-normal sm:mt-10"
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

                  {/* Allergens */}
                  {menuItem?.allergens && menuItem.allergens.length > 0 && (
                    <motion.div
                      className="mt-3 flex flex-wrap items-center gap-1"
                      initial={{ opacity: 0, y: "50%" }}
                      animate={{ opacity: 1, y: "0%" }}
                      exit={{ opacity: 0, y: "50%" }}
                      transition={{
                        delay: 0.35,
                        type: "tween",
                        duration: 0.3,
                      }}
                    >
                      {menuItem.allergens.map((allergen) => {
                        const AllergenIcon = getAllergenIcon(allergen.name);
                        return (
                          <Badge
                            key={allergen.id}
                            variant="default"
                            title={tCategories(allergen.name)}
                          >
                            <AllergenIcon />
                            <span>{tCategories(allergen.name)}</span>
                          </Badge>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Food Types */}
                  {menuItem?.food_types && menuItem.food_types.length > 0 && (
                    <motion.div
                      className="mt-2 flex flex-wrap items-center gap-1"
                      initial={{ opacity: 0, y: "50%" }}
                      animate={{ opacity: 1, y: "0%" }}
                      exit={{ opacity: 0, y: "50%" }}
                      transition={{
                        delay: 0.4,
                        type: "tween",
                        duration: 0.3,
                      }}
                    >
                      {menuItem.food_types.map((foodType) => {
                        const FoodTypeIcon = getFoodTypeIcon(foodType.name);
                        return (
                          <Badge
                            key={foodType.id}
                            variant="outline"
                            title={tCategories(foodType.name)}
                          >
                            <FoodTypeIcon />
                            <span>{tCategories(foodType.name)}</span>
                          </Badge>
                        );
                      })}
                    </motion.div>
                  )}
                </header>
                {!isAvailable && (
                  <motion.div
                    className="text-muted-foreground mt-3 text-sm italic"
                    initial={{ opacity: 0, y: "50%" }}
                    animate={{ opacity: 1, y: "0%" }}
                    exit={{ opacity: 0, y: "50%" }}
                    transition={{
                      delay: 0.45,
                      type: "tween",
                      duration: 0.3,
                    }}
                  >
                    {availabilityStatus === "disabled"
                      ? tMenu("itemDisabled")
                      : tMenu("notServedNow")}
                  </motion.div>
                )}
                <div className="pb-4">
                  {menuItem && imageSrc && (
                    <motion.div
                      layoutId={`item-image-${menuItem?.id}`}
                      className="relative aspect-square flex-1 pt-2"
                    >
                      <Image
                        src={imageSrc}
                        alt={menuItem.name}
                        width={1024}
                        height={1024}
                        quality={90}
                        priority
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4="
                        className="pointer-events-none h-full w-full rounded-2xl object-cover"
                      />
                    </motion.div>
                  )}
                </div>
                {canBeAddedToTab && isAvailable && (
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
      <DisableMenuItemModal
        open={disableModalOpen}
        onOpenChange={setDisableModalOpen}
        menuItem={menuItem}
        restaurantId={restaurantId || ""}
        onSuccess={handleDisableSuccess}
      />
    </AnimatePresence>
  );
};
