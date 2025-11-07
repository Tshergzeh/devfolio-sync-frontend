"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    const user = userRaw ? JSON.parse(userRaw) : null;

    if (!token) {
      router.replace("/login");
      return;
    }

    if (user?.isFirstLogin) {
      router.replace("/dashboard/users/change-default-password");
    }
  }, [router]);
}
