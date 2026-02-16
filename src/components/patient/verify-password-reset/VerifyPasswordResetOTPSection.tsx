import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { VerifyPasswordResetOTPSectionProps } from "@/lib/types/components/patient/verify-password-reset";
import { VERIFY_PASSWORD_RESET_TEXTS } from "@/lib/constants/components/patient/verify-password-reset";

export function VerifyPasswordResetOTPSection({
  email,
  seconds,
  onComplete,
  onResend,
}: VerifyPasswordResetOTPSectionProps) {
  return (
    <div className="grid place-items-center">
      <h1 className="text-5xl text-center font-extrabold">
        {VERIFY_PASSWORD_RESET_TEXTS.otpSection.title}
      </h1>
      <h2 className="text-2xl text-gray-500 font-medium text-center">
        {VERIFY_PASSWORD_RESET_TEXTS.otpSection.subtitlePart1} {email}
      </h2>
      <div className="mt-5 text-center">
        <InputOTP maxLength={6} onComplete={onComplete}>
          <InputOTPSlot index={0} className="otp-slot" />
          <InputOTPSlot index={1} className="otp-slot" />
          <InputOTPSlot index={2} className="otp-slot" />
          <InputOTPSlot index={3} className="otp-slot" />
          <InputOTPSlot index={4} className="otp-slot" />
          <InputOTPSlot index={5} className="otp-slot" />
        </InputOTP>
        <div>
          <Button
            disabled={seconds > 0}
            onClick={onResend}
            className="rounded-md mt-4 disabled:bg-gray-300"
          >
            {VERIFY_PASSWORD_RESET_TEXTS.otpSection.resendButton}
          </Button>
          <span className="ml-4 border rounded-full p-2 text-sm">
            {formatTime(seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
