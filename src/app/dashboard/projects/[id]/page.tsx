"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Project } from "../../../../components/columns";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [recurating, setRecurating] = React.useState(false);

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
        toast.error("Error loading project");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ summary }),
        }
      );

      if (!res.ok) throw new Error("Failed to save summary");
      
      toast.success("Summary saved");
    } catch (error) {
      console.error(error);
      toast.error("Error saving summary");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    setPublishing(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${id}/publish`,
        {
          method: "POST",
        }
      );

      if (!res.ok) throw new Error("Failed to publish project");
      
      toast.success("Project published");
    } catch (error) {
      console.error(error);
      toast.error("Error publishing project");
    } finally {
      setPublishing(false);
    }
  };

  const handleRecurate = async () => {
    if (!id) return;
    setRecurating(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${id}/recurate`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Failed to recurate project");

      const data = await res.json();
      setSummary(data.data.summary);
      setProject((prev) => ({
        ...prev!,
        summary: data.data.summary,
        curatedAt: data.data.createdAt,
      }));

      toast.success("Summary re-curated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error re-curating project");
    } finally {
      setRecurating(false);
    }
  };

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

            {project?.curatedAt && (
              <p className="text-sm text-muted-foreground mt-2">
                Last curated on{" "}
                {new Date(project.curatedAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="link"
                onClick={handleRecurate}
                disabled={recurating}
              >
                {recurating ? "Recurating..." : "Recurate Summary"}
              </Button>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={handlePublish} disabled={publishing}>
                {publishing ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}