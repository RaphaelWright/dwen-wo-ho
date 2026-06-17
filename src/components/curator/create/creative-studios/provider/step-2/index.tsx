"use client";

import { CampusImageUploadField } from "@/components/curator/create/creative-studios/campus/image-upload-field";
import { LoadingButton } from "@/components/ui/loading-button";
import { PROVIDER_STEP_2_PHOTO_FIELD } from "@/lib/constants/components/curator/create/creative-studios";
import { useProviderStep2 } from "@/hooks/components/curator/create/provider/use-provider-step-2";

export function ProviderStep2() {
  const {
    provider,
    errors,
    photoInputRef,
    isSubmitting,
    clearImage,
    handleFileChange,
    handleCreate,
  } = useProviderStep2();

  const { id, label, variant } = PROVIDER_STEP_2_PHOTO_FIELD;

  return (
    <div className="cs-page-enter p-4 md:p-8">
      <h2 className="text-foreground text-2xl font-semibold tracking-tight">
        Add Profile Photo
      </h2>
      <p className="text-muted-foreground mt-1 mb-8 text-sm">
        Upload a profile picture
      </p>

      <div className="mx-auto max-w-sm space-y-6 pt-4">
        <CampusImageUploadField
          id={id}
          label={label}
          variant={variant}
          previewUrl={provider.photoUrl}
          error={errors.photoUrl}
          inputRef={photoInputRef}
          onFileChange={handleFileChange}
          onClear={clearImage}
        />

        <LoadingButton
          type="button"
          onClick={handleCreate}
          loading={isSubmitting}
          loadingText="Creating..."
          className="mt-4 w-full"
        >
          Finish
        </LoadingButton>
      </div>
    </div>
  );
}
