"use client";

import {
  BookOpen,
  Home,
  LifeBuoy,
  MapIcon,
  Send,
  Utensils,
} from "lucide-react";
import { useTranslations } from "next-intl";
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
  const tNavItems = useTranslations("navigation.items");

  const data = React.useMemo(
    () => ({
      navMain: [
        {
          title: tNavItems("home"),
          url: "/",
          icon: Home,
          isActive: true,
        },
        {
          title: tNavItems("restaurants"),
          url: "/restaurants",
          icon: Utensils,
        },
        {
          title: tNavItems("map"),
          url: "/map",
          icon: MapIcon,
        },
        {
          title: tNavItems("documentation"),
          url: "/docs",
          icon: BookOpen,
        },
      ],
      navSecondary: [
        {
          title: tNavItems("support"),
          url: "/support",
          icon: LifeBuoy,
        },
        {
          title: tNavItems("contactUs"),
          url: "/contact",
          icon: Send,
        },
      ],
    }),
    [tNavItems],
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
