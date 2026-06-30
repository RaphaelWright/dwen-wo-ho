"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HomeProfileModal } from "@/components/patient/onboarding/overlays/home-profile-modal";
import { OnboardingHostToast } from "@/components/patient/onboarding/host-toast";
import { useHostToast } from "@/hooks/components/patient/onboarding/use-host-toast";
import { ROUTES } from "@/lib/constants/infra/routes";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import { consumeShowHomeProfileModalFlag } from "@/lib/utils/patient/onboarding-session";
import type { HomeProfilePreview } from "@/lib/types/components/patient/onboarding";
import "@/styles/patient-onboarding-mock.css";
import "@/styles/patient-onboarding-light.css";

export function OnboardingHomeProfileModalGate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<HomeProfilePreview | null>(null);
  const { message, visible, showToast } = useHostToast();

  useEffect(() => {
    const {
      shouldShow,
      preview: storedPreview,
      toastMessage,
    } = consumeShowHomeProfileModalFlag();
    if (!shouldShow) {
      return;
    }

    setPreview(storedPreview);
    setOpen(true);
    if (toastMessage) {
      showToast(toastMessage);
    }
  }, [showToast]);

  return (
    <div className="patient-onboarding">
      <HomeProfileModal
        open={open}
        onOpenChange={setOpen}
        preview={preview}
        onShowToast={showToast}
        onGoToProfile={() => {
          setOpen(false);
          router.push(ROUTES.patient.profile);
        }}
        onLogout={() => {
          setOpen(false);
          showToast(ONBOARDING_COPY.toast.loggedOut);
          router.push(ROUTES.patient.join);
        }}
      />
      <OnboardingHostToast message={message} visible={visible} />
    </div>
  );
}
