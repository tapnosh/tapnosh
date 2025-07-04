"use client";

import * as React from "react";
import { BookOpen, Home, LifeBuoy, Send, Utensils } from "lucide-react";

import { LanguageSelector } from "@/components/navigation/nav-language-selector";
import { NavMain } from "@/components/navigation/nav-main";
import { NavUser } from "@/components/navigation/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NavProjects } from "./nav-projects";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ slug: string }>();

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
          items: params.slug
            ? [
                {
                  title: `${params.slug}`,
                  url: `/restaurants/${params.slug}`,
                },
                {
                  title: `${params.slug} menu`,
                  url: `/restaurants/${params.slug}/menu`,
                },
              ]
            : undefined,
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
    [params],
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
        <NavProjects />
        <LanguageSelector />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
