"use client";

import { CheckCircle2, Upload } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { PhotoCropperOverlay } from "@/components/shared/overlays/photo-cropper";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { usePatientPhotoStep } from "@/hooks/components/patient/onboarding/photo-step/use-photo-step";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { ProfilePhotoStepProps } from "@/lib/types/components/patient/onboarding";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";

export function ProfilePhotoStep({
  profilePhotoUrl,
  onPhotoChange,
}: ProfilePhotoStepProps) {
  const {
    isPhotoModalOpen,
    setIsPhotoModalOpen,
    imageSrc,
    fileInputRef,
    isSaving,
    onCropComplete,
    handlePhotoUpload,
    handleCancel,
    handleAddPhoto,
    handleFileClick,
    handleUploadClick,
  } = usePatientPhotoStep({ onPhotoChange });

  return (
    <>
      <StepShell
        title={
          profilePhotoUrl
            ? ONBOARDING_COPY.profilePhoto.photoAdded
            : ONBOARDING_COPY.profilePhoto.title
        }
        subtitle={
          profilePhotoUrl
            ? ONBOARDING_COPY.profilePhoto.photoAddedDescription
            : ONBOARDING_COPY.profilePhoto.subtitle
        }
        centered
      >
        <div className="flex flex-col items-center gap-6">
          {profilePhotoUrl ? (
            <div className="flex items-center gap-2">
              <CheckCircle2
                className="text-primary size-6"
                aria-hidden="true"
              />
            </div>
          ) : null}

          <div className="flex justify-center py-2">
            {profilePhotoUrl ? (
              <div
                role="button"
                tabIndex={0}
                aria-label={ONBOARDING_COPY.profilePhoto.changePhoto}
                onClick={handleFileClick}
                onKeyDown={activateOnKeyboard(handleFileClick)}
                className="group relative cursor-pointer"
              >
                <div className="border-background ring-muted group-hover:ring-primary/50 relative size-32 overflow-hidden rounded-full border-4 shadow-xl ring-4 transition-all duration-300 group-hover:scale-105 sm:size-40">
                  <Image
                    width={160}
                    height={160}
                    src={profilePhotoUrl}
                    alt="Profile preview"
                    className="relative z-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="font-medium text-white">
                      {ONBOARDING_COPY.profilePhoto.changePhoto}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                aria-label={ONBOARDING_COPY.profilePhoto.addPhoto}
                onClick={handleUploadClick}
                onKeyDown={activateOnKeyboard(handleUploadClick)}
                className="border-muted-foreground/30 hover:border-primary hover:bg-muted/30 bg-muted/10 group flex size-32 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed transition-all duration-300 sm:size-40"
              >
                <div className="bg-background mb-4 flex size-16 items-center justify-center rounded-full shadow-sm transition-transform duration-200 group-hover:scale-110">
                  <Upload
                    className="text-muted-foreground group-hover:text-primary size-8 transition-colors"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-muted-foreground group-hover:text-primary font-medium transition-colors">
                  {ONBOARDING_COPY.profilePhoto.addPhoto}
                </span>
              </div>
            )}
          </div>
        </div>
      </StepShell>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <PhotoCropperOverlay
        isOpen={isPhotoModalOpen}
        imageSrc={imageSrc}
        onClose={() => setIsPhotoModalOpen(false)}
        onCropComplete={onCropComplete}
        onSave={handleAddPhoto}
        onCancel={handleCancel}
        isSaving={isSaving}
      />
    </>
  );
}
