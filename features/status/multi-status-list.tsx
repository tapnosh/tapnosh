"use client";

import { Check, Clock, Utensils } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/data-display/badge";
import { Card, CardContent } from "@/components/ui/data-display/card";
import { cn } from "@/utils/cn";

type Status = "received" | "preparing" | "done";

interface StatusItem {
  id: string;
  name: string;
  status: Status;
  timestamp: string;
  details?: string;
}

interface MultiStatusListProps {
  items: StatusItem[];
  onStatusChange?: (id: string, newStatus: Status) => void;
  interactive?: boolean;
}

export default function MultiStatusList({ items = [] }: MultiStatusListProps) {
  const [statusItems] = useState<StatusItem[]>(items);

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "received":
        return <Clock className="h-4 w-4" />;
      case "preparing":
        return <Utensils className="h-4 w-4" />;
      case "done":
        return <Check className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "received":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "preparing":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }
  };

  return (
    <div className="w-full space-y-4">
      {statusItems.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          No items to display
        </div>
      ) : (
        <div className="grid gap-4">
          {statusItems.map((item) => (
            <Card key={item.id} className="overflow-hidden py-0">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Item details */}
                  <div className="flex-1 border-b p-4 sm:border-r sm:border-b-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-primary font-black">
                          {item.name}
                        </span>
                        <p className="text-muted-foreground text-sm">
                          {item.details}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          "flex items-center gap-1",
                          getStatusColor(item.status),
                        )}
                      >
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status}</span>
                      </Badge>
                    </div>
                    <div className="text-muted-foreground mt-2 text-xs">
                      {item.timestamp}
                    </div>
                  </div>
                </div>
                <div className="flex h-2 w-full">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      item.status === "received"
                        ? "w-1/3 bg-blue-500"
                        : item.status === "preparing"
                          ? "w-2/3 bg-amber-500"
                          : "w-full bg-green-500",
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
