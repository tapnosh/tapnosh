"use client";
import { OrderProvider } from "@/context/OrderContext";
import React from "react";

interface RestaurantLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export default function RestaurantLayout({ children }: RestaurantLayoutProps) {
  return <OrderProvider>{children}</OrderProvider>;
}
