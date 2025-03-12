"use client";
import { OrderProvider } from "@/context/OrderContext";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default function RestaurantLayout({ children }: LayoutProps) {
  return <OrderProvider>{children}</OrderProvider>;
}
