"use client";

import { patientsService } from "@/services/patients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/utils/toast";
import { useCallback } from "react";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export function useDeleteBulkPatientRecords(schoolId: string) {
  const queryClient = useQueryClient();
  const { data, mutate, isPending, reset, error } = useMutation({
    mutationFn: (patientIds: number[]) =>
      patientsService.deleteAllPatientRecords(patientIds),
    onSuccess: () => {
      toast.success("Patient records deleted successfully");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.schoolPatientsOverview(schoolId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.schoolPatients(schoolId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.schoolUrgentCare(schoolId),
      });
    },
    onError: () => {
      toast.error("Failed to delete patient records");
    },
    mutationKey: ["delete-bulk-patient-records"],
  });

  const deleteBulkPatients = useCallback(
    (selectedPatients: Set<string | number>, onSuccess?: () => void) => {
      const patientIds = Array.from(selectedPatients).map((id) =>
        typeof id === "string" ? parseInt(id, 10) : id,
      );
      mutate(patientIds, { onSuccess });
    },
    [mutate],
  );

  return {
    bulkDeleteResponsedata: data,
    deleteBulkPatients,
    bulkDeletePending: isPending,
    resetBulkDelete: reset,
    bulkDeleteError: error,
  };
}

export function useDeleteSinglePatientRecord(schoolId: string) {
  const queryClient = useQueryClient();
  const { data, mutate, isPending, reset, error } = useMutation({
    mutationFn: (patientId: number | string) =>
      patientsService.deleteSinglePatientRecord(patientId),
    onSuccess: () => {
      toast.success("Patient record deleted successfully");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.schoolPatientsOverview(schoolId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.schoolPatients(schoolId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.schoolUrgentCare(schoolId),
      });
    },
    onError: () => toast.error("Failed to delete patient record"),
    mutationKey: ["delete-single-patient-record"],
  });

  return {
    deleteSinglePatient: mutate,
    singleDeleteResponseData: data,
    singleDeletePending: isPending,
    resetSingleDelete: reset,
    singleDeleteError: error,
  };
}
