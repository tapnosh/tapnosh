"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Trash2,
  Minus,
  Plus,
  X,
  ArrowRight,
  ReceiptText,
  ShoppingBasket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "../ui/separator";
import { MyTabSummary } from "./my-tab";
import { ConfirmationStatus } from "./confirmation-status";
import { useNotification } from "@/context/NotificationBar";

// Types for our cart and order items
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  status: "preparing" | "ready" | "delivered" | "cancelled";
};

// Sample data for demonstration
const sampleCartItems: CartItem[] = [
  { id: "1", name: "Burger", price: 8.99, quantity: 1 },
  { id: "2", name: "Fries", price: 3.99, quantity: 2 },
  { id: "3", name: "Soda", price: 1.99, quantity: 1 },
  { id: "4", name: "Coca cola", price: 1.99, quantity: 1 },
  { id: "5", name: "Test", price: 1.99, quantity: 1 },
];

const sampleOrderItems: OrderItem[] = [
  { id: "101", name: "Pizza", price: 12.99, status: "delivered" },
  { id: "102", name: "Salad", price: 7.99, status: "ready" },
  { id: "103", name: "Ice Cream", price: 4.99, status: "preparing" },
  { id: "234", name: "Ice Cream", price: 4.99, status: "preparing" },
  { id: "345", name: "Ice Cream", price: 4.99, status: "preparing" },
  { id: "546", name: "Ice Cream", price: 4.99, status: "preparing" },
];

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

