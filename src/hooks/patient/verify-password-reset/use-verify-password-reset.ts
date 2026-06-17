"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import useGetSearchParams from "@/hooks/shared/use-get-search-params";

export function usePatientVerifyPasswordReset() {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
  const emailParam = useGetSearchParams("email");
  const email = useMemo(() => {
    return emailParam ? decodeURIComponent(emailParam) : "";
  }, [emailParam]);
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

  // Client-side guard kept intentionally: the redirect depends on a value that
  // only exists in the browser (URL search param / localStorage auth tokens),
  // so it cannot be relocated to middleware or a server redirect.
  useEffect(() => {
    if (!emailParam) {
      router.push(ROUTES.patient.checkEmail);
    }
  }, [emailParam, router]);

  const handleComplete = useCallback(() => {
    router.push(`${ROUTES.patient.newPassword}?email=${emailParam}`);
  }, [router, emailParam]);

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
