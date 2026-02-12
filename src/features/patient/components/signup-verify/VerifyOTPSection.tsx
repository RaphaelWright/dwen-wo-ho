"use client";

import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";

interface VerifyOTPSectionProps {
  email: string;
  seconds: number;
  onComplete: (value: string) => void;
  onResend: () => void;
}

export function VerifyOTPSection({
  email,
  seconds,
  onComplete,
  onResend,
}: VerifyOTPSectionProps) {
  return (
    <div className="grid place-items-center">
      <h1 className="text-xl lg:text-3xl md:text-3xl text-center font-extrabold">
        Enter Verification Code
      </h1>
      <h2 className="text-2xl text-gray-500 font-medium text-center">
        A 6-digit verification code was just
        <br /> sent to {email}
      </h2>
      <div className="mt-5 text-center">
        <InputOTP maxLength={6} onComplete={onComplete} size={40}>
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
            Resend code &gt;
          </Button>
          <span className="ml-4 border rounded-full p-2 text-sm">
            {formatTime(seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
