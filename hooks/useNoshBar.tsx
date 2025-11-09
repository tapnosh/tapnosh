import { OrderItem } from "@/features/nosh-bar/nosh-bar";
import { useOrder } from "@/context/OrderContext";
import { useState } from "react";

export function useNoshBar() {
  const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");
  const {
    items: cartItems,
    clearOrder,
    removeItem,
    updateQuantity,
  } = useOrder();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [status, setStatus] = useState<string>("in-progress");
  const [isOrderListExpanded, setIsOrderListExpanded] = useState(false);
  const [isBarExpanded, setIsBarExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price.amount * item.quantity,
    0,
  );
  const totalOrderAmount = orderItems.reduce(
    (sum, item) => sum + item.price,
    0,
  );

  const removeCartItem = (id: string) => {
    removeItem(id);
  };

  const expandWithTab = (tab: "cart" | "orders") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveTab(tab);
    setIsBarExpanded(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleCollapse = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsBarExpanded(false);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleStatusChange = (
    id: string,
    closeNotification: (id: string) => void,
  ) => {
    setStatus("in-progress");
    setTimeout(() => {
      setStatus("confirmed");
      setOrderItems((prev) => [
        ...cartItems.map((item) => ({
          ...item,
          status: "preparing" as const,
          price: item.price.amount,
        })),
        ...prev,
      ]);
      clearOrder();
      closeNotification(id);
      setActiveTab("orders");
    }, 2000);
  };

  return {
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
  };
}
