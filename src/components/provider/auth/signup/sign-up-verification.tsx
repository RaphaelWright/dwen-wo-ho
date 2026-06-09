"use client";

import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { formatTime } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loading-button";
import { Spinner } from "@/components/ui/spinner";
import { SignUpVerificationProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { useSignUpVerification } from "@/hooks/components/provider/auth/signup/use-sign-up-verification";

const SignUpVerification = (props: SignUpVerificationProps) => {
  const { email } = props;
  const {
    seconds,
    errorMessage,
    verifyEmailMutation,
    handleOTPComplete,
    handleResendCode,
    otpInputRef,
    resendVerificationEmailMutation,
  } = useSignUpVerification(props);

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {SIGN_UP_TEXTS.verification.title}
        </h1>
        <p className="text-muted-foreground">
          {SIGN_UP_TEXTS.verification.subtitle}{" "}
          <span className="font-semibold text-foreground block mt-1">
            {email}
          </span>
        </p>
      </div>

      {/* OTP Input Section */}
      <div className="text-center space-y-8">
        {verifyEmailMutation.isPending ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Spinner className="size-10 text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">
              {SIGN_UP_TEXTS.verification.verifying}
            </p>
          </div>
        ) : (
          <div className="mx-auto flex w-fit flex-col gap-8">
            <InputOTP
              ref={otpInputRef}
              maxLength={6}
              onComplete={handleOTPComplete}
              containerClassName="gap-2 flex justify-center"
            >
              <InputOTPSlot
                index={0}
                className="w-12 h-14 text-2xl font-bold border rounded-lg border-input bg-muted/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
              <InputOTPSlot
                index={1}
                className="w-12 h-14 text-2xl font-bold border rounded-lg border-input bg-muted/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
              <InputOTPSlot
                index={2}
                className="w-12 h-14 text-2xl font-bold border rounded-lg border-input bg-muted/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
              <InputOTPSlot
                index={3}
                className="w-12 h-14 text-2xl font-bold border rounded-lg border-input bg-muted/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
              <InputOTPSlot
                index={4}
                className="w-12 h-14 text-2xl font-bold border rounded-lg border-input bg-muted/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
              <InputOTPSlot
                index={5}
                className="w-12 h-14 text-2xl font-bold border rounded-lg border-input bg-muted/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
            </InputOTP>

            <LoadingButton
              variant="outline"
              loading={resendVerificationEmailMutation.isPending}
              loadingText={SIGN_UP_TEXTS.verification.resending}
              disabled={seconds > 0}
              onClick={handleResendCode}
              className="w-full h-12 text-base font-medium hover:bg-muted/50 transition-colors"
            >
              {seconds > 0 ? (
                <span className="flex items-center gap-2">
                  Resend code in{" "}
                  <span className="font-bold text-primary w-8">
                    {formatTime(seconds)}
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {SIGN_UP_TEXTS.verification.resend} →
                </span>
              )}
            </LoadingButton>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />
            <p className="text-destructive text-sm font-medium">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpVerification;
