"use client";

import {
  ONBOARDING_COPY,
  ONBOARDING_GHANA_PHONE,
} from "@/lib/constants/components/patient/onboarding";
import type { PhoneFieldProps } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

export function PhoneField({
  value,
  validationState,
  onChange,
  onBlur,
  submitDisabled,
  onSubmit,
}: PhoneFieldProps) {
  return (
    <div className="entry-row">
      <div className="input-box code-box">
        <div className="box-title">GHANA</div>
        <div className="code-content">
          <span className="flag">🇬🇭</span>
          <span>{ONBOARDING_GHANA_PHONE.countryCode}</span>
        </div>
      </div>
      <div
        className={cn(
          "input-box phone-box",
          validationState === "valid" && "success",
          validationState === "invalid" && "error",
        )}
      >
        <div className="box-title">PHONE NUMBER</div>
        <div className="input-wrap">
          <input
            id="patient-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={ONBOARDING_COPY.contact.phonePlaceholder}
            value={value}
            maxLength={ONBOARDING_GHANA_PHONE.maxLength}
            onBlur={onBlur}
            onChange={(event) =>
              onChange(
                event.target.value
                  .replace(/\D/g, "")
                  .slice(0, ONBOARDING_GHANA_PHONE.maxLength),
              )
            }
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
