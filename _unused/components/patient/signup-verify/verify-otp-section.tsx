import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { formatElapsedSeconds as formatTime } from "@/lib/utils/shared/time-ago";
import { VerifyOTPSectionProps } from "@/lib/types/components/patient/onboarding";
import { SIGNUP_VERIFY_TEXTS } from "@/lib/constants/components/patient/auth-copy";

export function VerifyOTPSection({
  email,
  seconds,
  onComplete,
  onResend,
}: VerifyOTPSectionProps) {
  return (
    <div className="grid place-items-center">
      <h1 className="text-center text-xl font-extrabold md:text-3xl lg:text-3xl">
        {SIGNUP_VERIFY_TEXTS.otpSection.title}
      </h1>
      <h2 className="text-muted-foreground text-center text-2xl font-medium">
        {SIGNUP_VERIFY_TEXTS.otpSection.subtitlePart1}
        <br /> {SIGNUP_VERIFY_TEXTS.otpSection.subtitlePart2} {email}
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
            className="disabled:bg-muted disabled:text-muted-foreground mt-4 rounded-md"
          >
            {SIGNUP_VERIFY_TEXTS.otpSection.resendButton}
          </Button>
          <span className="ml-4 rounded-full border p-2 text-sm">
            {formatTime(seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
