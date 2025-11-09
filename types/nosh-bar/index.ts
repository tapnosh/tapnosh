export type CartItem = {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  quantity: number;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  status: "preparing" | "ready" | "delivered" | "cancelled";
};
