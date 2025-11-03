"use client";

import { useEffect, useState } from "react";
import { columns, Project } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  useRequireAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects?page=1&limit=1`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          },
        );
        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        setProjects(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  if (loading) {
    return (
      <div className="space-y-4 p-6 md:p-8">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="w-full h-[500px]" />
          <Skeleton className="w-full h-[500px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{projects.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently Curated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {
                projects.filter(
                  (p) => 
                    p.curatedAt &&
                    new Date(p.curatedAt) > sevenDaysAgo
                ).length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <DataTable
         columns={columns}
         fetchData={async (page: number) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects?page=${page}&limit=10`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              cache: "no-store",
            }
          );
          if (!res.ok) throw new Error("Failed to fetch projects");
          return await res.json();
         }}
        />
      </div>
    </div>
  );
}
