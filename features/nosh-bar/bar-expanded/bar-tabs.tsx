"use client";

import { type LucideIcon, ReceiptText, ShoppingBasket } from "lucide-react";

import { Separator } from "@/components/ui/data-display/separator";
import type { OrderItem } from "@/types/nosh-bar";
import { cn } from "@/utils/cn";

type TabButtonProps = {
  icon: LucideIcon;
  label: string;
  itemCount: number;
  amount: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
};

function TabButton({
  icon: Icon,
  label,
  itemCount,
  amount,
  isActive,
  onClick,
  disabled,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex flex-1 flex-col items-center justify-center overflow-hidden py-3 text-sm font-medium transition-colors",
        isActive
          ? "text-primary-foreground"
          : "text-accent hover:text-primary-foreground disabled:text-accent/50",
      )}
    >
      <div className="flex items-center gap-1">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs">
        <span>{itemCount} items</span>
        <Separator
          orientation="vertical"
          className="bg-accent group-disabled:bg-accent/50 group-hover:bg-primary-foreground"
        />
        <span className="font-bold">${amount.toFixed(2)}</span>
      </div>
      <div
        className={cn(
          "bg-primary absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300",
          isActive ? "w-full" : "group-hover:w-full",
        )}
      />
    </button>
  );
}

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
        <TabButton
          icon={ReceiptText}
          label="My Tab"
          itemCount={orderItems.length}
          amount={totalOrderAmount}
          isActive={activeTab === "orders"}
          onClick={() => setActiveTab("orders")}
        />
      )}
      <TabButton
        icon={ShoppingBasket}
        label="Confirm Order"
        itemCount={totalItems}
        amount={totalAmount}
        isActive={activeTab === "cart"}
        onClick={() => setActiveTab("cart")}
        disabled={totalItems === 0}
      />
    </menu>
  );
}
