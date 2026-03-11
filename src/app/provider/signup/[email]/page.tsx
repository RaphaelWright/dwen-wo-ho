"use client";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { formatTime, signUpSteps } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import Stepper from "@/components/miscellaneous/stepper";
import { useProviderVerifyEmail } from "@/hooks/provider/use-provider-verify-email";

const Verify = () => {
  const {
    email,
    seconds,
    errorMessage,
    handleOTPComplete,
    resetTimer,
    verifyEmailMutation,
    router,
  } = useProviderVerifyEmail();

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center px-4 sm:px-6 lg:px-8 justify-between w-full">
        <Logo />
        <Link
          href={ROUTES.provider.singIn}
          className="bg-muted text-destructive rounded-full px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enter Verification Code
            </h1>
            <p className="text-gray-600">
              A 6-digit verification code was just sent to{" "}
              <span className="font-semibold text-primary">
                {decodeURIComponent(email as string)}
              </span>
            </p>
          </div>
          {/* OTP Input Section */}
          <div className="text-center space-y-6">
            {verifyEmailMutation.isPending ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">
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
                    className="rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors"
                  >
                    Resend code →
                  </Button>
                  <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                    {formatTime(seconds)}
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive text-center text-sm font-medium">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row border-t border-gray-500 px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 items-center justify-between space-y-4 sm:space-y-0">
        <Button
          onClick={() => router.back()}
          className="rounded-full px-3 sm:px-4 lg:px-6 border-2 sm:border-4 bg-background text-primary text-sm sm:text-base lg:text-xl font-bold border-primary uppercase w-full sm:w-auto"
        >
          Back
        </Button>
        <div className="flex-1 flex justify-center ml-3">
          <Stepper steps={signUpSteps} step="Verify" />
        </div>
        <Button className="invisible rounded-full px-3 sm:px-4 lg:px-6 border-2 sm:border-4 bg-background text-primary text-sm sm:text-base lg:text-xl font-bold border-primary uppercase w-full sm:w-auto">
          Next
        </Button>
      </div>
    </div>
  );
};

export default Verify;
