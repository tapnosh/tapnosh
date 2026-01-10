"use client";

import {
  BookOpen,
  Home,
  LifeBuoy,
  MapIcon,
  Send,
  Utensils,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/layout/sidebar";
import { LanguageSelector } from "@/features/navigation/nav-language-selector";
import { NavMain } from "@/features/navigation/nav-main";
import { NavUser } from "@/features/navigation/nav-user";
import { Link } from "@/i18n/routing";

import { NavManagement } from "./nav-management";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = React.useMemo(
    () => ({
      navMain: [
        {
          title: "Home",
          url: "/",
          icon: Home,
          isActive: true,
        },
        {
          title: "Restaurants",
          url: "/restaurants",
          icon: Utensils,
        },
        {
          title: "Map",
          url: "/map",
          icon: MapIcon,
        },
        {
          title: "Documentation",
          url: "/docs",
          icon: BookOpen,
        },
      ],
      navSecondary: [
        {
          title: "Support",
          url: "/support",
          icon: LifeBuoy,
        },
        {
          title: "Contact Us",
          url: "/contact",
          icon: Send,
        },
      ],
    }),
    [],
  );

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-logo truncate text-2xl">tapnosh.</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavManagement />
        <LanguageSelector />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
