"use client";

import { Suspense } from "react";
import { usePatientVerifyPasswordReset } from "@/hooks/patient/usePatientVerifyPasswordReset";
import {
  VerifyPasswordResetHeader,
  VerifyPasswordResetOTPSection,
  VerifyPasswordResetFooter,
} from "@/features/patient/components/verify-password-reset";

const VerifyContent = () => {
  const { email, seconds, handleComplete, handleResend, router } =
    usePatientVerifyPasswordReset();

  return (
    <div className="h-full flex flex-col justify-between">
      <VerifyPasswordResetHeader />

      <VerifyPasswordResetOTPSection
        email={email}
        seconds={seconds}
        onComplete={handleComplete}
        onResend={handleResend}
      />

      <VerifyPasswordResetFooter onBack={() => router.back()} />
    </div>
  );
};

const VerifyPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
};

export default VerifyPage;
