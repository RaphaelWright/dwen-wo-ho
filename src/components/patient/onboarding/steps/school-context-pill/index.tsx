"use client";

import type { SchoolContextPillProps } from "@/lib/types/components/patient/onboarding";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";
import { cn } from "@/lib/utils";

export function SchoolContextPill({
  schoolName,
  schoolLogo,
  schoolType,
  onChangeSchool,
}: SchoolContextPillProps) {
  const typeLabel = schoolType === "high-school" ? "High School" : "College";
  const badgeLabel = schoolName.trim().charAt(0).toUpperCase();

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn("school-context-pill", schoolName && "show")}
      onClick={onChangeSchool}
      onKeyDown={activateOnKeyboard(onChangeSchool)}
    >
      <div
        className="mini-badge"
        style={
          schoolLogo
            ? {
                backgroundImage: `url(${schoolLogo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {!schoolLogo ? badgeLabel : null}
      </div>
      <div className="txt">
        {schoolName} <span>· {typeLabel}</span>
      </div>
    </div>
  );
}
