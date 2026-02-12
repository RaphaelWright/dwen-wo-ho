"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CheckEmail from "@/features/provider/components/ui/check-email";
import SignIn from "@/features/provider/components/ui/signin";
import SignUp from "@/features/provider/components/ui/sign-up";
import VerifyPasswordReset from "@/features/provider/components/ui/verify-password-reset";
import { useSearchParams } from "next/navigation";
import {
  getUserType,
  hasValidToken,
  setUserType,
} from "@/lib/utils/getUserType";
import { ROUTES } from "@/constants/routes";
import { refreshToken } from "@/lib/auth-utils";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";

type AuthStep = "check-email" | "sign-in" | "sign-up" | "reset-password";

const ProviderAuthPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = (searchParams.get("step") as AuthStep) || "check-email";
  const initialEmail = searchParams.get("email");

  const [step, setStep] = useState<AuthStep>("check-email");
  const [email, setEmail] = useState<string>(initialEmail || "");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const hasCheckedRef = useRef(false);
  const hasRedirectedRef = useRef(false);
  const isCheckingRef = useRef(false);

  // Check for existing tokens and auto-signin - only run once on mount
  useEffect(() => {
    // Prevent multiple checks
    if (hasCheckedRef.current || isCheckingRef.current) return;
    hasCheckedRef.current = true;
    isCheckingRef.current = true;

    let isMounted = true;

    const checkAuthAndRedirect = async () => {
      // Double-check mounted state and redirect flag
      if (!isMounted || hasRedirectedRef.current) {
        if (isMounted && !hasRedirectedRef.current) {
          isCheckingRef.current = false;
          setIsCheckingAuth(false);
        }
        return;
      }

      // Helper function to clear auth and proceed to login
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

      // Helper function to verify profile and redirect
      const verifyProfileAndRedirect = async () => {
        try {
          // Make request to profile endpoint to verify token is valid
          const profileResponse = await api(ENDPOINTS.profile, {
            method: "GET",
          });

          // If profile request succeeds (200), user is authenticated
          if (profileResponse?.success && profileResponse.data) {
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

          // If profile request doesn't succeed, user is logged out
          clearAuthAndProceed();
          return false;
        } catch (error) {
          // Profile request failed - user is logged out
          clearAuthAndProceed();
          return false;
        }
      };

      // First, check if refreshToken exists - if so, immediately refresh to get new access token
      const refreshTokenValue =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;

      if (refreshTokenValue) {
        // Immediately try to refresh the token
        const refreshedToken = await refreshToken();
        if (refreshedToken && isMounted && !hasRedirectedRef.current) {
          // Token refreshed successfully, verify profile and redirect
          await verifyProfileAndRedirect();
          return;
        }
      }

      // If no refreshToken or refresh failed, check for existing access tokens
      const hasToken = hasValidToken();

      if (hasToken) {
        // We have a token, verify it's still valid by checking profile
        await verifyProfileAndRedirect();
        return;
      }

      // No valid token - proceed with auth flow
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
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (isCheckingAuth) return;

    if (initialStep) {
      setStep(initialStep);
    }
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialStep, initialEmail, isCheckingAuth]);

  // This state is only used when there is an error during login because profile is incomplete
  const [profileStep, setProfileStep] = useState<number | null>(null);

  const handleEmailSubmit = (submittedEmail: string, emailExists: boolean) => {
    setEmail(submittedEmail);
    if (emailExists) {
      setStep("sign-in");
    } else {
      setStep("sign-up");
    }
  };

  const handleBackToEmail = () => {
    setStep("check-email");
  };

  const handleForgotPassword = () => {
    setStep("reset-password");
  };

  const handleProfileIncomplete = (step: number) => {
    // Handle profile incomplete steps if needed
    setStep("sign-up");
    setProfileStep(step);
  };

  // Render the auth form content, but show loading overlay when checking
  const renderAuthContent = () => {
    if (step === "check-email") {
      return <CheckEmail onEmailSubmit={handleEmailSubmit} />;
    } else if (step === "sign-in") {
      return (
        <SignIn
          email={email}
          onBack={handleBackToEmail}
          onForgotPassword={handleForgotPassword}
          onProfileIncomplete={(step) => handleProfileIncomplete(step)}
        />
      );
    } else if (step === "reset-password") {
      return (
        <VerifyPasswordReset email={email} onBack={() => setStep("sign-in")} />
      );
    } else {
      return (
        <SignUp
          email={email}
          onBack={() => setStep("check-email")}
          profileStep={profileStep}
        />
      );
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay - only shows when checking auth, doesn't replace content */}
      {isCheckingAuth && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4" />
            <p className="text-gray-500">Checking authentication...</p>
          </div>
        </div>
      )}

      {/* Auth form content - always rendered, just hidden behind overlay when checking */}
      <div
        className={
          isCheckingAuth ? "opacity-0 pointer-events-none" : "opacity-100"
        }
      >
        {renderAuthContent()}
      </div>
    </div>
  );
};

const ProviderAuthPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProviderAuthPageContent />
    </Suspense>
  );
};

export default ProviderAuthPage;
