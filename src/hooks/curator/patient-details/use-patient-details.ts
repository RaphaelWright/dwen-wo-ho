"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { patientsService } from "@/services/shared/patients";
import usePatientResultQuery from "@/hooks/queries/use-patient-result";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { useDeleteSinglePatientRecord } from "@/hooks/curator/delete-patient-records/use-delete-patient-records";
import { buildPatientLockinMetrics } from "@/lib/utils/curator/patient-dashboard/lockin-metrics";

export function useCuratorPatientDetails() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const schoolId = params.schoolId as string;

  const [activeTab, setActiveTab] = useState<"assessment" | "history">(
    "assessment",
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { deleteSinglePatient, singleDeletePending } =
    useDeleteSinglePatientRecord(schoolId);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.curatorPatientDetails, patientId],
    queryFn: () => patientsService.getFullPatientDetails(patientId),
    enabled: !!patientId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const patientResult = data?.patientResult ?? null;
  const lockInAssessment = data?.lockInAssessment ?? null;

  const { usePatientActions, addPatientAction, isAddingAction } =
    usePatientResultQuery();
  const actionsQuery = usePatientActions(patientId, {
    enabled: !!patientId && !!data,
  });
  const actions = actionsQuery.data ?? [];

  const metrics = buildPatientLockinMetrics(lockInAssessment);

  const handleDeleteConfirm = () => {
    deleteSinglePatient(patientId, {
      onSuccess: () => {
        setShowDeleteModal(false);
        router.back();
      },
    });
  };

  return {
    router,
    patientResult,
    lockInAssessment,
    isLoading,
    activeTab,
    setActiveTab,
    metrics,
    actions,
    isActionsLoading: actionsQuery.isLoading,
    addPatientAction,
    isAddingAction,
    showDeleteModal,
    setShowDeleteModal,
    singleDeletePending,
    handleDeleteConfirm,
  };
}
