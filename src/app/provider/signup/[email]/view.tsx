"use client";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { formatElapsedSeconds as formatTime } from "@/lib/utils/shared/time-ago";
import { SIGNUP_STEPS as signUpSteps } from "@/lib/constants/mock-data";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import Stepper from "@/components/miscellaneous/stepper";
import { useProviderVerifyEmail } from "@/hooks/provider/verify-email/use-verify-email";

const Verify = () => {
  const {
    email,
    seconds,
    handleOTPComplete,
    resetTimer,
    verifyEmailMutation,
    router,
  } = useProviderVerifyEmail();

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <Link
          href={ROUTES.provider.singIn}
          className="bg-muted text-destructive hover:bg-muted/80 rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col justify-center px-6">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Enter Verification Code
            </h1>
            <p className="text-gray-600">
              A 6-digit verification code was just sent to{" "}
              <span className="text-primary font-semibold">
                {decodeURIComponent(email as string)}
              </span>
            </p>
          </div>
          {/* OTP Input Section */}
          <div className="space-y-6 text-center">
            {verifyEmailMutation.isPending ? (
              <div className="flex flex-col items-center gap-4">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                <p className="font-medium text-gray-600">
                  Verifying your code...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    onComplete={handleOTPComplete}
                    size={40}
                    className="flex justify-center"
                  >
                    <InputOTPSlot index={0} className="otp-slot" />
                    <InputOTPSlot index={1} className="otp-slot" />
                    <InputOTPSlot index={2} className="otp-slot" />
                    <InputOTPSlot index={3} className="otp-slot" />
                    <InputOTPSlot index={4} className="otp-slot" />
                    <InputOTPSlot index={5} className="otp-slot" />
                  </InputOTP>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button
                    disabled={seconds > 0}
                    onClick={resetTimer}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Resend code →
                  </Button>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">
                    {formatTime(seconds)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <div className="flex flex-col items-center justify-between space-y-4 border-t border-gray-500 px-4 pt-4 sm:flex-row sm:space-y-0 sm:px-6 sm:pt-6 lg:px-10">
        <Button
          onClick={() => router.back()}
          className="bg-background text-primary border-primary w-full rounded-full border-2 px-3 text-sm font-bold uppercase sm:w-auto sm:border-4 sm:px-4 sm:text-base lg:px-6 lg:text-xl"
        >
          Back
        </Button>
        <div className="ml-3 flex flex-1 justify-center">
          <Stepper steps={signUpSteps} step="Verify" />
        </div>
        <Button className="bg-background text-primary border-primary invisible w-full rounded-full border-2 px-3 text-sm font-bold uppercase sm:w-auto sm:border-4 sm:px-4 sm:text-base lg:px-6 lg:text-xl">
          Next
        </Button>
      </div>
    </div>
  );
};

export default Verify;
