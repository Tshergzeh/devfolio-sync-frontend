"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function AddUserPage() {
    useRequireAuth();
    const router = useRouter();

    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      role: "editor",
    });
    
    useEffect(() => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [e.target.name]: e.target.value });

    const handleRoleChange = (value: string) =>
      setForm({ ...form, role: value });

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to create user");

        toast.success("User created successfully");
        router.push("/dashboard/users");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6 p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="New User's Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="new@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Pasword</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="************"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Role</FieldLabel>
                    <RadioGroup
                      defaultValue="editor"
                      onValueChange={handleRoleChange}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="editor" id="role-editor" />
                        <FieldLabel htmlFor="role-editor" className="font-normal cursor-pointer">
                          &#x0020;Editor
                        </FieldLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="admin" id="role-admin" />
                        <FieldLabel htmlFor="role-admin" className="font-normal cursor-pointer">
                          Admin
                        </FieldLabel>
                      </div>
                    </RadioGroup>
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create User" }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
}
