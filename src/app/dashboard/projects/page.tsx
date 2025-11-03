import { DataTable } from "../../../components/data-table";
import { Project, columns } from "../../../components/columns";

async function getProjects(page = 1, limit = 10): Promise<Project[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects?page=${page}&limit=${limit}`, 
    { cache: "no-store",}
  );

  if (!res.ok) throw new Error("Failed to fetch projects");

  const projectsResponse = await res.json();
  return projectsResponse.data;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">All Projects</h1>
      </div>
      <DataTable columns={columns} data={projects} />
    </div>
  );
}