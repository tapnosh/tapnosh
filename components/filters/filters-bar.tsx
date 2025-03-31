"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Settings2Icon, X } from "lucide-react";
import { FiltersDrawer } from "./filters-drawer";

export function FiltersBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-12 flex flex-wrap items-center justify-between gap-3">
      <Tabs className="overflow-auto" defaultValue="appetizers">
        <TabsList className="bg-primary-foreground text-primary/75">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="appetizers"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
          >
            Appetizers
          </TabsTrigger>
          <TabsTrigger
            value="pasta"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
          >
            Pasta
          </TabsTrigger>
          <TabsTrigger
            value="mains"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
          >
            Main Courses
          </TabsTrigger>
          <TabsTrigger
            value="desserts"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
          >
            Desserts
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2">
        <Button onClick={() => setOpen(true)}>
          <Settings2Icon />
          Filters
        </Button>
        <Button variant="outline">
          <X />
          Clear all
        </Button>
      </div>

      <FiltersDrawer open={open} setOpen={(value) => setOpen(value)} />
    </div>
  );
}
