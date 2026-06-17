"use client";

import { ChevronLeft } from "lucide-react";
import { m } from "motion/react";
import type { SchoolDetailsBackNavProps } from "@/lib/types/components/curator/school-details/school-details";

export function SchoolDetailsBackNav({ onBack }: SchoolDetailsBackNavProps) {
  return (
    <m.button
      type="button"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: -4 }}
      onClick={onBack}
      className="group text-muted-foreground hover:text-foreground mb-6 flex w-fit items-center gap-2 text-sm font-medium transition-colors"
    >
      <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      Back to Schools
    </m.button>
  );
}
