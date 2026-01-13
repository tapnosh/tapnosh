"use client";

import { useSession } from "@clerk/nextjs";
import {
  ChevronRight,
  CirclePlus,
  Store,
  QrCode,
  FileText,
  Palette,
  type LucideIcon,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

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
import { Link, usePathname } from "@/i18n/routing";

type MyRestaurantsSidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
};

/*
const staticItems = [
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
*/

export function NavManagement() {
  const t = useTranslations("navigation.items");
  const tSections = useTranslations("navigation.sections");
  const { isSignedIn } = useSession();
  const { data: restaurants, isLoading } = useRestaurantsQuery({
    enabled: isSignedIn,
  });
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const staticItems = [
    {
      title: t("overview"),
      url: "/my-restaurants",
      icon: Store,
    },
    {
      title: t("createRestaurant"),
      url: "/restaurants/add",
      icon: CirclePlus,
    },
  ];

  const getRestaurantSubItems = (restaurantId: string) => [
    {
      title: t("scannableMenu"),
      url: `/my-restaurants/${restaurantId}/scannable-menu`,
      icon: QrCode,
    },
    {
      title: t("details"),
      url: `/my-restaurants/${restaurantId}/details`,
      icon: FileText,
    },
    {
      title: t("pageBuilder"),
      url: `/my-restaurants/${restaurantId}/builder`,
      icon: Palette,
    },
    {
      title: t("settings"),
      url: `/my-restaurants/${restaurantId}/settings`,
      icon: Settings,
    },
  ];

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

  const toggleItem = useCallback((itemTitle: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  }, []);

  if (!isSignedIn) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{tSections("management")}</SidebarGroupLabel>
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
              open={
                openItems?.[item.title] ||
                pathname.includes(item.url) ||
                item.items?.some((subItem) => pathname.includes(subItem.url))
              }
              onOpenChange={() => toggleItem(item.title)}
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
