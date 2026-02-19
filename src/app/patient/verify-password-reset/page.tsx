"use client";

import { Suspense } from "react";
import { usePatientVerifyPasswordReset } from "@/hooks/patient/usePatientVerifyPasswordReset";
import {
  VerifyPasswordResetHeader,
  VerifyPasswordResetOTPSection,
  VerifyPasswordResetFooter,
} from "@/components/patient/verify-password-reset";

const VerifyContent = () => {
  const { email, seconds, handleComplete, handleResend, router } =
    usePatientVerifyPasswordReset();

  return (
    <div className="w-full h-full min-h-screen flex flex-col justify-between px-6 sm:px-8 md:px-12 lg:px-16 py-6 animate-in fade-in zoom-in-95 duration-700">
      <VerifyPasswordResetHeader />

      <div className="flex-1 flex items-center justify-center py-12">
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
};

const VerifyPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
};

export default VerifyPage;
