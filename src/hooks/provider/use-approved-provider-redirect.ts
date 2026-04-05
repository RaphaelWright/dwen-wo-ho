"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export function useApprovedProviderRedirect(
  applicationStatus: string | undefined,
  isLoading: boolean,
  router: ReturnType<typeof useRouter>,
) {
  useEffect(() => {
    if (applicationStatus === "APPROVED" && !isLoading) {
      router.replace(ROUTES.provider.home);
    }
  }, [applicationStatus, isLoading, router]);
}
