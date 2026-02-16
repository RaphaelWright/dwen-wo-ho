"use client";

import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignUpVerificationProps } from "@/lib/types/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { useSignUpVerification } from "@/hooks/components/provider/auth/signup/use-sign-up-verification";

const SignUpVerification = (props: SignUpVerificationProps) => {
  const { email } = props;
  const {
    seconds,
    errorMessage,
    verifyEmailMutation,
    sendVerificationEmailMutation,
    handleOTPComplete,
    handleResendCode,
  } = useSignUpVerification(props);

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {SIGN_UP_TEXTS.verification.title}
        </h1>
        <p className="text-gray-600">
          {SIGN_UP_TEXTS.verification.subtitle}{" "}
          <span className="font-semibold text-[#955aa4]">{email}</span>
        </p>
      </div>

      {/* OTP Input Section */}
      <div className="text-center space-y-6">
        {verifyEmailMutation.isPending ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-[#955aa4] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">
              {SIGN_UP_TEXTS.verification.verifying}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                onComplete={handleOTPComplete}
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
                disabled={
                  seconds > 0 || sendVerificationEmailMutation.isPending
                }
                onClick={handleResendCode}
                className="rounded-lg px-4 py-2 text-sm font-medium bg-[#955aa4] text-white hover:bg-[#955aa4]/80 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
              >
                {sendVerificationEmailMutation.isPending
                  ? SIGN_UP_TEXTS.verification.sending
                  : `${SIGN_UP_TEXTS.verification.resend} →`}
              </Button>
              <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                {formatTime(seconds)}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-center text-sm font-medium">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpVerification;
