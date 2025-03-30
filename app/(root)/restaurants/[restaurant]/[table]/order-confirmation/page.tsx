"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useOrder } from "@/context/OrderContext";

export default function ConfirmOrder() {
  const { items } = useOrder();

  return (
    <section className="section">
      <h1>Confirm order</h1>
      <h6 className="mb-6">Double check wheter your order is correct</h6>

      {items.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="mb-2 text-xl font-medium">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart to continue shopping
          </p>
          <Button asChild>
            <Link href="/restaurants/restaurant-name/12341234">
              Continue Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <div className="p-4 md:p-6">
              <div className="text-muted-foreground mb-4 hidden grid-cols-12 gap-4 text-sm font-medium md:grid">
                <div className="col-span-5">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1" />
              </div>

              <Separator className="mb-4" />

              {items.map((item) => (
                <div key={item.id} className="mb-6 last:mb-0">
                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                    <div className="col-span-1 md:col-span-5">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="font-black">{item.name}</span>
                          <p className="text-muted-foreground text-sm md:hidden">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:col-span-2 md:block">
                      ${item.price.toFixed(2)}
                    </div>

                    <div className="col-span-1 flex md:col-span-2">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => {}}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={() => {}}
                          className="h-8 w-12 [appearance:textfield] rounded-none text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => {}}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                    </div>

                    <div className="col-span-1 text-right md:col-span-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    <div className="col-span-1 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {}}
                        className="text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardContent className="mb-4 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>110</span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-stretch justify-end gap-4 sm:flex-row">
              <Button asChild variant="outline">
                <Link href="/restaurants/restaurant-name/12341234">
                  Go Back to Menu
                </Link>
              </Button>
              <Button>
                <Link href="/restaurants/restaurant-name/12341234/order-status">
                  Confirm Order
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </section>
  );
}
