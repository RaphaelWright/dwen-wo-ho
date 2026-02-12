"use client";

import { Button } from "@/components/ui/button";
import Stepper from "@/components/stepper";
import { recoverSteps } from "@/lib/utils";

interface VerifyPasswordResetFooterProps {
  onBack: () => void;
}

export function VerifyPasswordResetFooter({
  onBack,
}: VerifyPasswordResetFooterProps) {
  return (
    <div className="flex border-t border-gray-500 px-10 pt-5 items-center justify-between">
      <Button
        onClick={onBack}
        className="rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase"
      >
        Back
      </Button>
      <Stepper steps={recoverSteps} step="Verify" />
      <Button className="invisible rounded-full px-6 border-4 bg-white text-[#955aa4] text-xl font-bold border-[#955aa4] uppercase">
        Next
      </Button>
    </div>
  );
}
