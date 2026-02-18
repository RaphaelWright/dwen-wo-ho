import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { VerifyOTPSectionProps } from "@/lib/types/components/patient/signup-verify";
import { SIGNUP_VERIFY_TEXTS } from "@/lib/constants/components/patient/signup-verify";

export function VerifyOTPSection({
  email,
  seconds,
  onComplete,
  onResend,
}: VerifyOTPSectionProps) {
  return (
    <div className="grid place-items-center">
      <h1 className="text-xl lg:text-3xl md:text-3xl text-center font-extrabold">
        {SIGNUP_VERIFY_TEXTS.otpSection.title}
      </h1>
      <h2 className="text-2xl text-muted-foreground font-medium text-center">
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
            className="rounded-md mt-4 disabled:bg-muted disabled:text-muted-foreground"
          >
            {SIGNUP_VERIFY_TEXTS.otpSection.resendButton}
          </Button>
          <span className="ml-4 border rounded-full p-2 text-sm">
            {formatTime(seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
