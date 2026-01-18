"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckEmail from "@/components/provider/ui/check-email";
import SignIn from "@/components/provider/ui/signin";
import SignUp from "@/components/provider/ui/sign-up";
import VerifyPasswordReset from "@/components/provider/ui/verify-password-reset";
import { useSearchParams } from "next/navigation";
import { getUserType, hasValidToken } from "@/lib/utils/getUserType";
import { ROUTES } from "@/constants/routes";
import { refreshToken } from "@/lib/auth-utils";

type AuthStep = "check-email" | "sign-in" | "sign-up" | "reset-password";

const ProviderAuthPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = (searchParams.get("step") as AuthStep) || "check-email";
  const initialEmail = searchParams.get("email");

  const [step, setStep] = useState<AuthStep>("check-email");
  const [email, setEmail] = useState<string>(initialEmail || "");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing tokens and auto-signin
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Small delay to ensure localStorage is available
      await new Promise((resolve) => setTimeout(resolve, 100));

      const userType = getUserType();
      const hasToken = hasValidToken();

      if (hasToken && userType === "curator") {
        // Curator token found - redirect to curator pages
        router.push(ROUTES.curator.schools);
        return;
      }

      if (hasToken && userType === "provider") {
        // Provider token found - redirect to provider home
        router.push(ROUTES.provider.home);
        return;
      }

      // If refresh token exists but no access token, try to refresh
      if (hasToken && !userType) {
        const refreshedToken = await refreshToken();
        if (refreshedToken) {
          // Token refreshed, check user type again
          const newUserType = getUserType();
          if (newUserType === "curator") {
            router.push(ROUTES.curator.schools);
            return;
          }
          if (newUserType === "provider") {
            router.push(ROUTES.provider.home);
            return;
          }
        }
      }

      // No valid token or couldn't determine type - proceed with auth flow
      setIsCheckingAuth(false);
    };

    checkAuthAndRedirect();
  }, [router]);

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

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4" />
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return step === "check-email" ? (
    <CheckEmail onEmailSubmit={handleEmailSubmit} />
  ) : step === "sign-in" ? (
    <SignIn
      email={email}
      onBack={handleBackToEmail}
      onForgotPassword={handleForgotPassword}
      onProfileIncomplete={(step) => handleProfileIncomplete(step)}
    />
  ) : step === "reset-password" ? (
    <VerifyPasswordReset email={email} onBack={() => setStep("sign-in")} />
  ) : (
    <SignUp
      email={email}
      onBack={() => setStep("check-email")}
      profileStep={profileStep}
    />
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
