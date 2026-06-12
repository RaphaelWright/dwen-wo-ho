"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { School } from "@/lib/types/school";

export function useSchoolActions(
  schoolId: string,
  school: School | null,
  router: ReturnType<typeof useRouter>,
  disableSchool: (id: string) => Promise<unknown>,
  invalidateSchool: (id: string) => Promise<unknown>,
  setShowDisableModal: (show: boolean) => void,
) {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleSchoolUpdated = useCallback(async () => {
    await invalidateSchool(schoolId);
  }, [invalidateSchool, schoolId]);

  const handleDisableConfirm = useCallback(async () => {
    if (!school) return;
    setIsActionLoading(true);
    try {
      await disableSchool(String(school.id));
      router.push(ROUTES.curator.schools);
    } catch (err: unknown) {
      console.error((err as Error).message || "Failed to disable school");
    } finally {
      setIsActionLoading(false);
      setShowDisableModal(false);
    }
  }, [school, disableSchool, router, setShowDisableModal]);

  return {
    isActionLoading,
    handleSchoolUpdated,
    handleDisableConfirm,
  };
}
