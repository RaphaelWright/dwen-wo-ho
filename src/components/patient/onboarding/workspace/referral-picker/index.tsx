"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ONBOARDING_COPY,
  ONBOARDING_REFERRAL_INFLUENCERS,
} from "@/lib/constants/components/patient/onboarding";
import type { OnboardingReferralPickerProps } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

export function OnboardingReferralPicker({
  referralHandle,
  onReferralChange,
}: OnboardingReferralPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const handle =
    referralHandle ?? ONBOARDING_REFERRAL_INFLUENCERS[0]?.handle ?? "Setornam";

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div className="referral-picker" ref={rootRef}>
      <button
        className="referral-pill"
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ONBOARDING_COPY.referralPickerLabel}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="sun">☀️</span>
        {ONBOARDING_COPY.referralPrefix}{" "}
        <span className="handle">@{handle}</span> 🧑‍🎓
      </button>

      <div
        className={cn("referral-picker-menu", open && "open")}
        id={listId}
        role="listbox"
        aria-label={ONBOARDING_COPY.referralPickerLabel}
      >
        <button
          className="referral-picker-option"
          type="button"
          role="option"
          aria-selected={referralHandle === null}
          onClick={() => {
            onReferralChange(null);
            setOpen(false);
          }}
        >
          {ONBOARDING_COPY.referralNone}
        </button>
        {ONBOARDING_REFERRAL_INFLUENCERS.map((influencer) => (
          <button
            key={influencer.handle}
            className="referral-picker-option"
            type="button"
            role="option"
            aria-selected={referralHandle === influencer.handle}
            onClick={() => {
              onReferralChange(influencer.handle);
              setOpen(false);
            }}
          >
            @{influencer.handle}
          </button>
        ))}
      </div>
    </div>
  );
}
