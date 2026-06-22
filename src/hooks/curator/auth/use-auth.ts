"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/infra/routes";

export function useCuratorAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");
      return !!token && userType === "curator";
    }
    return null;
  });

  // Client-side guard kept intentionally: auth state lives in localStorage, which
  // is unavailable to Next.js middleware / server redirects, so this check must
  // run in the browser after mount.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");
      if (!token || userType !== "curator") {
        router.replace(ROUTES.provider.auth);
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    }
  }, [router]);

  return { isAuthenticated, router };
}