export function NoshBar() {
  const { notifications, openNotification, closeNotification } =
    useNotification();
  const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");
  const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems);
  // const [orderItems] = useState<OrderItem[]>(sampleOrderItems);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [status, setStatus] = useState<string>("in-progress");
  const [isOrderListExpanded, setIsOrderListExpanded] = useState(false);
  const [isBarExpanded, setIsBarExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Ref and state to measure content height
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [startContentHeight, setStartContentHeight] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Re-measure height on state changes that affect content layout.
  useLayoutEffect(() => {
    if (contentRef.current) {
      const newHeight = contentRef.current.offsetHeight;
      setContentHeight(newHeight);
      setStartContentHeight(newHeight);
    }
  }, [isBarExpanded, activeTab, isOrderListExpanded, cartItems, orderItems]);

  // Totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalOrderAmount = orderItems.reduce(
    (sum, item) => sum + item.price,
    0,
  );

  // Remove an item from cart
  const removeCartItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeCartItem(id);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  // Expand bar with chosen tab
  const expandWithTab = (tab: "cart" | "orders") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveTab(tab);
    setIsBarExpanded(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Collapse bar
  const handleCollapse = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsBarExpanded(false);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleStatusChange = (id: string) => {
    setStatus("in-progress");

    setTimeout(() => {
      setStatus("confirmed");
      setOrderItems(sampleOrderItems);
      closeNotification(id);
      setActiveTab("orders");
    }, 2000);
  };

  return (
    <>
      <AnimatePresence>
        {notifications.length ? (
          <motion.div
            layout
            layoutId="morph"
            whileTap={{ scale: 0.95 }}
            transition={{
              duration: 0.3,
              type: "spring",
              damping: 16,
            }}
            animate={{
              backgroundColor: "var(--primary)",
              height: "4rem",
            }}
            style={{
              borderRadius: "3rem",
              minWidth: "16rem",
              width: "auto",
              maxWidth: "32rem",
            }}
            onClick={() => closeNotification(notifications[0].id)}
            className="text-primary-foreground sticky right-4 bottom-4 left-4 z-50 mx-auto mt-auto flex items-center overflow-hidden whitespace-nowrap shadow-[0px_0px_0.5rem_rgba(0,0,0,0.15)]"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, type: "spring" }}
              style={{ flex: 1 }}
            >
              {notifications.map(({ content }) => content)}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            whileTap={!isBarExpanded ? { scale: 0.95 } : {}}
            animate={{
              height: contentHeight,
              y: 0,
              backgroundColor: "var(--primary)",
              width: "calc(100% - 2rem)",
              boxShadow: "0 0 0.5rem rgba(0,0,0,0.25)",
            }}
            style={{
              maxWidth: "32rem",
              borderRadius: "2rem",
            }}
            initial={{ y: "100%", boxShadow: "0 0 0 rgba(0,0,0,0)" }}
            exit={{ y: "100%" }}
            transition={{
              ...(!isDragging
                ? {
                    duration: 0.3,
                    type: "spring",
                    damping: 16,
                  }
                : { duration: 0 }),
              borderRadius: { type: "tween" },
              layout: { duration: 0.5, type: "spring", damping: 16 },
            }}
            className={cn(
              "sticky right-4 bottom-4 left-4 z-50 mx-auto mt-auto overflow-hidden",
              isAnimating && "pointer-events-none",
            )}
          >
            <div ref={contentRef}>
              {isBarExpanded ? (
                // Expanded view
                <div>
                  {/* Header */}
                  <motion.div
                    drag="y"
                    onDragStart={() => {
                      setIsDragging(true);
                      setStartContentHeight(contentHeight);
                    }}
                    onDrag={(_, info) => {
                      const dragHeight = Math.max(
                        startContentHeight - info.offset.y,
                        90,
                      );
                      if (
                        dragHeight >= 90 &&
                        dragHeight <= window.innerHeight - 12 &&
                        Math.abs(dragHeight - contentHeight) > 2
                      ) {
                        setContentHeight(dragHeight);
                      }
                    }}
                    onDragEnd={(_, info) => {
                      setIsDragging(false);
                      if (info.velocity.y > 500 || contentHeight < 150) {
                        handleCollapse();
                      } else {
                        setContentHeight(startContentHeight);
                      }
                    }}
                    dragElastic={0}
                    dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    className="text-primary-foreground flex items-center justify-between p-4"
                  >
                    <h3 className="text-lg font-semibold">
                      {activeTab === "cart" ? "Confirm Order" : "My Tab"}
                    </h3>
                    <button
                      onClick={handleCollapse}
                      className="text-primary-foreground hover:bg-accent hover:text-secondary rounded-full p-1 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </motion.div>
                  {/* Tab Navigation */}
                  <div className="text-primary-foreground border-accent grid grid-cols-2 border-b">
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={cn(
                        "group relative flex flex-col items-center justify-center overflow-hidden py-3 text-sm font-medium transition-colors",
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
                        <Separator
                          orientation="vertical"
                          className="bg-accent"
                        />
                        <span className="font-bold">
                          ${totalOrderAmount.toFixed(2)}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "bg-primary absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300",
                          activeTab === "orders"
                            ? "w-full"
                            : "group-hover:w-full",
                        )}
                      />
                    </button>
                    <button
                      onClick={() => setActiveTab("cart")}
                      className={cn(
                        "group relative flex flex-col items-center justify-center overflow-hidden py-3 text-sm font-medium transition-colors",
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
                        <Separator
                          orientation="vertical"
                          className="bg-accent"
                        />
                        <span className="font-bold">
                          ${totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "bg-primary absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300",
                          activeTab === "cart"
                            ? "w-full"
                            : "group-hover:w-full",
                        )}
                      />
                    </button>
                  </div>
                  {/* Tab Content */}
                  <div className="text-primary-foreground p-4">
                    {activeTab === "cart" ? (
                      <div className="flex max-h-[40vh] flex-col">
                        {cartItems.length > 0 ? (
                          <div className="mb-4 flex-1 space-y-3 overflow-y-auto">
                            {cartItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {item.name}
                                    </span>
                                    <span className="text-accent text-sm">
                                      ${item.price.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="border-accent flex items-center rounded-md border">
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity - 1,
                                        )
                                      }
                                      className="hover:bg-accent p-1 transition-colors"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-2 text-sm">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity + 1,
                                        )
                                      }
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
                              {totalItems} {totalItems === 1 ? "item" : "items"}{" "}
                              in cart
                            </span>
                            <span className="text-xl font-bold">
                              ${totalAmount.toFixed(2)}
                            </span>
                          </div>
                          <Button
                            size="lg"
                            variant="secondary"
                            className="group bg-primary-foreground hover:bg-primary-foreground/75 text-primary gap-2 px-6"
                            disabled={cartItems.length === 0}
                            onClick={() => {
                              const id = openNotification(
                                <div className="flex w-full items-center justify-between gap-4 px-6">
                                  <span className="text-wave font-semibold">
                                    Sending to kitchen
                                  </span>
                                  <ConfirmationStatus status={status} />
                                </div>,
                                { persistent: true },
                              );
                              handleStatusChange(id);
                            }}
                          >
                            Confirm Order
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex max-h-[40vh] flex-col space-y-3">
                        <div className="border-accent mb-3 flex items-center justify-between border-b pb-2">
                          <span className="text-accent text-sm">
                            {orderItems.length}{" "}
                            {orderItems.length === 1 ? "item" : "items"} ordered
                          </span>
                          <span className="text-xl font-bold">
                            ${totalOrderAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col space-y-3 overflow-y-auto">
                          {(isOrderListExpanded
                            ? orderItems
                            : orderItems.slice(0, 2)
                          ).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "h-3 w-3 rounded-full p-0 transition-all hover:scale-125",
                                    statusColors[item.status],
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                  <span className="text-accent text-xs">
                                    {statusText[item.status]}
                                  </span>
                                </div>
                              </div>
                              <span className="font-medium">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        {orderItems.length > 2 && (
                          <button
                            onClick={() =>
                              setIsOrderListExpanded(!isOrderListExpanded)
                            }
                            className="text-primary-foreground hover:bg-primary/10 flex w-full items-center justify-center gap-1 rounded-md py-2 text-sm font-medium transition-colors"
                          >
                            {isOrderListExpanded ? "See Less" : "See More"}
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-300",
                                isOrderListExpanded ? "rotate-180" : "",
                              )}
                            />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Collapsed view
                <motion.div
                  layout
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  exit={{ y: -20 }}
                  transition={{ duration: 0.2, type: "spring", damping: 16 }}
                  className="flex justify-between gap-1.5 p-2"
                >
                  {orderItems.length > 0 && (
                    <MyTabSummary
                      expandWithTab={expandWithTab}
                      orderItems={orderItems}
                    />
                  )}
                  {/* "Confirm Order" summary */}
                  <motion.button
                    className={cn(
                      "group hover:bg-primary/90 bg-primary text-primary-foreground relative flex flex-1 cursor-pointer flex-col overflow-hidden rounded-lg p-3 transition-all",
                    )}
                    onClick={() => expandWithTab("cart")}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold whitespace-nowrap">
                        Confirm Order
                      </span>
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
