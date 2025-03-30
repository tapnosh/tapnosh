"use client";

import { useLayoutEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useNotification } from "@/context/NotificationBar";
import { CollapsedBar } from "./bar-collapsed";
import { ExpandedBar } from "./bar-expanded/bar-expanded";
import { useNoshBar } from "@/hooks/useNoshBar";
import { useContentHeight } from "@/hooks/useContentHeight";
import React from "react";

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
  notifications: { open: boolean; content: React.ReactNode }[];
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
}: BarMainProps) {
  if (notifications.some(({ open }) => open)) {
    return (
      <div className="p-4">
        <div className="invisible">
          {notifications.map(({ content }, index) => (
            <React.Fragment key={`notification-${index}`}>
              {content}
            </React.Fragment>
          ))}
        </div>
        <motion.div
          layout
          key="morph-notification"
          transition={{ type: "tween", delay: 0.1 }}
          initial={{ bottom: "-100%" }}
          animate={{ bottom: 0 }}
          exit={{ bottom: -150 }}
          className="absolute right-0 flex h-full w-full items-center justify-center"
        >
          {notifications.map(({ content }, index) => (
            <React.Fragment key={`notification-${index}`}>
              {content}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
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

function NoshBarWrapper() {
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
    notifications,
  ]);

  return (
    <motion.div
      layout
      layoutId="morph"
      whileTap={!isBarExpanded ? { scale: 0.95 } : {}}
      animate={{
        opacity: 1,
        height: contentHeight,
        y: 0,
        ...(notifications.length > 0
          ? { borderRadius: "3rem" }
          : { borderRadius: "2rem" }),
      }}
      style={{
        maxWidth: "32rem",
        backgroundColor: "var(--primary)",
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
          totalAmount={totalAmount}
          totalOrderAmount={totalOrderAmount}
          handleStatusChange={(id) => handleStatusChange(id, closeNotification)}
          notifications={notifications.filter(({ open }) => open)}
          isBarExpanded={isBarExpanded}
          closeNotification={closeNotification}
          expandWithTab={expandWithTab}
        />
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
