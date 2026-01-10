"use client";

import { useSession } from "@clerk/nextjs";
import { ChevronRight, type LucideIcon } from "lucide-react";

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
  useSidebar,
} from "@/components/ui/layout/sidebar";
import { Link, usePathname } from "@/i18n/routing";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    isAuth?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { isSignedIn } = useSession();
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>My nosh.</SidebarGroupLabel>
      <SidebarMenu>
        {items
          .filter((item) => (item.isAuth ? isSignedIn : true))
          .map((item) => (
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
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
