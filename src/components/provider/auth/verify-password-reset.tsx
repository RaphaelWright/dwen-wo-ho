"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Suspense } from "react";
import { formatTime, recoverSteps } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import Stepper from "@/components/miscellaneous/stepper";
import { ArrowRightIcon } from "lucide-react";
import { VerifyPasswordResetProps } from "@/lib/types/provider/auth";
import { VERIFY_PASSWORD_RESET_TEXTS } from "@/lib/constants/components/provider/auth/verify-password-reset";
import { useVerifyPasswordReset } from "@/hooks/components/provider/auth/use-verify-password-reset";

const VerifyContent = (props: VerifyPasswordResetProps) => {
  const { seconds, email, handleOTPComplete, handleResend, handleBack } =
    useVerifyPasswordReset(props);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center p-6 justify-between w-full">
        <Logo />
        <Link
          href={ROUTES.provider.auth}
          className="bg-gray-300 text-[#ed1c24] rounded-md px-6 py-1"
        >
          {VERIFY_PASSWORD_RESET_TEXTS.header.signIn}
        </Link>
      </div>
      <div className="flex-1 grid place-items-center">
        <div className="w-full max-w-2xl px-4">
          <h1 className="lg:text-4xl md:text-3xl text-2xl text-center font-extrabold">
            {VERIFY_PASSWORD_RESET_TEXTS.content.title}
          </h1>
          <h2 className="text-xl text-wrap px-14 text-gray-500 font-medium text-center">
            {VERIFY_PASSWORD_RESET_TEXTS.content.subtitlePart1}{" "}
            {decodeURIComponent(email as string)}
          </h2>
          <div className="mt-5 flex flex-col items-center">
            <InputOTP
              className="text-green-600"
              maxLength={6}
              onComplete={handleOTPComplete}
            >
              <InputOTPSlot index={0} className="otp-slot" />
              <InputOTPSlot index={1} className="otp-slot" />
              <InputOTPSlot index={2} className="otp-slot" />
              <InputOTPSlot index={3} className="otp-slot" />
              <InputOTPSlot index={4} className="otp-slot" />
              <InputOTPSlot index={5} className="otp-slot" />
            </InputOTP>
            <div className="flex items-center justify-center mt-5">
              <Button
                disabled={seconds > 0}
                onClick={handleResend}
                className="rounded-md bg-[#2b3990] disabled:bg-[#2b3990]/50"
              >
                {VERIFY_PASSWORD_RESET_TEXTS.content.resendButton}{" "}
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
              <span className="ml-4 border w-10 h-10 flex items-center justify-center rounded-full p-2 text-sm">
                {formatTime(seconds)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-t border-gray-500 px-10 pt-5 pb-5 items-center justify-between">
        <Button
          onClick={handleBack}
          className="rounded-full px-8 py-1 border-4 bg-white text-[#955aa4] text-lg font-bold border-[#955aa4] uppercase flex items-center justify-center hover:bg-white"
        >
          {VERIFY_PASSWORD_RESET_TEXTS.footer.back}
        </Button>
        <Stepper steps={recoverSteps} step="Verify" />
        <Button className="invisible rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase">
          {VERIFY_PASSWORD_RESET_TEXTS.footer.next}
        </Button>
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
