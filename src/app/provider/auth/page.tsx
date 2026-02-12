"use client";

import { Suspense } from "react";
import CheckEmail from "@/features/provider/components/ui/check-email";
import SignIn from "@/features/provider/components/ui/signin";
import SignUp from "@/features/provider/components/ui/sign-up";
import VerifyPasswordReset from "@/features/provider/components/ui/verify-password-reset";
import { useProviderAuth } from "@/hooks/provider/useProviderAuth";

const ProviderAuthPageContent = () => {
  const {
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
  } = useProviderAuth();

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
      return <VerifyPasswordReset email={email} onBack={handleBackToSignIn} />;
    } else {
      return (
        <SignUp
          email={email}
          onBack={handleBackToCheckEmail}
          profileStep={profileStep}
        />
      );
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      {isCheckingAuth && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4" />
            <p className="text-gray-500">Checking authentication...</p>
          </div>
        </div>
      )}

      {/* Auth form content */}
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
