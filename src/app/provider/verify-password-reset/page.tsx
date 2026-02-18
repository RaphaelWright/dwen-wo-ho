"use client";

import Layout from "@/app/provider/auth/layout";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Suspense } from "react";
import { formatTime, recoverSteps } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import Stepper from "@/components/miscellaneous/stepper";
import { ArrowRightIcon } from "lucide-react";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { useProviderVerifyPasswordReset } from "@/hooks/provider/useProviderVerifyPasswordReset";

const VerifyContent = () => {
  const {
    email,
    seconds,
    isVerifying,
    handleVerifyCode,
    handleResendCode,
    handleBack,
    recoverAccountMutation,
  } = useProviderVerifyPasswordReset();

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-8 justify-between w-full">
        <Logo />
        <Link
          href={ROUTES.provider.singIn}
          className="bg-muted text-destructive rounded-full px-4 py-1 hover:bg-muted/80 transition-colors"
        >
          Sign In
        </Link>
      </div>
      <div className="grid place-items-center">
        <h1 className="lg:text-3xl md:text-3xl text-2xl text-center font-extrabold">
          Enter Verification Code
        </h1>
        <h2 className="text-xl text-wrap px-14 text-gray-500 font-medium text-center">
          A 6-digit verification code was just sent to{" "}
          {decodeURIComponent(email as string)}
        </h2>
        <div className="mt-5 text-center">
          <InputOTP
            className="text-success"
            maxLength={6}
            disabled={isVerifying}
            onComplete={(code) => handleVerifyCode(code)}
          >
            <InputOTPSlot index={0} className="otp-slot" />
            <InputOTPSlot index={1} className="otp-slot" />
            <InputOTPSlot index={2} className="otp-slot" />
            <InputOTPSlot index={3} className="otp-slot" />
            <InputOTPSlot index={4} className="otp-slot" />
            <InputOTPSlot index={5} className="otp-slot" />
          </InputOTP>
          <div>
            <Button
              disabled={seconds > 0 || recoverAccountMutation.isPending}
              onClick={handleResendCode}
              className="rounded-md mt-4 bg-secondary disabled:bg-secondary/50 hover:bg-secondary/90 text-secondary-foreground"
            >
              Resend code <ArrowRightIcon className="w-4 h-4" />
            </Button>
            <span className="ml-4 border rounded-full p-2 text-sm">
              {formatTime(seconds)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex border-t border-gray-500 px-10 pt-5 items-center justify-between">
        <Button
          onClick={handleBack}
          className="rounded-full px-6 border-4 bg-background text-primary text-xl font-bold border-primary uppercase hover:bg-muted transition-colors"
        >
          Back
        </Button>
        <Stepper steps={recoverSteps} step="Verify" />
        <Button className="invisible rounded-full px-6 border-4 bg-background text-primary text-xl font-bold border-primary uppercase">
          Next
        </Button>
      </div>
      <LoadingOverlay isVisible={isVerifying} text="Verifying code..." />
    </div>
  );
};

const Verify = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyContent />
      </Suspense>
    </Layout>
  );
};

export default Verify;
