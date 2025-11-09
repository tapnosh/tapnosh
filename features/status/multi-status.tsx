"use client";

import { useState } from "react";
import MultiStatusList from "./multi-status-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Button } from "@/components/ui/forms/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

type Status = "received" | "preparing" | "done";

interface StatusItem {
  id: string;
  name: string;
  status: Status;
  timestamp: string;
  details?: string;
}

export default function MultiStatusDemo() {
  const [items, setItems] = useState<StatusItem[]>([
    {
      id: "1",
      name: "Tikka masala",
      status: "received",
      timestamp: "Today at 10:30 AM",
      details: "3 x 49.99 zł",
    },
    {
      id: "2",
      name: "Coca-Cola",
      status: "preparing",
      timestamp: "Today at 10:30 AM",
      details: "1 x 20.99 zł",
    },
    {
      id: "3",
      name: "Chicken biryani",
      status: "done",
      timestamp: "Today at 10:30 AM",
      details: "2 x 12.99 zł",
    },
  ]);

  const handleStatusChange = (id: string, newStatus: Status) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Order Status Tracker</CardTitle>
          <CardDescription>Track the status of multiple orders</CardDescription>
        </div>
        <Button asChild className="flex items-center gap-1">
          <Link href="/restaurants/restaurant-name/123452">
            <PlusCircle className="h-4 w-4" />
            <span>Order Again</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <MultiStatusList
          items={items}
          onStatusChange={handleStatusChange}
          interactive={true}
        />
      </CardContent>
    </Card>
  );
}
