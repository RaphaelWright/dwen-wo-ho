"use client";

import { Suspense } from "react";
import { usePatientVerifyPasswordReset } from "@/hooks/patient/verify-password-reset/use-verify-password-reset";
import {
  VerifyPasswordResetHeader,
  VerifyPasswordResetOTPSection,
  VerifyPasswordResetFooter,
} from "@/components/patient/verify-password-reset";

function PatientVerifyPasswordResetContent() {
  const { email, seconds, handleComplete, handleResend, router } =
    usePatientVerifyPasswordReset();

  return (
    <div className="animate-in fade-in zoom-in-95 flex h-full min-h-screen w-full flex-col justify-between px-6 py-6 duration-700 sm:px-8 md:px-12 lg:px-16">
      <VerifyPasswordResetHeader />

      <div className="flex flex-1 items-center justify-center py-12">
        <VerifyPasswordResetOTPSection
          email={email}
          seconds={seconds}
          onComplete={handleComplete}
          onResend={handleResend}
        />
      </div>

      <VerifyPasswordResetFooter onBack={() => router.back()} />
    </div>
  );
}

export function PatientVerifyPasswordResetScreen() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientVerifyPasswordResetContent />
    </Suspense>
  );
}
