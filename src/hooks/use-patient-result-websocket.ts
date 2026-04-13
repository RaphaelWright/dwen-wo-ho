"use client";

import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { NewPatientResultEvent } from "@/lib/types/websocket";
import { schoolDetailKeys } from "@/hooks/queries/use-school-details";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

/**
 * Hook to handle real-time patient result events from WebSocket.
 * Used by Curators — when a new patient result is submitted at any school,
 * this hook invalidates the relevant TanStack Query caches so the UI refreshes.
 */
export function usePatientResultWebSocket() {
  const queryClient = useQueryClient();

  const handlePatientResult = useCallback(
    (event: CustomEvent<NewPatientResultEvent>) => {
      console.log(
        `[PatientResultWebSocket] 📥 Received ws:patient-result`,
        event.detail,
      );
      const { patientName, schoolId } = event.detail;

      // Invalidate school-specific patient overview query
      queryClient.invalidateQueries({
        queryKey: schoolDetailKeys.patientsOverview(String(schoolId)),
      });

      // Invalidate all school detail queries (covers urgent care too)
      queryClient.invalidateQueries({
        queryKey: schoolDetailKeys.all,
      });

      // Invalidate curator-level queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.curator],
      });

      // Show info toast
      toast.info(`New patient result: ${patientName}`, {
        description: `A new result was submitted at school #${schoolId}`,
        duration: 5000,
      });
    },
    [queryClient],
  );

  const handleReconnect = useCallback(() => {
    console.log(
      "[PatientResultWebSocket] Reconnect detected - re-fetching patient results",
    );
    // Invalidate all school detail queries to catch missed results
    queryClient.invalidateQueries({
      queryKey: schoolDetailKeys.all,
    });
  }, [queryClient]);

  useEffect(() => {
    window.addEventListener(
      "ws:patient-result",
      handlePatientResult as EventListener,
    );
    window.addEventListener("ws:reconnect", handleReconnect as EventListener);

    return () => {
      window.removeEventListener(
        "ws:patient-result",
        handlePatientResult as EventListener,
      );
      window.removeEventListener(
        "ws:reconnect",
        handleReconnect as EventListener,
      );
    };
  }, [handlePatientResult, handleReconnect]);

  return {
    // This hook primarily handles side effects (cache invalidation + toast)
  };
}
