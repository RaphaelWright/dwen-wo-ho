"use client";

import { IoAdd } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { PhotoCropperOverlay } from "@/components/shared/overlays/photo-cropper";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { usePatientPhotoStep } from "@/hooks/components/patient/onboarding/photo-step/use-photo-step";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { ProfilePhotoStepProps } from "@/lib/types/components/patient/onboarding";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";
import { cn } from "@/lib/utils";

export function ProfilePhotoStep({
  profilePhotoUrl,
  onPhotoChange,
  canContinue,
  onContinue,
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
      <OnboardingContinueForm
        canContinue={canContinue}
        onContinue={onContinue}
        listenForEnter
      >
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
          <div className="home-profile-row">
            <div className="home-avatar-ring">
              <div
                role="button"
                tabIndex={0}
                className={cn(
                  "home-photo-circle",
                  profilePhotoUrl && "has-photo",
                )}
                id="profilePhotoCircle"
                style={
                  profilePhotoUrl
                    ? { backgroundImage: `url(${profilePhotoUrl})` }
                    : undefined
                }
                aria-label={
                  profilePhotoUrl
                    ? ONBOARDING_COPY.profilePhoto.changePhoto
                    : ONBOARDING_COPY.profilePhoto.addPhoto
                }
                onClick={profilePhotoUrl ? handleFileClick : handleUploadClick}
                onKeyDown={activateOnKeyboard(
                  profilePhotoUrl ? handleFileClick : handleUploadClick,
                )}
              >
                {!profilePhotoUrl ? <IoAdd aria-hidden="true" /> : null}
              </div>
            </div>
          </div>
        </StepShell>
      </OnboardingContinueForm>

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
