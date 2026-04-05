"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export function usePatientSignUpVerify() {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
  const params = useParams();
  const email = useMemo(() => {
    return params.email ? decodeURIComponent(params.email as string) : "";
  }, [params.email]);
  const router = useRouter();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, seconds]);

  const handleComplete = useCallback(
    (value: string) => {
      router.push(`${ROUTES.patient.newPassword}?email=${params.email}`);
    },
    [router, params.email],
  );

  const handleResend = useCallback(() => {
    setSeconds(120);
    setIsRunning(true);
  }, []);

  return {
    email,
    seconds,
    isRunning,
    handleComplete,
    handleResend,
    router,
  };
}
