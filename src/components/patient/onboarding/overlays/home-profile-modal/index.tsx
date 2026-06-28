"use client";

import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ROUTES } from "@/lib/constants/infra/routes";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { HomeProfileModalProps } from "@/lib/types/components/patient/onboarding";

export function HomeProfileModal({
  open,
  onOpenChange,
  nickname,
}: HomeProfileModalProps) {
  const router = useRouter();

  const title = nickname
    ? `${ONBOARDING_COPY.homeModal.title}, ${nickname}`
    : ONBOARDING_COPY.homeModal.title;

  const handleConfirm = () => {
    onOpenChange(false);
    router.push(ROUTES.patient.profile);
  };

  return (
    <ConfirmationModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title={title}
      message={ONBOARDING_COPY.homeModal.subtitle}
      confirmText={ONBOARDING_COPY.homeModal.cta}
      cancelText={ONBOARDING_COPY.homeModal.dismiss}
      variant="success"
    />
  );
}
