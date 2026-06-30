"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedModalShell } from "@/components/overlays/shared/animated-modal-shell";
import { ROUTES } from "@/lib/constants/infra/routes";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { HomeProfileModalProps } from "@/lib/types/components/patient/onboarding";
import { formatClassOf } from "@/lib/utils/patient/onboarding-class";

function computeAge(birthYear: string): number | null {
  const year = Number.parseInt(birthYear, 10);
  if (Number.isNaN(year)) {
    return null;
  }
  return new Date().getFullYear() - year;
}

export function HomeProfileModal({
  open,
  onOpenChange,
  preview,
}: HomeProfileModalProps) {
  const router = useRouter();
  const age = preview ? computeAge(preview.birthYear) : null;
  const graduationLabel =
    preview?.graduationYear != null
      ? formatClassOf(preview.graduationYear)
      : null;

  const handleConfirm = () => {
    onOpenChange(false);
    router.push(ROUTES.patient.profile);
  };

  return (
    <AnimatedModalShell
      isOpen={open && preview !== null}
      onClose={() => onOpenChange(false)}
      contentClassName="max-w-sm"
      panelClassName="bg-background text-foreground border-border rounded-3xl border-2 shadow-2xl"
    >
      {preview ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-profile-modal-title"
          className="relative overflow-hidden"
        >
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:bg-destructive/5 hover:text-destructive absolute top-4 right-4 z-10 rounded-full p-1 transition-colors"
            aria-label={ONBOARDING_COPY.homeModal.dismiss}
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <div className="flex flex-col items-center px-6 pt-10 pb-6 text-center">
            <div className="border-primary relative size-24 overflow-hidden rounded-full border-4">
              {preview.profilePhotoUrl ? (
                <Image
                  src={preview.profilePhotoUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="bg-primary/20 text-foreground flex h-full items-center justify-center text-2xl font-bold">
                  {preview.nickname.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <p className="text-primary mt-4 text-sm font-semibold">
              @{preview.nickname}
            </p>
            <h2
              id="home-profile-modal-title"
              className="font-heading text-foreground mt-1 text-xl font-semibold"
            >
              {preview.fullName}
            </h2>

            <div className="text-muted-foreground mt-4 flex w-full justify-center gap-6 text-sm">
              {age !== null ? (
                <div>
                  <p className="text-foreground font-semibold">{age}</p>
                  <p className="text-xs">
                    {ONBOARDING_COPY.homeModal.ageLabel}
                  </p>
                </div>
              ) : null}
              {preview.gender ? (
                <div>
                  <p className="text-foreground font-semibold capitalize">
                    {preview.gender}
                  </p>
                  <p className="text-xs">
                    {ONBOARDING_COPY.homeModal.genderLabel}
                  </p>
                </div>
              ) : null}
              <div>
                <p className="text-foreground font-semibold">
                  {preview.contactMode === "phone"
                    ? preview.phone
                    : preview.email}
                </p>
                <p className="text-xs">
                  {preview.contactMode === "phone"
                    ? ONBOARDING_COPY.homeModal.phoneLabel
                    : ONBOARDING_COPY.homeModal.emailLabel}
                </p>
              </div>
            </div>

            {graduationLabel ? (
              <p className="text-success mt-5 text-sm font-semibold">
                {graduationLabel} ({preview.gradeShort})
              </p>
            ) : null}

            <div className="border-border bg-muted text-foreground mt-4 rounded-full border px-4 py-2 text-xs font-semibold">
              {preview.schoolName} · {preview.programme}
            </div>

            <p className="text-muted-foreground mt-4 text-sm">
              {ONBOARDING_COPY.homeModal.subtitle}
            </p>

            <div className="mt-6 flex w-full flex-col gap-2">
              <Button
                type="button"
                className="h-11 w-full rounded-full"
                onClick={handleConfirm}
              >
                {ONBOARDING_COPY.homeModal.cta}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground h-10 w-full rounded-full"
                onClick={() => onOpenChange(false)}
              >
                {ONBOARDING_COPY.homeModal.dismiss}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </AnimatedModalShell>
  );
}
