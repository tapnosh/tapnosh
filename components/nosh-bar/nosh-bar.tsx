"use client";

import { useLayoutEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useNotification } from "@/context/NotificationBar";
import { CollapsedBar } from "./bar-collapsed";
import { ExpandedBar } from "./bar-expanded/bar-expanded";
import { useNoshBar } from "@/hooks/useNoshBar";
import { useContentHeight } from "@/hooks/useContentHeight";

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

export function NoshBarWrapper() {
  const { notifications, openNotification, closeNotification } =
    useNotification();
  const {
    activeTab,
    setActiveTab,
    cartItems,
    orderItems,
    status,
    isOrderListExpanded,
    setIsOrderListExpanded,
    isBarExpanded,
    isAnimating,
    totalItems,
    totalAmount,
    totalOrderAmount,
    removeCartItem,
    updateQuantity,
    expandWithTab,
    handleCollapse,
    handleStatusChange,
  } = useNoshBar();

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
  ]);

  if (notifications.some(({ open }) => open)) {
    return (
      // Notification bar
      <motion.div
        layout
        layoutId="morph"
        whileTap={{ scale: 0.95 }}
        transition={{
          duration: 0.2,
          type: "spring",
          damping: 16,
        }}
        animate={{
          height: "4rem",
        }}
        style={{
          backgroundColor: "var(--primary)",
          borderRadius: "3rem",
          minWidth: "16rem",
          maxWidth: "32rem",
        }}
        onClick={() => closeNotification(notifications[0].id)}
        className="text-primary-foreground sticky right-4 bottom-4 left-4 z-50 mx-auto mt-auto flex items-center justify-center overflow-hidden whitespace-nowrap shadow-[0px_0px_0.5rem_rgba(0,0,0,0.15)]"
      >
        <motion.div layout>
          {notifications.map(({ content }) => content)}
        </motion.div>
      </motion.div>
    );
  }

  return (
    // Nosh bar
    <motion.div
      layout
      layoutId="morph"
      whileTap={!isBarExpanded ? { scale: 0.95 } : {}}
      animate={{ opacity: 1, height: contentHeight, y: 0 }}
      style={{
        maxWidth: "32rem",
        borderRadius: "2rem",
        backgroundColor: "var(--primary)",
        width: "calc(100% - 2rem)",
        boxShadow: "0 0 0.5rem rgba(0,0,0,0.25)",
      }}
      initial={{
        opacity: 0,
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
          borderRadius: { type: "tween" },
        },
      }}
      className={cn(
        "sticky right-4 bottom-4 left-4 z-50 mx-auto mt-auto overflow-hidden",
        isAnimating && "pointer-events-none",
      )}
    >
      <div ref={contentRef}>
        {isBarExpanded ? (
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
            handleStatusChange={(id) =>
              handleStatusChange(id, closeNotification)
            }
          />
        ) : (
          <CollapsedBar
            totalAmount={totalAmount}
            totalItems={totalItems}
            expandWithTab={expandWithTab}
            orderItems={orderItems}
          />
        )}
      </div>
    </motion.div>
  );
}

export function NoshBar() {
  return (
    <AnimatePresence>
      <NoshBarWrapper />
    </AnimatePresence>
  );
}
