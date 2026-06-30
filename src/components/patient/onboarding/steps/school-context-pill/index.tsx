"use client";

import Image from "next/image";
import { GraduationCap, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SchoolContextPillProps } from "@/lib/types/components/patient/onboarding";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";

export function SchoolContextPill({
  schoolName,
  schoolLogo,
  schoolType,
  onChangeSchool,
}: SchoolContextPillProps) {
  const TypeIcon = schoolType === "high-school" ? School : GraduationCap;
  const typeLabel = schoolType === "high-school" ? "High School" : "College";

  return (
    <div className="border-border bg-card flex w-full items-center gap-3 rounded-2xl border px-4 py-3">
      <div className="bg-primary/15 relative size-12 shrink-0 overflow-hidden rounded-full">
        {schoolLogo ? (
          <Image
            src={schoolLogo}
            alt=""
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="text-primary flex h-full items-center justify-center">
            <TypeIcon className="size-5" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-foreground truncate text-sm font-semibold">
          {schoolName}
        </p>
        <p className="text-muted-foreground text-xs">{typeLabel}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-primary hover:text-primary/80 shrink-0"
        onClick={onChangeSchool}
      >
        {ONBOARDING_COPY.schoolType.clearSchool}
      </Button>
    </div>
  );
}
