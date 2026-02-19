"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Suspense, useEffect, useState } from "react";
import { formatTime, recoverSteps } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import Stepper from "@/components/miscellaneous/stepper";
import { ArrowRightIcon } from "lucide-react";
import { VerifyPasswordResetProps } from "@/lib/types/provider/auth";
import { VERIFY_PASSWORD_RESET_TEXTS } from "@/lib/constants/components/provider/auth/verify-password-reset";
import { useVerifyPasswordReset } from "@/hooks/components/provider/auth/use-verify-password-reset";
import { useTheme } from "next-themes";

const VerifyContent = (props: VerifyPasswordResetProps) => {
  const { seconds, email, handleOTPComplete, handleResend, handleBack } =
    useVerifyPasswordReset(props);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-full flex flex-col justify-between min-h-screen py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative z-10 flex items-center px-8 justify-between w-full">
        <div className="transform hover:scale-105 transition-transform duration-300">
          <Logo variant={mounted && theme === "light" ? "black" : "white"} />
        </div>
        <Link
          href={ROUTES.provider.auth}
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50 px-4 py-2 rounded-full"
        >
          {VERIFY_PASSWORD_RESET_TEXTS.header.signIn}
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 md:px-12 w-full max-w-md mx-auto">
        <div className="w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {VERIFY_PASSWORD_RESET_TEXTS.content.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {VERIFY_PASSWORD_RESET_TEXTS.content.subtitlePart1}{" "}
              <span className="font-semibold text-foreground block mt-1">
                {decodeURIComponent(email as string)}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <InputOTP
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

            <div className="flex flex-col items-center gap-4 w-full">
              <Button
                variant="outline"
                disabled={seconds > 0}
                onClick={handleResend}
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
                    {VERIFY_PASSWORD_RESET_TEXTS.content.resendButton}{" "}
                    <ArrowRightIcon className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-t border-border px-8 pt-6 items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">
            ←
          </span>{" "}
          {VERIFY_PASSWORD_RESET_TEXTS.footer.back}
        </Button>
        <div className="hidden sm:block">
          <Stepper steps={recoverSteps} step="Verify" />
        </div>
        <div className="w-24" />{" "}
        {/* Spacer to balance the flex justify-between if needed, or hide stepper on mobile */}
      </div>
    </div>
  );
};

const Verify = (props: VerifyPasswordResetProps) => {
  return (
    <Suspense fallback={<div>{VERIFY_PASSWORD_RESET_TEXTS.loading}</div>}>
      <VerifyContent {...props} />
    </Suspense>
  );
};

export default Verify;
