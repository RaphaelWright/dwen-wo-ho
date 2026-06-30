"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ONBOARDING_COPY,
  ONBOARDING_REFERRAL_INFLUENCERS,
} from "@/lib/constants/components/patient/onboarding";
import type { OnboardingReferralPickerProps } from "@/lib/types/components/patient/onboarding";

export function OnboardingReferralPicker({
  referralHandle,
  onReferralChange,
}: OnboardingReferralPickerProps) {
  const hasReferral = Boolean(referralHandle);
  const influencers =
    referralHandle &&
    !ONBOARDING_REFERRAL_INFLUENCERS.some(
      (item) => item.handle === referralHandle,
    )
      ? [
          { handle: referralHandle, label: referralHandle },
          ...ONBOARDING_REFERRAL_INFLUENCERS,
        ]
      : ONBOARDING_REFERRAL_INFLUENCERS;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="border-border bg-muted/50 text-foreground hover:bg-accent hover:text-accent-foreground inline-flex max-w-full min-w-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm"
        aria-label={
          hasReferral
            ? `${ONBOARDING_COPY.referralPrefix} @${referralHandle}. ${ONBOARDING_COPY.referralPickerLabel}`
            : `${ONBOARDING_COPY.referralOnly}. ${ONBOARDING_COPY.referralPickerLabel}`
        }
      >
        {hasReferral ? (
          <>
            <span className="text-muted-foreground shrink-0">
              {ONBOARDING_COPY.referralPrefix}
            </span>
            <span className="text-primary min-w-0 truncate font-semibold">
              @{referralHandle}
            </span>
          </>
        ) : (
          <span className="truncate font-medium">
            {ONBOARDING_COPY.referralOnly}
          </span>
        )}
        <ChevronDown
          className="text-muted-foreground size-3.5 shrink-0 sm:size-4"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {ONBOARDING_COPY.referralPickerLabel}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onReferralChange(null)}
          className="justify-between"
        >
          {ONBOARDING_COPY.referralNone}
          {!hasReferral ? (
            <Check className="text-primary size-4" aria-hidden="true" />
          ) : null}
        </DropdownMenuItem>
        {influencers.map((influencer) => {
          const isSelected = referralHandle === influencer.handle;

          return (
            <DropdownMenuItem
              key={influencer.handle}
              onClick={() => onReferralChange(influencer.handle)}
              className="justify-between"
            >
              @{influencer.label}
              {isSelected ? (
                <Check className="text-primary size-4" aria-hidden="true" />
              ) : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
