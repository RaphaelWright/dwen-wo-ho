"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export function useCuratorRedirect() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      router.replace(ROUTES.curator.schools);
    } else {
      router.replace(ROUTES.provider.auth);
    }

    setIsChecking(false);
  }, [router]);

  return { isChecking };
}
