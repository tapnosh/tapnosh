"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderItem } from "./nosh-bar";

export function MyTabSummary({
  orderItems,
  expandWithTab,
}: {
  orderItems: OrderItem[];
  expandWithTab: (tab: "orders") => void;
}) {
  const totalOrderAmount = orderItems.reduce(
    (sum, item) => sum + item.price,
    0,
  );

  return (
    <motion.button
      className={cn(
        "group text-primary hover:bg-primary-foreground/75 bg-primary-foreground relative flex flex-1 cursor-pointer flex-col overflow-hidden rounded-3xl p-3 transition-all",
      )}
      onClick={() => expandWithTab("orders")}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold whitespace-nowrap">My Tab</span>
      </div>
      <div className="flex w-full items-end justify-between">
        <div className="flex flex-col items-start">
          <span className="text-xs leading-3">{orderItems.length} items</span>
          <span className="text-sm font-medium">
            ${totalOrderAmount.toFixed(2)}
          </span>
        </div>
        <ReceiptText />
      </div>
    </motion.button>
  );
}

export function CollapsedBar({
  totalItems,
  expandWithTab,
  orderItems,
  totalAmount,
}: {
  totalItems: number;
  expandWithTab: (tab: "cart" | "orders") => void;
  orderItems: OrderItem[];
  totalAmount: number;
}) {
  return (
    <AnimatePresence>
      <motion.div
        layout
        key="collapsed-bar"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.2, type: "spring", damping: 16 }}
        className="flex w-[calc(100vw-2rem)] max-w-md justify-between gap-1.5 p-2"
      >
        {orderItems.length > 0 && (
          <MyTabSummary expandWithTab={expandWithTab} orderItems={orderItems} />
        )}
        <motion.button
          className={cn(
            "group hover:bg-primary/90 bg-primary text-primary-foreground relative flex flex-1 cursor-pointer flex-col overflow-hidden rounded-lg p-3 transition-all",
          )}
          onClick={() => expandWithTab("cart")}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold whitespace-nowrap">Confirm Order</span>
          </div>
          <div className="flex w-full flex-1 items-end justify-between">
            <div className="flex flex-col items-start">
              <span className="text-accent text-xs leading-3">
                {totalItems} items
              </span>
              <span className="text-sm font-medium">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <ArrowRight />
          </div>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
