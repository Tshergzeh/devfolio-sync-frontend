"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from "./ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUsersLinks } from "./nav-users-links";
import { Container, LayoutDashboard, UserPlus, Users } from "lucide-react";
import { NavUser } from "./nav-user";

const user = localStorage.getItem("user")!;
const userData = JSON.parse(user);

const data = {
  user: {
    name: userData.name,
    email: userData.email,
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
  ],
  navUsersLinks: [
    {
      title: "All Users",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Add User",
      url: "/dashboard/users/add",
      icon: UserPlus,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <Container className="size-5!" />
                <span className="text-base font-semibold">Devfolio Sync</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavUsersLinks items={data.navUsersLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}