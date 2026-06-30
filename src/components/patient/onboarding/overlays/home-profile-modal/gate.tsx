"use client";

import { useEffect, useState } from "react";
import { HomeProfileModal } from "@/components/patient/onboarding/overlays/home-profile-modal";
import { consumeShowHomeProfileModalFlag } from "@/lib/utils/patient/onboarding-session";
import type { HomeProfilePreview } from "@/lib/types/components/patient/onboarding";

export function OnboardingHomeProfileModalGate() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<HomeProfilePreview | null>(null);

  useEffect(() => {
    const { shouldShow, preview: storedPreview } =
      consumeShowHomeProfileModalFlag();
    if (shouldShow) {
      setPreview(storedPreview);
      setOpen(true);
    }
  }, []);

  return (
    <HomeProfileModal open={open} onOpenChange={setOpen} preview={preview} />
  );
}
