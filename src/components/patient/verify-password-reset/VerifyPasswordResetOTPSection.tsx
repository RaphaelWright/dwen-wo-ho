import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { VerifyPasswordResetOTPSectionProps } from "@/lib/types/components/patient/verify-password-reset";
import { VERIFY_PASSWORD_RESET_TEXTS } from "@/lib/constants/components/patient/verify-password-reset";
import { Timer, Send } from "lucide-react";

export function VerifyPasswordResetOTPSection({
  email,
  seconds,
  onComplete,
  onResend,
}: VerifyPasswordResetOTPSectionProps) {
  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {VERIFY_PASSWORD_RESET_TEXTS.otpSection.title}
        </h1>
        <div className="flex flex-col items-center gap-1">
          <p className="text-muted-foreground text-sm font-medium">
            {VERIFY_PASSWORD_RESET_TEXTS.otpSection.subtitlePart1}
          </p>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
            {email}
          </span>
        </div>
      </div>

      <div className="w-full flex justify-center mb-8">
        <InputOTP maxLength={6} onComplete={onComplete}>
          <InputOTPGroup>
            <InputOTPSlot
              index={0}
              className="h-10 w-10 sm:h-12 sm:w-12 text-lg sm:text-xl"
            />
            <InputOTPSlot
              index={1}
              className="h-10 w-10 sm:h-12 sm:w-12 text-lg sm:text-xl"
            />
            <InputOTPSlot
              index={2}
              className="h-10 w-10 sm:h-12 sm:w-12 text-lg sm:text-xl"
            />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot
              index={3}
              className="h-10 w-10 sm:h-12 sm:w-12 text-lg sm:text-xl"
            />
            <InputOTPSlot
              index={4}
              className="h-10 w-10 sm:h-12 sm:w-12 text-lg sm:text-xl"
            />
            <InputOTPSlot
              index={5}
              className="h-10 w-10 sm:h-12 sm:w-12 text-lg sm:text-xl"
            />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        {seconds > 0 ? (
          <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50 animate-in fade-in">
            <Timer className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium tabular-nums">
              Resend code in {formatTime(seconds)}
            </span>
          </div>
        ) : (
          <Button
            onClick={onResend}
            variant="ghost"
            className="group flex items-center gap-2 text-primary hover:text-primary hover:bg-primary/10 transition-all duration-300"
          >
            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span className="font-semibold">
              {VERIFY_PASSWORD_RESET_TEXTS.otpSection.resendButton}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
