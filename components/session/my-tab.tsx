"use client";

import { motion } from "motion/react";
import { ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderItem } from "./session-bar";

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
        "group hover:bg-muted/50 bg-accent relative flex flex-1 cursor-pointer flex-col overflow-hidden rounded-3xl p-3 transition-all",
      )}
      onClick={() => expandWithTab("orders")}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold">My Tab</span>
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
