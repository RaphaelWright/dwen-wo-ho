"use client";

import { m } from "motion/react";
import type { PatientCardActionProps } from "@/lib/types/components/shared/patient-card";

export function PatientCardAction({
  actionLabel,
  onClick,
}: PatientCardActionProps) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      whileHover={{
        scale: 1.03,
        backgroundColor: "var(--primary)",
        color: "#ffff",
      }}
      whileTap={{ scale: 0.97 }}
      className="bg-card shrink-0 cursor-pointer rounded-xl border px-4 py-1.5 text-[12px] font-semibold transition-all duration-300 ease-in-out"
    >
      {actionLabel}
    </m.button>
  );
}
