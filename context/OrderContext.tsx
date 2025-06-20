"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { MenuItem } from "@/types/menu/Menu";

type OrderItem = MenuItem & {
  quantity: number;
};

interface OrderContextType {
  items: OrderItem[];
  isSessionActive: boolean;
  toggleSession: (decision?: boolean) => void;
  addItem: (item: Omit<OrderItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearOrder: () => void;
  totalItems: number;
  totalPrice: number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isSessionActive, setSessionActive] = useState(true);

  const toggleSession = (decision?: boolean) => {
    setSessionActive((prev) => (decision ? decision : !prev));
  };

  const addItem = (item: Omit<OrderItem, "quantity">, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);

      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }

      return [...currentItems, { ...item, quantity }];
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    );
  };

  const clearOrder = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + item.price.amount * item.quantity,
    0,
  );

  const value = {
    items,
    isSessionActive,
    toggleSession,
    addItem,
    removeItem,
    updateQuantity,
    clearOrder,
    totalItems,
    totalPrice,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

export default OrderContext;
