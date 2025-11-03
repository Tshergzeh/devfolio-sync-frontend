"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export type Project = {
  _id: string;
  repoId: number;
  createdAt: string;
  description?: string;
  forks: number;
  fullname: string;
  languages: string[];
  lastPushedAt: string;
  name: string;
  pathToDemo?: string;
  repoUrl: string;
  stars: number;
  topic: string[];
  updatedAt: string[];
  summary: string;
  curatedAt: string;
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Project",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link
            className="font-medium hover:underline"
            target="_blank"
            href={project.repoUrl}
          >
            {project.name}
          </Link>
          <Button variant="ghost" size="icon" asChild>
            <Link href={project.repoUrl} target="_blank">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "languages",
    header: "Languages",
    cell: ({ getValue }) => {
      const langs = getValue() as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {langs.slice(0, 3).map((lang) => (
            <Badge className="text-xs" key={lang} variant="secondary">
                {lang}
            </Badge>
          ))}
          {langs.length > 3 && <span className="text-xs text-muted-foreground">
            +{langs.length - 3}
          </span> }
        </div>
      );
    },
  },
  {
    accessorKey: "summary",
    header: "Summary",
    cell: ({ row }) => (
      <div className="max-w-xs whitespace-normal wrap-break-word text-sm text-muted-foreground line-clamp-2">
        {row.getValue("summary")}
      </div>
    ),
  },
  {
    accessorKey: "curatedAt",
    header: "Summary Curated At",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
];
