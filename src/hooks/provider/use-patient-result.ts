"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import useUserQuery from "@/hooks/queries/use-user-profile";
import usePatientResultQuery from "@/hooks/queries/use-patient-result";
import { getPatientResultColorClass } from "@/lib/utils/color-utils";

export function usePatientResult() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.resultId as string;
  const { getProfileQuery } = useUserQuery();
  const { usePatientFullDetails, updateActionStatus, isUpdating } =
    usePatientResultQuery();

  const { data, isLoading } = usePatientFullDetails(resultId, {
    enabled: !!resultId && !!getProfileQuery.data,
  });

  const patientResult = data?.patientResult ?? null;
  const lockInAssessment = data?.lockInAssessment ?? null;

  const handleUpdateActionStatus = useCallback(
    async (actionStatus: "TREATING") => {
      if (!patientResult || !getProfileQuery.data) return;

      const providerId = getProfileQuery.data.id || getProfileQuery.data.email;
      await updateActionStatus({
        resultId,
        data: {
          providerId,
          actionStatus,
        },
      });
    },
    [patientResult, getProfileQuery.data, resultId, updateActionStatus],
  );

  const isTreating =
    patientResult?.treatingProviders.some(
      (p: { id: string | number }) =>
        String(p.id) === String(getProfileQuery.data?.id) ||
        p.id === getProfileQuery.data?.email,
    ) ?? false;

  return {
    router,
    patientResult,
    lockInAssessment,
    isLoading,
    isUpdating,
    isTreating,
    handleUpdateActionStatus,
    getColorClass: getPatientResultColorClass,
  };
}
