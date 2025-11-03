"use client";

import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export function SiteHeader() {
  const pathName = usePathname();

  const getPageTitle = () => {
    if (pathName === "/dashboard" || pathName === "/dashboard/") return "Dashboard";
    if (pathName.startsWith("/dashboard/users")) return "Users";
    if (pathName.startsWith("/dashboard/projects")) return "Projects";
    if (pathName.startsWith("/dashboard/settings")) return "Settings";
    if (pathName.match(/^\/dashboard\/projects\/[a-zA-Z0-9]+$/)) return "Project Details";
    if (pathName.match(/^\/dashboard\/users\/[a-zA-Z0-9]+$/)) return "User Details";

    return "Dashboard";
  }

  const title = getPageTitle();

  return (
    <header className="flex shrink-0 items-center gap-2 border-b h-(--header-height) transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapped:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  );
}