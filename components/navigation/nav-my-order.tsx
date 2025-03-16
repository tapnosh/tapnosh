"use client";

import "@/assets/styles/globals.css";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useOrder } from "@/context/OrderContext";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo, useState } from "react";
import { useCurrency } from "@/hooks/useCurrency";

export function MyOrderNavigation() {
  const [navOpen, setNavOpen] = useState("");
  const { items } = useOrder();
  const { formatCurrency, loading } = useCurrency();

  const amount = useMemo(
    () => items.reduce((prev, current) => prev + current.quantity, 0),
    [items],
  );
  const totalPrice = useMemo(
    () =>
      formatCurrency(
        items.reduce(
          (prev, current) => prev + current.price * current.quantity,
          0,
        ),
        "PLN",
      ),
    [formatCurrency, items],
  );

  return (
    <NavigationMenu
      value={navOpen}
      onValueChange={setNavOpen}
      className="ml-auto"
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            disabled={loading || !items.length}
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground data-[state=open]:hover:bg-primary/90 data-[state=open]:text-primary-foreground data-[state=open]:focus:bg-primary/90 data-[state=open]:bg-primary/90 relative shadow-xs disabled:pointer-events-none disabled:opacity-50"
          >
            My Order ({totalPrice})
            {amount ? (
              <Badge
                variant="destructive"
                className="absolute top-0 right-0 size-6 translate-x-1/3 -translate-y-1/3 transform rounded-full"
              >
                {amount}
              </Badge>
            ) : (
              <></>
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[calc(100vw-3.25rem)] list-none gap-3 p-4 md:w-[400px] lg:w-[500px]">
              <li className="row-span-2 flex h-full flex-col gap-3">
                <Link
                  href="/order/restaurant-name/12451245/order-status"
                  title="Order status"
                  onClick={() => setNavOpen("")}
                >
                  <Card className="bg-muted/50 hover:bg-muted flex-1 rounded-sm shadow-none">
                    <CardHeader>
                      <CardTitle>Order status</CardTitle>
                      <CardDescription className="inline-flex items-center gap-1.5">
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex size-2 rounded-full bg-sky-500"></span>
                        </span>
                        In progress
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
              <li className="flex h-full flex-col gap-3">
                <Link
                  href="/order/restaurant-name/confirm-order"
                  title="Typography"
                  onClick={() => setNavOpen("")}
                >
                  <Card className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-sm shadow-none">
                    <CardHeader>
                      <CardTitle>Confirm order</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-4">
                        {items.map((item) => (
                          <li key={item.id}>
                            <span>{item.quantity} x </span>
                            <span>{item.name}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
