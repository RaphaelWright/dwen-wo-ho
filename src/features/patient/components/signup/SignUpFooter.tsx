"use client";

import { Button } from "@/components/ui/button";
import Stepper from "@/components/stepper";
import { signUpSteps } from "@/lib/utils";

interface SignUpFooterProps {
  onBack: () => void;
}

export function SignUpFooter({ onBack }: SignUpFooterProps) {
  return (
    <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
      <Button
        onClick={onBack}
        className="rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase"
      >
        Back
      </Button>
      <Stepper steps={signUpSteps} step="Create" />
      <input
        form="login-form"
        type="submit"
        value={"Next"}
        className="text-xl px-6 py-2 border-4 font-bold border-[#955aa4] rounded-md text-white bg-[#955aa4]/50 cursor-pointer hover:bg-[#955aa4]/70 transition-colors"
      />
    </div>
  );
}
