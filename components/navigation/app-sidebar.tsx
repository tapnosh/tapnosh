"use client";

import * as React from "react";
import {
  BookOpen,
  CirclePlus,
  Home,
  LifeBuoy,
  Map,
  PanelsTopLeft,
  Send,
  Utensils,
} from "lucide-react";

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
  const params = useParams<{ restaurant: string }>();

  const data = React.useMemo(
    () => ({
      navMain: [
        {
          title: "Home",
          url: "/",
          icon: Home,
          isActive: true,
          // items: [
          //   {
          //     title: "History",
          //     url: "#",
          //   },
          //   {
          //     title: "Starred",
          //     url: "#",
          //   },
          //   {
          //     title: "Settings",
          //     url: "#",
          //   },
          // ],
        },
        {
          title: "Restaurants",
          url: "/restaurants",
          icon: Utensils,
          items: params.restaurant
            ? [
                {
                  title: `Restaurant ${params.restaurant}`,
                  url: `/restaurants/${params.restaurant}`,
                },
              ]
            : undefined,
        },
        {
          title: "Documentation",
          url: "/docs",
          icon: BookOpen,
          // items: [
          //   {
          //     title: "Introduction",
          //     url: "#",
          //   },
          //   {
          //     title: "Get Started",
          //     url: "#",
          //   },
          //   {
          //     title: "Tutorials",
          //     url: "#",
          //   },
          //   {
          //     title: "Changelog",
          //     url: "#",
          //   },
          // ],
        },
        // {
        //   title: "Settings",
        //   url: "#",
        //   icon: Settings2,
        //   items: [
        //     {
        //       title: "General",
        //       url: "#",
        //     },
        //     {
        //       title: "Team",
        //       url: "#",
        //     },
        //     {
        //       title: "Billing",
        //       url: "#",
        //     },
        //     {
        //       title: "Limits",
        //       url: "#",
        //     },
        //   ],
        // },
      ],
      navSecondary: [
        {
          title: "Support",
          url: "#",
          icon: LifeBuoy,
        },
        {
          title: "Feedback",
          url: "#",
          icon: Send,
        },
      ],
      projects: [
        {
          name: "Overview",
          url: "#",
          icon: PanelsTopLeft,
        },
        {
          name: "Add a restaurant",
          url: "/restaurants/add",
          icon: CirclePlus,
          isAuth: true,
        },
        {
          name: "My restaurants",
          url: "#",
          icon: Map,
          items: [
            {
              title: "General",
              url: "#",
            },
            {
              title: "Team",
              url: "#",
            },
            {
              title: "Billing",
              url: "#",
            },
            {
              title: "Limits",
              url: "#",
            },
          ],
        },
        // {
        //   name: "Brand Customization",
        //   url: "#",
        //   icon: Palette,
        // },
        // {
        //   name: "Placed Orders",
        //   url: "#",
        //   icon: ListOrdered,
        // },
        // {
        //   name: "Order Tracker", // maybe "Order Status" "Order Flow" "Order Status Board"
        //   url: "#",
        //   icon: CircleDotDashed,
        // },
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
        <NavProjects projects={data.projects} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        <LanguageSelector />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
