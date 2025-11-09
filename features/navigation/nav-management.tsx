"use client";

import { useSession } from "@clerk/nextjs";
import {
  ChevronRight,
  CirclePlus,
  PanelsTopLeft,
  Store,
  QrCode,
  FileText,
  Palette,
  type LucideIcon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/layout/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/layout/sidebar";
import { useRestaurantsQuery } from "@/hooks/api/restaurant/useRestaurants";

type MyRestaurantsSidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
};

const staticItems = [
  {
    title: "Overview",
    url: "/my-restaurants",
    icon: PanelsTopLeft,
  },
  {
    title: "Create Restaurant",
    url: "/restaurants/add",
    icon: CirclePlus,
  },
];

const getRestaurantSubItems = (restaurantId: string) => [
  {
    title: "Scannable Menu",
    url: `/my-restaurants/${restaurantId}/scannable-menu`,
    icon: QrCode,
  },
  {
    title: "Details",
    url: `/my-restaurants/${restaurantId}/details`,
    icon: FileText,
  },
  {
    title: "Page Builder",
    url: `/my-restaurants/${restaurantId}/builder`,
    icon: Palette,
  },
  {
    title: "Settings",
    url: `/my-restaurants/${restaurantId}/settings`,
    icon: Settings,
  },
];

export function NavManagement() {
  const { data: restaurants, isLoading } = useRestaurantsQuery();
  const { isSignedIn } = useSession();
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();

  const allItems: MyRestaurantsSidebarItem[] = [
    ...staticItems,
    ...(restaurants
      ? restaurants
          .filter((restaurant) => restaurant.id)
          .map((restaurant) => ({
            title: restaurant.name,
            url: `/restaurants/${restaurant.slug}`,
            icon: Store,
            items: getRestaurantSubItems(restaurant.id!),
          }))
      : []),
  ];

  if (!isSignedIn) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading ? (
          <>
            <SidebarMenuSkeleton showIcon />
            <SidebarMenuSkeleton showIcon />
            <SidebarMenuSkeleton showIcon />
          </>
        ) : (
          allItems.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={
                pathname.includes(item.url) ||
                item.items?.some((subItem) => pathname.includes(subItem.url))
              }
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === item.url}
                  asChild
                  tooltip={item.title}
                  onClick={() => setOpenMobile(false)}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              isActive={pathname === subItem.url}
                              asChild
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
