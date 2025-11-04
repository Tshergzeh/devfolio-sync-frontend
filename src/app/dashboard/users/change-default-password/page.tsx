"use client";

import { ChangeEvent, FormEvent, useState } from "react";
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
import { toast } from "sonner";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function ChangePasswordPage() {
    useRequireAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
      newPassword: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/change-password-first-login`, 
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
          },
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to change password");

        toast.success("Password changed successfully. Please login with your new password.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push('/login');
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
            <CardTitle>Change Default Password</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="password">New Pasword</FieldLabel>
                    <Input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      placeholder="************"
                      value={form.newPassword}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Change Password" }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
}
