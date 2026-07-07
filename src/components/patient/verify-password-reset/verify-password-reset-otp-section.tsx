import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { formatElapsedSeconds as formatTime } from "@/lib/utils/shared/time-ago";
import { VerifyPasswordResetOTPSectionProps } from "@/lib/types/components/patient/verify-password-reset";
import { VERIFY_PASSWORD_RESET_TEXTS } from "@/lib/constants/components/patient/auth-copy";
import { IoSendOutline, IoTimerOutline } from "react-icons/io5";

export function VerifyPasswordResetOTPSection({
  email,
  seconds,
  onComplete,
  onResend,
}: VerifyPasswordResetOTPSectionProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-lg flex-col items-center duration-700">
      <div className="mb-6 space-y-3 text-center sm:mb-8">
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          {VERIFY_PASSWORD_RESET_TEXTS.otpSection.title}
        </h1>
        <div className="flex flex-col items-center gap-1">
          <p className="text-muted-foreground text-sm font-medium">
            {VERIFY_PASSWORD_RESET_TEXTS.otpSection.subtitlePart1}
          </p>
          <span className="bg-primary/10 text-primary max-w-full rounded-full px-3 py-1 text-sm font-semibold break-all">
            {email}
          </span>
        </div>
      </div>

      <div className="mb-6 flex w-full justify-center overflow-x-auto sm:mb-8">
        <InputOTP maxLength={6} onComplete={onComplete}>
          <InputOTPGroup>
            <InputOTPSlot
              index={0}
              className="h-9 w-9 text-base sm:h-12 sm:w-12 sm:text-xl"
            />
            <InputOTPSlot
              index={1}
              className="h-9 w-9 text-base sm:h-12 sm:w-12 sm:text-xl"
            />
            <InputOTPSlot
              index={2}
              className="h-9 w-9 text-base sm:h-12 sm:w-12 sm:text-xl"
            />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot
              index={3}
              className="h-9 w-9 text-base sm:h-12 sm:w-12 sm:text-xl"
            />
            <InputOTPSlot
              index={4}
              className="h-9 w-9 text-base sm:h-12 sm:w-12 sm:text-xl"
            />
            <InputOTPSlot
              index={5}
              className="h-9 w-9 text-base sm:h-12 sm:w-12 sm:text-xl"
            />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        {seconds > 0 ? (
          <div className="text-muted-foreground bg-muted/50 border-border/50 animate-in fade-in flex items-center gap-2 rounded-full border px-4 py-2">
            <IoTimerOutline className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium tabular-nums">
              Resend code in {formatTime(seconds)}
            </span>
          </div>
        ) : (
          <Button
            onClick={onResend}
            variant="ghost"
            className="group text-primary hover:text-primary hover:bg-primary/10 flex items-center gap-2 transition-all duration-300"
          >
            <IoSendOutline className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            <span className="font-semibold">
              {VERIFY_PASSWORD_RESET_TEXTS.otpSection.resendButton}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
