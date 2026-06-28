"use client";

import { useEffect, useState } from "react";
import { HomeProfileModal } from "@/components/patient/onboarding/overlays/home-profile-modal";
import { consumeShowHomeProfileModalFlag } from "@/lib/utils/patient/onboarding-session";

export function OnboardingHomeProfileModalGate() {
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const { shouldShow, nickname: storedNickname } =
      consumeShowHomeProfileModalFlag();
    if (shouldShow) {
      setNickname(storedNickname);
      setOpen(true);
    }
  }, []);

  return (
    <HomeProfileModal open={open} onOpenChange={setOpen} nickname={nickname} />
  );
}
