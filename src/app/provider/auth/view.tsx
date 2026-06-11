"use client";

import { Suspense, type ReactNode } from "react";
import CheckEmail from "@/components/provider/auth/check-email";
import SignIn from "@/components/provider/auth/signin";
import SignUp from "@/components/provider/auth/sign-up";
import VerifyPasswordReset from "@/components/provider/auth/verify-password-reset";
import { useProviderAuth } from "@/hooks/provider/use-provider-auth";
import { SIGN_IN_TEXTS } from "@/lib/constants/components/provider/auth/signin";

const ProviderAuthPageContent = () => {
  const {
    step,
    email,
    passwordResetSuccess,
    isCheckingAuth,
    profileStep,
    handleEmailSubmit,
    handleBackToEmail,
    handleForgotPassword,
    handleProfileIncomplete,
    handleBackToSignIn,
    handleBackToCheckEmail,
  } = useProviderAuth();

  let authContent: ReactNode;
  switch (step) {
    case "check-email":
      authContent = <CheckEmail onEmailSubmit={handleEmailSubmit} />;
      break;
    case "sign-in":
      authContent = (
        <SignIn
          email={email}
          successMessage={
            passwordResetSuccess
              ? SIGN_IN_TEXTS.success.passwordReset
              : undefined
          }
          onBack={handleBackToEmail}
          onForgotPassword={handleForgotPassword}
          onProfileIncomplete={(step) => handleProfileIncomplete(step)}
        />
      );
      break;
    case "reset-password":
      authContent = (
        <VerifyPasswordReset email={email} onBack={handleBackToSignIn} />
      );
      break;
    default:
      authContent = (
        <SignUp
          email={email}
          onBack={handleBackToCheckEmail}
          profileStep={profileStep}
        />
      );
  }

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
        {authContent}
      </div>
    </div>
  );
};

const ProviderAuthView = () => {
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

export default ProviderAuthView;
