import { CartItem, OrderItem } from "@/components/nosh-bar/nosh-bar";
import { useState } from "react";

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

export function useNoshBar() {
  const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");
  const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [status, setStatus] = useState<string>("in-progress");
  const [isOrderListExpanded, setIsOrderListExpanded] = useState(false);
  const [isBarExpanded, setIsBarExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalOrderAmount = orderItems.reduce(
    (sum, item) => sum + item.price,
    0,
  );

  const removeCartItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

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
      setOrderItems(sampleOrderItems);
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
