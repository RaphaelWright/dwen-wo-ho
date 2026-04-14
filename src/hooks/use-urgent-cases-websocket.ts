"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { urgentCasesAtom } from "@/atoms/websocket";
import { NewUrgentCaseEvent } from "@/lib/types/websocket";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

// Urgent alert audio — short beep using Web Audio API
function playUrgentAlertSound() {
  try {
    const AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext })
        .webkitAudioContext;

    if (!AudioContext) return;

    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    // Two-tone urgent beep
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.15); // E5
    oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.3); // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.45);

    // Cleanup
    oscillator.onended = () => ctx.close();
  } catch {
    // Silently fail — audio is a nice-to-have, not critical
    console.warn("[UrgentCasesWebSocket] Audio alert failed");
  }
}

export function useUrgentCasesWebSocket() {
  const [urgentCases, setUrgentCases] = useAtom(urgentCasesAtom);
  const queryClient = useQueryClient();

  const handleUrgentCase = useCallback(
    (event: CustomEvent<NewUrgentCaseEvent>) => {
      console.log(
        `[UrgentCasesWebSocket] 📥 Received ws:urgent-case`,
        event.detail,
      );
      const { patient } = event.detail;

      // Add to urgent cases atom (for potential future direct use)
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

      // Invalidate REST queries so UrgentPanel refreshes (Provider dashboard)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providerDashboard, "patients", "urgent"],
      });

      // Invalidate REST queries so UrgentPanel refreshes (Curator school detail)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.schoolDetail],
      });

      // Play urgent alert sound
      playUrgentAlertSound();

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
    [setUrgentCases, queryClient],
  );

  const handleReconnect = useCallback(() => {
    console.log(
      "[UrgentCasesWebSocket] Reconnect detected - re-fetching urgent cases",
    );
    // Re-fetch urgent cases from REST API (Provider)
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.providerDashboard, "patients", "urgent"],
    });
    // Re-fetch urgent care data (Curator)
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.schoolDetail],
    });
  }, [queryClient]);

  useEffect(() => {
    window.addEventListener(
      "ws:urgent-case",
      handleUrgentCase as EventListener,
    );
    window.addEventListener("ws:reconnect", handleReconnect as EventListener);

    return () => {
      window.removeEventListener(
        "ws:urgent-case",
        handleUrgentCase as EventListener,
      );
      window.removeEventListener(
        "ws:reconnect",
        handleReconnect as EventListener,
      );
    };
  }, [handleUrgentCase, handleReconnect]);

  return {
    urgentCases,
  };
}
