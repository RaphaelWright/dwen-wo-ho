"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  getUserType,
  hasValidToken,
  setUserType,
} from "@/lib/utils/getUserType";
import { ROUTES } from "@/lib/constants/routes";
import { refreshToken } from "@/lib/auth-utils";
import { authService } from "@/services/auth";
import type { AuthStep } from "@/lib/types/components/auth";

export function useProviderAuth() {
  const searchParams = useSearchParams();
  const initialStep = (searchParams.get("step") as AuthStep) || "check-email";
  const initialEmail = searchParams.get("email");

  const [step, setStep] = useState<AuthStep>("check-email");
  const [email, setEmail] = useState<string>(initialEmail || "");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const hasCheckedRef = useRef(false);
  const hasRedirectedRef = useRef(false);
  const isCheckingRef = useRef(false);

  const [profileStep, setProfileStep] = useState<number | null>(null);

  useEffect(() => {
    if (hasCheckedRef.current || isCheckingRef.current) return;
    hasCheckedRef.current = true;
    isCheckingRef.current = true;

    let isMounted = true;

    const checkAuthAndRedirect = async () => {
      if (!isMounted || hasRedirectedRef.current) {
        if (isMounted && !hasRedirectedRef.current) {
          isCheckingRef.current = false;
          setIsCheckingAuth(false);
        }
        return;
      }

      const clearAuthAndProceed = () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("curatorToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userType");
          localStorage.removeItem("pendingUser");
        }
        setUserType(null);
        if (isMounted && !hasRedirectedRef.current) {
          isCheckingRef.current = false;
          setIsCheckingAuth(false);
        }
      };

      const verifyProfileAndRedirect = async () => {
        try {
          const profileData = await authService.getProfile();

          if (profileData) {
            const userType = getUserType();

            if (userType === "curator" && !hasRedirectedRef.current) {
              hasRedirectedRef.current = true;
              isCheckingRef.current = false;
              window.location.href = ROUTES.curator.schools;
              return true;
            }

            if (userType === "provider" && !hasRedirectedRef.current) {
              hasRedirectedRef.current = true;
              isCheckingRef.current = false;
              window.location.href = ROUTES.provider.home;
              return true;
            }
          }

          clearAuthAndProceed();
          return false;
        } catch {
          clearAuthAndProceed();
          return false;
        }
      };

      const refreshTokenValue =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;

      if (refreshTokenValue) {
        const refreshedToken = await refreshToken();
        if (refreshedToken && isMounted && !hasRedirectedRef.current) {
          await verifyProfileAndRedirect();
          return;
        }
      }

      const hasToken = hasValidToken();

      if (hasToken) {
        await verifyProfileAndRedirect();
        return;
      }

      if (isMounted && !hasRedirectedRef.current) {
        isCheckingRef.current = false;
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndRedirect();

    return () => {
      isMounted = false;
      isCheckingRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isCheckingAuth) return;

    if (initialStep) {
      setStep(initialStep);
    }
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialStep, initialEmail, isCheckingAuth]);

  const handleEmailSubmit = useCallback(
    (submittedEmail: string, emailExists: boolean) => {
      setEmail(submittedEmail);
      if (emailExists) {
        setStep("sign-in");
      } else {
        setStep("sign-up");
      }
    },
    [],
  );

  const handleBackToEmail = useCallback(() => {
    setStep("check-email");
  }, []);

  const handleForgotPassword = useCallback(() => {
    setStep("reset-password");
  }, []);

  const handleProfileIncomplete = useCallback((incompleteStep: number) => {
    setStep("sign-up");
    setProfileStep(incompleteStep);
  }, []);

  const handleBackToSignIn = useCallback(() => {
    setStep("sign-in");
  }, []);

  const handleBackToCheckEmail = useCallback(() => {
    setStep("check-email");
  }, []);

  return {
    step,
    email,
    isCheckingAuth,
    profileStep,
    handleEmailSubmit,
    handleBackToEmail,
    handleForgotPassword,
    handleProfileIncomplete,
    handleBackToSignIn,
    handleBackToCheckEmail,
  };
}
