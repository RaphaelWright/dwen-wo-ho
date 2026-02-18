"use client";

import { Suspense } from "react";
import CheckEmail from "@/components/provider/auth/check-email";
import SignIn from "@/components/provider/auth/signin";
import SignUp from "@/components/provider/auth/sign-up";
import VerifyPasswordReset from "@/components/provider/auth/verify-password-reset";
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
    switch (step) {
      case "check-email":
        return <CheckEmail onEmailSubmit={handleEmailSubmit} />;
      case "sign-in":
        return (
          <SignIn
            email={email}
            onBack={handleBackToEmail}
            onForgotPassword={handleForgotPassword}
            onProfileIncomplete={(step) => handleProfileIncomplete(step)}
          />
        );
      case "reset-password":
        return (
          <VerifyPasswordReset email={email} onBack={handleBackToSignIn} />
        );
      default:
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
    <div className="relative min-h-screen w-full bg-background transition-colors duration-300">
      {/* Loading overlay */}
      {isCheckingAuth && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground font-medium animate-pulse">
              Checking authentication...
            </p>
          </div>
        </div>
      )}

      {/* Auth form content */}
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          isCheckingAuth ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {renderAuthContent()}
      </div>
    </div>
  );
};

const ProviderAuthPage = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      }
    >
      <ProviderAuthPageContent />
    </Suspense>
  );
};

export default ProviderAuthPage;
