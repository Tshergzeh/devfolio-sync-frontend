import { AppSidebar } from "@/components/app-sidebar";
import { columns, Project } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

async function getProjects(page = 1, limit = 10): Promise<Project[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects?page=${page}&limit=${limit}`, 
    { cache: "no-store",}
  );

  if (!res.ok) throw new Error("Failed to fetch projects");

  const projectsResponse = await res.json();
  return projectsResponse.data;
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72",
          "--header-height": "calc(var(--spacing) * 12",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable columns={columns} data={projects} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
