"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/use-require-auth";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  isDeleted: boolean;
  createdAt: string;
  deletedAt: string | null;
};

export default function UsersPage() {
  useRequireAuth();

  const token = localStorage.getItem("token");
  
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) =>
        <span className="font-medium">{getValue() as string}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ getValue }) => {
        const role = getValue() as string;
        const color = role === "admin"
          ? "bg-blue-100 text-blue-800"
          : "bg-green-100 text-green-800";
        return <Badge className={`${color} font-medium`}>{role}</Badge>;
      },
    },
  ];

  async function fetchUsers(page: number) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users?page=${page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch users");

    const data = await res.json();
    return {
      data: data.users,
      pagination: data.pagination,
    };
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} fetchData={fetchUsers} />
        </CardContent>
      </Card>
    </div>
  );
}
