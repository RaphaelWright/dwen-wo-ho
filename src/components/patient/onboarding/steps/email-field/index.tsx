"use client";

import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { EmailFieldProps } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

export function EmailField({
  value,
  validationState,
  onChange,
  onBlur,
  submitDisabled,
  onSubmit,
}: EmailFieldProps) {
  return (
    <div className="entry-row">
      <div
        className={cn(
          "input-box email-box",
          validationState === "valid" && "success",
          validationState === "invalid" && "error",
        )}
        style={{ flex: 1 }}
      >
        <div className="box-title">EMAIL</div>
        <div className="input-wrap">
          <input
            id="patient-email"
            type="email"
            autoComplete="email"
            placeholder={ONBOARDING_COPY.contact.emailPlaceholder}
            value={value}
            onBlur={onBlur}
            onChange={(event) => onChange(event.target.value)}
          />
          <button
            type="button"
            className={cn("submit-icon", !submitDisabled && "active")}
            disabled={submitDisabled}
            aria-label="Continue"
            onClick={onSubmit}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
