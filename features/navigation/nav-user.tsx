"use client";

import { SignInButton, SignOutButton } from "@clerk/nextjs";

import { BadgeCheck, ChevronsUpDown, LogIn, LogOut } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/data-display/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/navigation/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/layout/sidebar";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/data-display/skeleton";
import { useMemo } from "react";

export function NavUser() {
  const { isSignedIn, user, isLoaded } = useUser();

  const { isMobile } = useSidebar();

  const userEmail = useMemo(
    () => user?.primaryEmailAddress?.emailAddress ?? "",
    [user],
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-4 p-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-2 w-[90%]" />
          <Skeleton className="h-2 w-[40%]" />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex">
        <SignInButton>
          <SidebarMenuButton size="lg">
            <LogIn />
            Sign in
          </SidebarMenuButton>
        </SignInButton>
      </div>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 overflow-clip rounded-full">
                <AvatarImage
                  src={user?.imageUrl}
                  alt={user?.firstName ?? "User profile image"}
                />
                <AvatarFallback className="rounded-lg">TN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.firstName ?? ""} {user?.lastName ?? ""}
                </span>
                <span className="truncate text-xs">{userEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.firstName ?? "User profile image"}
                  />
                  <AvatarFallback className="rounded-full">TN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.firstName ?? ""} {user?.lastName ?? ""}
                  </span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
