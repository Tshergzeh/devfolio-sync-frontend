"use client";

import { usePathname, useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";

export function SiteHeader() {
  const pathName = usePathname();
  const router = useRouter();

  const segments = pathName.split("/").filter(Boolean);

  const formatSegment = (segment: string) => {
    if (!segment) return "";
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  return (
    <header className="flex shrink-0 items-center gap-2 border-b h-(--header-height) transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapped:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4" />

          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            {segments.length === 0 ? (
              <span className="text-foreground font-medium">Dashboard</span>
            ) : (
              <>
                <Link className="hover:text-foreground transition-colors" href="/dashboard">
                  Dashboard
                </Link>

                {segments.slice(1).map((segment, idx) => {
                  const href = "/" + segments.slice(0, idx + 2).join("/");
                  const isLast = idx === segments.slice(1).length - 1;

                  return (
                    <div className="flex items-center gap-1" key={href}>
                      <span>/</span>
                      {isLast ? (
                        <span className="text-foregound font-medium">
                          {formatSegment(segment)}
                        </span>
                      ) : (
                        <Link className="hover:text-foreground transition-colours" href={href}>
                          {formatSegment(segment)}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}