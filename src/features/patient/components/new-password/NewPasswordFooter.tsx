"use client";

import { Button } from "@/components/ui/button";
import Stepper from "@/components/stepper";
import { recoverSteps } from "@/lib/utils";

interface NewPasswordFooterProps {
  onBack: () => void;
}

export function NewPasswordFooter({ onBack }: NewPasswordFooterProps) {
  return (
    <div className="flex border-t border-gray-500 px-10 pt-10 items-center justify-between">
      <Button
        onClick={onBack}
        className="none rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase"
      >
        Back
      </Button>
      <Stepper steps={recoverSteps} step="New Password" />
      <input
        form="login-form"
        type="submit"
        value="DONE"
        className="text-xl px-7 py-1 border-4 font-bold border-[#955aa4] rounded-full text-white bg-[#955aa4]/50"
      />
    </div>
  );
}
