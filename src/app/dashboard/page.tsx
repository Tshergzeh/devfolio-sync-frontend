import { columns, Project } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getProjects(page = 1, limit = 10): Promise<{ projects: Project[]; sevenDaysAgo: Date }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects?page=${page}&limit=${limit}`, 
    { cache: "no-store",}
  );

  if (!res.ok) throw new Error("Failed to fetch projects");

  const projectsResponse = await res.json();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return { projects: projectsResponse.data, sevenDaysAgo };
}

export default async function DashboardPage() {
  const { projects, sevenDaysAgo } = await getProjects();

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
        <DataTable columns={columns} data={projects} />
      </div>
    </div>
  );
}
