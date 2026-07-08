"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/infra/routes";
import useGetSearchParams from "@/hooks/shared/use-get-search-params";
import { patientAuthService } from "@/services/patient/auth";

export function usePatientVerifyPasswordReset() {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(120); // 2 minutes
  const [otpReference, setOtpReference] = useState<string | null>(null);
  const requestedInitialCode = useRef(false);
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
      router.push(ROUTES.patient.join);
    }
  }, [emailParam, router]);

  const requestRecoveryCode = useCallback(() => {
    if (!email) {
      return;
    }

    void patientAuthService
      .forgotPassword({ contact: email })
      .then((response) => {
        setOtpReference(response.otpReference);
        setSeconds(120);
        setIsRunning(true);
      })
      .catch(() => {
        toast.error("We could not send a recovery code. Try again.");
      });
  }, [email]);

  useEffect(() => {
    if (!email || requestedInitialCode.current) {
      return;
    }

    requestedInitialCode.current = true;
    requestRecoveryCode();
  }, [email, requestRecoveryCode]);

  const handleComplete = useCallback(
    (code: string) => {
      if (!otpReference) {
        toast.error("Request a new recovery code and try again.");
        return;
      }

      void patientAuthService
        .verifyOtp({ otpReference, code })
        .then((response) => {
          if (!response.verified || !response.passwordResetToken) {
            toast.error("That recovery code is not valid.");
            return;
          }

          localStorage.setItem(
            "patientRecoveryToken",
            response.passwordResetToken,
          );
          router.push(`${ROUTES.patient.resetPasswordNew}?email=${emailParam}`);
        })
        .catch(() => {
          toast.error("We could not verify that code. Try again.");
        });
    },
    [emailParam, otpReference, router],
  );

  const handleResend = useCallback(() => {
    requestRecoveryCode();
  }, [requestRecoveryCode]);

  return {
    email,
    seconds,
    isRunning,
    handleComplete,
    handleResend,
    router,
  };
}
