"use client";

import { Input } from "@/components/ui/input";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { EmailFieldProps } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

export function EmailField({
  value,
  validationState,
  onChange,
  onBlur,
}: EmailFieldProps) {
  return (
    <Input
      id="patient-email"
      type="email"
      autoComplete="email"
      placeholder={ONBOARDING_COPY.contact.emailPlaceholder}
      value={value}
      onBlur={onBlur}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        validationState === "valid" && "border-success ring-success/30 ring-1",
        validationState === "invalid" &&
          "border-destructive ring-destructive/30 ring-1",
      )}
    />
  );
}
