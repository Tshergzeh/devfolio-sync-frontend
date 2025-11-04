"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useBreadcrumbTitle() {
    const token = localStorage.getItem("token");
    const pathName = usePathname();
    const [title, setTitle] = useState<string | null>(null);

    useEffect(() => {
      async function fetchTitle() {
        const segments = pathName.split("/").filter(Boolean);

        if (segments[0] === "dashboard" && segments.length === 3) {
          const [_, resource, id] = segments;

          try {
            let endpoint = "";
            if (resource === "users") endpoint = `/api/users/${id}`;
            else if (resource === "projects") endpoint = `/api/projects/${id}`;
            else return;

            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            if (!res.ok) return;

            const data = await res.json();

            const name = data.user?.name || data.project?.title || data.name || data.title;
            setTitle(name);
          } catch (error) {
            console.error("Breadcrumb fetch failed:", error);
          }
        } else {
          setTitle(null);
        }
      }

      fetchTitle();
    }, [pathName]);

    return title;
}