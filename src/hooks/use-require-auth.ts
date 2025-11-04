"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")!);
    if (!token) router.replace("/login");
    if (user.isFirstLogin) {
      router.replace("/dashboard/users/change-default-password");
    }
  }, [router]);
}
