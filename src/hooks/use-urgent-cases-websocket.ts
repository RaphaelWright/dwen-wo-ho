"use client";

import { useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { toast } from "@/components/ui/sonner";
import { urgentCasesAtom } from "@/atoms/websocket";
import { NewUrgentCaseEvent } from "@/lib/types/websocket";

export function useUrgentCasesWebSocket() {
  const [urgentCases, setUrgentCases] = useAtom(urgentCasesAtom);

  const handleUrgentCase = useCallback(
    (event: CustomEvent<NewUrgentCaseEvent>) => {
      const { patient } = event.detail;

      // Add to urgent cases list
      setUrgentCases((prev) => [
        {
          patientId: patient.patientId,
          patientName: patient.patientName,
          score: patient.score,
          status: patient.status,
          schoolId: patient.schoolId,
          schoolName: patient.schoolName,
          time: patient.time,
        },
        ...prev,
      ]);

      // Show high-priority toast
      toast.error(`URGENT: ${patient.patientName}`, {
        description: `Score: ${patient.score} | School: ${patient.schoolName}`,
        duration: 10000, // 10 seconds
        action: {
          label: "View Patient",
          onClick: () => {
            // Navigate to patient
            window.location.href = `/provider/patients/${patient.patientId}`;
          },
        },
      });
    },
    [setUrgentCases]
  );

  useEffect(() => {
    window.addEventListener(
      "ws:urgent-case",
      handleUrgentCase as EventListener
    );

    return () => {
      window.removeEventListener(
        "ws:urgent-case",
        handleUrgentCase as EventListener
      );
    };
  }, [handleUrgentCase]);

  return {
    urgentCases,
  };
}
