"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
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
}: PhoneFieldProps) {
  return (
    <div
      className={cn(
        "group border-input bg-background focus-within:border-ring focus-within:ring-primary/50 flex h-10 items-stretch overflow-hidden rounded-md border shadow-xs transition-all duration-200 focus-within:ring",
        validationState === "valid" && "border-success ring-success/30 ring-1",
        validationState === "invalid" &&
          "border-destructive ring-destructive/30 ring-1",
      )}
    >
      <div className="border-border bg-muted/40 pointer-events-none flex shrink-0 items-center gap-1.5 border-r px-2 sm:px-3">
        <Image
          src={ONBOARDING_GHANA_PHONE.flagSrc}
          alt=""
          width={24}
          height={16}
          className="rounded-sm object-cover"
          aria-hidden
        />
        <span className="text-foreground text-sm font-medium tabular-nums">
          {ONBOARDING_GHANA_PHONE.countryCode}
        </span>
      </div>
      <div className="relative min-w-0 flex-1">
        <Input
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
          className="h-full rounded-none border-0 pl-2 shadow-none focus-visible:ring-0 sm:pl-3"
        />
      </div>
    </div>
  );
}
