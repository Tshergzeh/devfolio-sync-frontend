"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "../components/columns";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [project, setProject] = React.useState<Project | undefined>(undefined);
  const [readme, setReadme] = React.useState<string>("");
  const [summary, setSummary] = React.useState<string>("");

  React.useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);

      try {
        const projectRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${id}`
        );
        if (!projectRes.ok) throw new Error("Failed to fetch project data");
        const projectData = await projectRes.json();

        const { fullname } = projectData;
        const readmeRes = await fetch(
            `https://api.github.com/repos/${fullname}/readme`
        );
        if (!readmeRes.ok) throw new Error("Failed to fetch README");

        const readmeData = await readmeRes.json();
        const decodedReadme = Buffer.from(readmeData.content, "base64").toString("utf-8");

        setProject(projectData);
        setReadme(decodedReadme);
        setSummary(projectData.summary || "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="w-full h-[500px]" />
          <Skeleton className="w-full h-[500px]" />
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">{project?.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-y-auto max-h-[80vh]">
          <CardHeader>
            <CardTitle>README.md</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <ReactMarkdown>{readme}</ReactMarkdown>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={12}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline">Save</Button>
              <Button>Publish</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}