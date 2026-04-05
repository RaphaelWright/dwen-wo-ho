"use client";

import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { PatientStatusChangedEvent } from "@/lib/types/websocket";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export function usePatientStatusWebSocket() {
  const queryClient = useQueryClient();

  const handlePatientStatusChange = useCallback(
    (event: CustomEvent<PatientStatusChangedEvent>) => {
      const { patient } = event.detail;

      // Invalidate patient queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providerDashboard, "patients"],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providerDashboard, "patients", "urgent"],
      });

      // Show subtle notification
      toast.info(`${patient.patientName} status updated`, {
        description: `New status: ${patient.status}`,
        duration: 5000,
      });
    },
    [queryClient]
  );

  useEffect(() => {
    window.addEventListener(
      "ws:patient-status",
      handlePatientStatusChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "ws:patient-status",
        handlePatientStatusChange as EventListener
      );
    };
  }, [handlePatientStatusChange]);

  return {
    // This hook primarily handles side effects (cache invalidation)
    // Patient data is accessed through existing TanStack Query hooks
  };
}
