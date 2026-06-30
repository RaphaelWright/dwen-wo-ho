"use client";

import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { ContactFieldSubmitProps } from "@/lib/types/components/patient/onboarding";

export function ContactFieldSubmit({
  children,
  onSubmit,
}: ContactFieldSubmitProps) {
  return (
    <div className="flex items-stretch gap-2">
      <div className="min-w-0 flex-1">{children}</div>
      <Button
        type="button"
        aria-label={ONBOARDING_COPY.contact.continue}
        onClick={onSubmit}
        className="bg-primary text-primary-foreground hover:bg-primary/90 size-10 shrink-0 rounded-full"
      >
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  );
}
