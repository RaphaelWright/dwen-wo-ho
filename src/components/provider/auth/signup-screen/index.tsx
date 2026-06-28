"use client";

import { Suspense } from "react";
import { ProviderAuthShell } from "@/components/provider/auth/auth-shell";
import ProviderSignUp from "@/components/provider/auth/sign-up/index";
import { useProviderSignup } from "@/hooks/provider/signup/use-signup";

function ProviderSignupContent() {
  const {
    email,
    fullName,
    title,
    specialty,
    profileImage,
    profileStep,
    isResumeLocked,
    isCheckingGuard,
    handleBack,
  } = useProviderSignup();

  return (
    <ProviderSignUp
      email={email}
      fullName={fullName}
      title={title}
      specialty={specialty}
      profileImage={profileImage}
      profileStep={profileStep}
      isResumeLocked={isResumeLocked}
      isCheckingGuard={isCheckingGuard}
      onBack={handleBack}
    />
  );
}

export function ProviderSignupScreen() {
  return (
    <ProviderAuthShell>
      <Suspense fallback={<div>Loading...</div>}>
        <ProviderSignupContent />
      </Suspense>
    </ProviderAuthShell>
  );
}
