"use client";

import { CartItem, OrderItem } from "@/components/nosh-bar/nosh-bar";
import { BarHeader } from "./bar-header";
import { TabNavigation } from "./bar-tab-navigation";
import { CartContent, OrdersContent } from "./bar-content";

type ExpandedBarProps = {
  activeTab: "cart" | "orders";
  setActiveTab: (tab: "cart" | "orders") => void;
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
};

export function ExpandedBar({
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
}: ExpandedBarProps) {
  return (
    <div>
      <BarHeader
        activeTab={activeTab}
        handleCollapse={handleCollapse}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        contentHeight={contentHeight}
        startContentHeight={startContentHeight}
        setStartContentHeight={setStartContentHeight}
        setContentHeight={setContentHeight}
      />

      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orderItems={orderItems}
        totalOrderAmount={totalOrderAmount}
        totalItems={totalItems}
        totalAmount={totalAmount}
      />

      <article className="text-primary-foreground p-4">
        {activeTab === "cart" ? (
          <CartContent
            cartItems={cartItems}
            totalItems={totalItems}
            totalAmount={totalAmount}
            updateQuantity={updateQuantity}
            removeCartItem={removeCartItem}
            openNotification={openNotification}
            status={status}
            handleStatusChange={handleStatusChange}
          />
        ) : (
          <OrdersContent
            orderItems={orderItems}
            isOrderListExpanded={isOrderListExpanded}
            setIsOrderListExpanded={setIsOrderListExpanded}
            totalOrderAmount={totalOrderAmount}
          />
        )}
      </article>
    </div>
  );
}
