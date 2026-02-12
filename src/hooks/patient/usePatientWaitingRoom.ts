"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function usePatientWaitingRoom() {
  const router = useRouter();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Start timer when component mounts
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleBackToLockIn = useCallback(() => {
    router.push("/patient/lock-in");
  }, [router]);

  return {
    elapsedTime,
    formatTime,
    handleBackToLockIn,
  };
}
