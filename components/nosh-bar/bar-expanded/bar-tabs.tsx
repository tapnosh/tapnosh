"use client";

import { ReceiptText, ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { OrderItem } from "@/components/nosh-bar/nosh-bar";

type TabNavigationProps = {
  activeTab: "cart" | "orders";
  setActiveTab: (tab: "cart" | "orders") => void;
  orderItems: OrderItem[];
  totalOrderAmount: number;
  totalItems: number;
  totalAmount: number;
};

export function TabNavigation({
  activeTab,
  setActiveTab,
  orderItems,
  totalOrderAmount,
  totalItems,
  totalAmount,
}: TabNavigationProps) {
  return (
    <menu className="text-primary-foreground border-accent flex justify-center border-b">
      {orderItems.length > 0 && (
        <button
          onClick={() => setActiveTab("orders")}
          className={cn(
            "group relative flex flex-1 flex-col items-center justify-center overflow-hidden py-3 text-sm font-medium transition-colors",
            activeTab === "orders"
              ? "text-primary-foreground"
              : "text-accent hover:text-foreground",
          )}
        >
          <div className="flex items-center gap-1">
            <ReceiptText className="h-4 w-4" />
            <span>My Tab</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            <span>{orderItems.length} items</span>
            <Separator orientation="vertical" className="bg-accent" />
            <span className="font-bold">${totalOrderAmount.toFixed(2)}</span>
          </div>
          <div
            className={cn(
              "bg-primary absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300",
              activeTab === "orders" ? "w-full" : "group-hover:w-full",
            )}
          />
        </button>
      )}
      <button
        onClick={() => setActiveTab("cart")}
        className={cn(
          "group relative flex flex-1 flex-col items-center justify-center overflow-hidden py-3 text-sm font-medium transition-colors",
          activeTab === "cart"
            ? "text-primary-foreground"
            : "text-accent hover:text-foreground",
        )}
      >
        <div className="flex items-center gap-1">
          <ShoppingBasket className="h-4 w-4" />
          <span>Confirm Order</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          <span>{totalItems} items</span>
          <Separator orientation="vertical" className="bg-accent" />
          <span className="font-bold">${totalAmount.toFixed(2)}</span>
        </div>
        <div
          className={cn(
            "bg-primary absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300",
            activeTab === "cart" ? "w-full" : "group-hover:w-full",
          )}
        />
      </button>
    </menu>
  );
}
