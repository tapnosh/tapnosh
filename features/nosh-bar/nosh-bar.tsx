"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect } from "react";

import { Notification, useNotification } from "@/context/NotificationBar";
import { useOrder } from "@/context/OrderContext";
import { useContentHeight } from "@/hooks/useContentHeight";
import { useNoshBar } from "@/hooks/useNoshBar";
import type { CartItem, OrderItem } from "@/types/nosh-bar";
import { cn } from "@/utils/cn";

import { CollapsedBar } from "./bar-collapsed";
import { ExpandedBar } from "./bar-expanded/bar-expanded";

type BarMainProps = {
  activeTab: "cart" | "orders";
  setActiveTab: (tab: "cart" | "orders") => void;
  expandWithTab: (tab: "cart" | "orders") => void;
  cartItems: CartItem[];
  orderItems: OrderItem[];
  status: string;
  isOrderListExpanded: boolean;
  setIsOrderListExpanded: (expanded: boolean) => void;
  contentHeight: number;
  startContentHeight: number;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  setStartContentHeight: (height: number) => void;
  setContentHeight: (height: number) => void;
  handleCollapse: () => void;
  removeCartItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  openNotification: (content: React.ReactNode) => string;
  totalItems: number;
  totalAmount: number;
  totalOrderAmount: number;
  handleStatusChange: (id: string) => void;
  notifications: Notification[];
  isBarExpanded: boolean;
  closeNotification: (id: string) => void;
};

function NoshBarMain({
  activeTab,
  setActiveTab,
  cartItems,
  orderItems,
  status,
  isOrderListExpanded,
  setIsOrderListExpanded,
  contentHeight,
  startContentHeight,
  isDragging,
  setIsDragging,
  setStartContentHeight,
  setContentHeight,
  handleCollapse,
  removeCartItem,
  updateQuantity,
  openNotification,
  totalItems,
  totalAmount,
  totalOrderAmount,
  handleStatusChange,
  notifications,
  isBarExpanded,
  expandWithTab,
  closeNotification,
}: BarMainProps) {
  if (notifications.some(({ open }) => open)) {
    return (
      <AnimatePresence>
        <motion.div
          layout
          key="morph-notification"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.2, type: "spring", damping: 16 }}
          className="text-primary-foreground flex max-w-[calc(100vw-2rem)] flex-col gap-4 p-4 sm:max-w-md"
          onClick={() => closeNotification(notifications[0].id)}
        >
          {notifications.map(({ content }, index) => (
            <div
              key={`notification-${index}`}
              className="flex h-full w-full items-center justify-center"
            >
              {content}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  }
  if (isBarExpanded) {
    return (
      <ExpandedBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItems={cartItems}
        orderItems={orderItems}
        status={status}
        isOrderListExpanded={isOrderListExpanded}
        setIsOrderListExpanded={setIsOrderListExpanded}
        contentHeight={contentHeight}
        startContentHeight={startContentHeight}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        setStartContentHeight={setStartContentHeight}
        setContentHeight={setContentHeight}
        handleCollapse={handleCollapse}
        removeCartItem={removeCartItem}
        updateQuantity={updateQuantity}
        openNotification={openNotification}
        totalItems={totalItems}
        totalAmount={totalAmount}
        totalOrderAmount={totalOrderAmount}
        handleStatusChange={handleStatusChange}
      />
    );
  }
  return (
    <CollapsedBar
      totalAmount={totalAmount}
      totalItems={totalItems}
      expandWithTab={expandWithTab}
      orderItems={orderItems}
    />
  );
}

export function NoshBar() {
  const { notifications, openNotification, closeNotification } =
    useNotification();
  const {
    activeTab,
    setActiveTab,
    orderItems,
    status,
    isOrderListExpanded,
    setIsOrderListExpanded,
    isBarExpanded,
    isAnimating,
    totalOrderAmount,
    removeCartItem,
    updateQuantity,
    expandWithTab,
    handleCollapse,
    handleStatusChange,
  } = useNoshBar();

  const { items: cartItems, totalItems, totalPrice } = useOrder();

  const {
    contentRef,
    contentHeight,
    setContentHeight,
    startContentHeight,
    setStartContentHeight,
    isDragging,
    setIsDragging,
  } = useContentHeight();

  useLayoutEffect(() => {
    if (contentRef.current) {
      const newHeight = contentRef.current.offsetHeight;
      setContentHeight(newHeight);
      setStartContentHeight(newHeight);
    }
  }, [
    isBarExpanded,
    activeTab,
    isOrderListExpanded,
    cartItems,
    orderItems,
    contentRef,
    setContentHeight,
    setStartContentHeight,
    notifications,
  ]);

  return (
    <AnimatePresence>
      {totalItems === 0 && orderItems.length === 0 && !notifications.length ? (
        <></>
      ) : (
        <motion.div
          key="nosh-bar-morph"
          layout
          layoutId="morph"
          whileTap={!isBarExpanded ? { scale: 0.95 } : {}}
          animate={{
            opacity: 1,
            height: contentHeight,
            y: 0,
            borderRadius: "2rem",
          }}
          style={{
            maxWidth: "32rem",
            backgroundColor: "var(--primary)",
            boxShadow: "0 0 0.5rem rgba(0,0,0,0.25)",
          }}
          initial={{
            y: "100%",
            boxShadow: "0 0 0 rgba(0,0,0,0)",
          }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{
            default: {
              ...(!isDragging
                ? {
                    duration: 0.3,
                    type: "spring",
                    damping: 16,
                  }
                : { duration: 0 }),
            },
            layout: {
              duration: 0.3,
              type: "spring",
              damping: 16,
            },
          }}
          className={cn(
            "sticky right-4 bottom-4 left-4 z-[5000] mx-auto mt-auto overflow-hidden",
            isAnimating && "pointer-events-none",
          )}
        >
          <div ref={contentRef}>
            <NoshBarMain
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              cartItems={cartItems}
              orderItems={orderItems}
              status={status}
              isOrderListExpanded={isOrderListExpanded}
              setIsOrderListExpanded={setIsOrderListExpanded}
              contentHeight={contentHeight}
              startContentHeight={startContentHeight}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              setStartContentHeight={setStartContentHeight}
              setContentHeight={setContentHeight}
              handleCollapse={handleCollapse}
              removeCartItem={removeCartItem}
              updateQuantity={updateQuantity}
              openNotification={openNotification}
              totalItems={totalItems}
              totalAmount={totalPrice}
              totalOrderAmount={totalOrderAmount}
              handleStatusChange={(id) =>
                handleStatusChange(id, closeNotification)
              }
              notifications={notifications.filter(({ open }) => open)}
              isBarExpanded={isBarExpanded}
              closeNotification={closeNotification}
              expandWithTab={expandWithTab}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
