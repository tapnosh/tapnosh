"use client";

import { Trash2, Minus, Plus, ArrowRight, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartItem, OrderItem } from "@/components/nosh-bar/nosh-bar";
import { OrderConfirmationStatus } from "@/components/nosh-bar/bar-expanded/order-confirmation-status";
import { useCurrency } from "@/hooks/useCurrency";

const statusColors = {
  preparing: "bg-amber-500",
  ready: "bg-green-500",
  delivered: "bg-blue-500",
  cancelled: "bg-red-500",
};

const statusText = {
  preparing: "Preparing",
  ready: "Ready for pickup",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

type CartItemProps = {
  item: CartItem;
  updateQuantity: (id: string, quantity: number) => void;
  removeCartItem: (id: string) => void;
};

function CartItemRow({ item, updateQuantity, removeCartItem }: CartItemProps) {
  const { formatCurrency } = useCurrency();
  return (
    <div className="flex items-center justify-between rounded-lg transition-all">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-accent text-sm">
            {formatCurrency(item.price.amount, item.price.currency)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="border-accent flex items-center rounded-md border">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="hover:bg-accent p-1 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-2 text-sm">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="hover:bg-accent p-1 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => removeCartItem(item.id)}
          className="text-accent hover:bg-destructive/10 hover:text-destructive rounded-md p-1 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

type CartContentProps = {
  cartItems: CartItem[];
  totalItems: number;
  totalAmount: number;
  updateQuantity: (id: string, quantity: number) => void;
  removeCartItem: (id: string) => void;
  openNotification: (content: React.ReactNode) => string;
  status: string;
  handleStatusChange: (id: string) => void;
};

export function CartContent({
  cartItems,
  totalItems,
  totalAmount,
  updateQuantity,
  removeCartItem,
  openNotification,
  status,
  handleStatusChange,
}: CartContentProps) {
  return (
    <div className="flex max-h-[40vh] flex-col">
      {cartItems.length > 0 ? (
        <div className="mb-4 flex-1 space-y-3 overflow-y-auto">
          {cartItems.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeCartItem={removeCartItem}
            />
          ))}
        </div>
      ) : (
        <div className="text-accent-foreground border-accent mb-4 rounded-lg border border-dashed py-3 text-center text-sm">
          Your cart is empty
        </div>
      )}
      <div className="border-accent flex items-center justify-between border-t pt-3">
        <div className="flex flex-col">
          <span className="text-accent text-sm">
            {totalItems} {totalItems === 1 ? "item" : "items"} in cart
          </span>
          <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
        </div>
        <Button
          size="lg"
          variant="secondary"
          className="group bg-primary-foreground hover:bg-primary-foreground/75 text-primary gap-2 px-6"
          disabled={cartItems.length === 0}
          onClick={() => {
            const id = openNotification(
              <div className="flex w-full items-center justify-between gap-4 px-2">
                <span className="text-wave font-semibold">
                  Sending to kitchen
                </span>
                <OrderConfirmationStatus status={status} />
              </div>,
            );
            handleStatusChange(id);
          }}
        >
          Confirm Order
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}

type OrderItemProps = {
  item: OrderItem;
};

export function OrderItemRow({ item }: OrderItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={cn(
            "h-3 w-3 rounded-full p-0 transition-all hover:scale-125",
            statusColors[item.status],
          )}
        />
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-accent text-xs">{statusText[item.status]}</span>
        </div>
      </div>
      <span className="font-medium">${item.price.toFixed(2)}</span>
    </div>
  );
}

type OrdersContentProps = {
  orderItems: OrderItem[];
  isOrderListExpanded: boolean;
  setIsOrderListExpanded: (expanded: boolean) => void;
  totalOrderAmount: number;
};

export function OrdersContent({
  orderItems,
  totalOrderAmount,
}: OrdersContentProps) {
  return (
    <div className="flex max-h-[40vh] flex-col space-y-3">
      <div className="flex flex-1 flex-col space-y-3 overflow-y-auto">
        {orderItems.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </div>
      {orderItems.length > 0 && (
        <div className="border-accent flex items-center justify-between border-t pt-3">
          <div className="flex flex-col">
            <span className="text-accent text-sm">
              {orderItems.length} {orderItems.length === 1 ? "item" : "items"}{" "}
              ordered
            </span>
            <span className="text-xl font-bold">
              ${totalOrderAmount.toFixed(2)}
            </span>
          </div>
          <Button
            size="lg"
            variant="secondary"
            className="group bg-primary-foreground hover:bg-primary-foreground/75 text-primary gap-2 px-6"
          >
            Pay ${totalOrderAmount.toFixed(2)}
            <Wallet className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
