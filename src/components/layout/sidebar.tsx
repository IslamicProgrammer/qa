"use client";

import type * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  LayoutDashboard,
  MessageSquare,
  Users,
  FolderTree,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Navigation types
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

type NavSubItem = {
  title: string;
  url: string;
  badge?: string;
};

type NavItem = {
  title: string;
  url: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  badge?: string;
  items?: NavSubItem[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

type NavSecondaryItem = {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const data: {
  navMain: NavGroup[];
  navSecondary: NavSecondaryItem[];
} = {
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          badge: "New",
        },
      ],
    },
    {
      title: "Content Management",
      items: [
        {
          title: "Questions & Answers",
          url: "/qa",
          icon: MessageSquare,
          items: [
            {
              title: "All Questions",
              url: "/qa/questions",
            },
            {
              title: "Pending Review",
              url: "/qa/pending",
              badge: "3",
            },
            {
              title: "Answered",
              url: "/qa/answered",
            },
          ],
        },
        {
          title: "Categories",
          url: "/categories",
          icon: FolderTree,
          items: [
            {
              title: "Manage Categories",
              url: "/categories",
            },
            {
              title: "Add Category",
              url: "/categories/new",
            },
          ],
        },
      ],
    },
    {
      title: "User Management",
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
          icon: Users,
          items: [
            {
              title: "All Users",
              url: "/dashboard/users/all",
            },
            {
              title: "Avatars",
              url: "/users/avatars",
            },
          ],
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Help & Support",
      url: "/dashboard/help",
      icon: HelpCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BookOpen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Islamic Q&A</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Admin Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/");

                  if (item.items) {
                    return (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={isActive}
                            >
                              {item.icon && <item.icon className="size-4" />}
                              <span>{item.title}</span>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="ml-auto text-xs"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.url}
                                  >
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                      {subItem.badge && (
                                        <Badge
                                          variant="secondary"
                                          className="ml-auto text-xs"
                                        >
                                          {subItem.badge}
                                        </Badge>
                                      )}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        asChild
                      >
                        <Link href={item.url}>
                          {item.icon && <item.icon className="size-4" />}
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-auto text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm">
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard/profile">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                  <AvatarFallback className="bg-primary/10 text-primary rounded-lg">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin User</span>
                  <span className="text-muted-foreground truncate text-xs">
                    admin@islamicqa.com
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
