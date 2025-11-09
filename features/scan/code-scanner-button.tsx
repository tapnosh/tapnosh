"use client";

import { type VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/forms/button";
import { useNotification } from "@/context/NotificationBar";
import { CodeScanner } from "@/features/scan/code-scanner";

export function ButtonScanner(
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
      isLoading?: boolean;
    },
) {
  const { openNotification } = useNotification();
  return (
    <Button
      {...props}
      onClick={(e) => {
        openNotification(<CodeScanner />, {
          persistent: true,
          animation: false,
        });
        props.onClick?.(e);
      }}
    >
      Order
    </Button>
  );
}
