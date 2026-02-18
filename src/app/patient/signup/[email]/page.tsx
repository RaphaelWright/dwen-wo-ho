"use client";

import { usePatientSignUpVerify } from "@/hooks/patient/usePatientSignUpVerify";
import {
  VerifyHeader,
  VerifyOTPSection,
  VerifyFooter,
} from "@/components/patient/signup-verify";

const VerifyPage = () => {
  const { email, seconds, handleComplete, handleResend, router } =
    usePatientSignUpVerify();

  return (
    <div className="h-full flex flex-col justify-between">
      <VerifyHeader />

      <VerifyOTPSection
        email={email}
        seconds={seconds}
        onComplete={handleComplete}
        onResend={handleResend}
      />

      <VerifyFooter onBack={() => router.back()} />
    </div>
  );
};

export default VerifyPage;
