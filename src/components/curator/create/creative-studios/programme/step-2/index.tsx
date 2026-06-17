"use client";

import { CampusImageUploadField } from "@/components/curator/create/creative-studios/campus/image-upload-field";
import { LoadingButton } from "@/components/ui/loading-button";
import { PROGRAMME_STEP_2_COVER_FIELD } from "@/lib/constants/components/curator/create/creative-studios";
import { useProgrammeStep2 } from "@/hooks/components/curator/create/programme/use-programme-step-2";

export function ProgrammeStep2() {
  const {
    programme,
    errors,
    coverInputRef,
    isSubmitting,
    clearImage,
    handleFileChange,
    handleCreate,
  } = useProgrammeStep2();

  const { id, label, variant } = PROGRAMME_STEP_2_COVER_FIELD;

  return (
    <div className="cs-page-enter p-4 md:p-8">
      <h2 className="text-foreground text-2xl font-semibold tracking-tight">
        Add Cover Photo
      </h2>
      <p className="text-muted-foreground mt-1 mb-8 text-sm">
        Upload a cover image for the programme
      </p>

      <div className="mx-auto max-w-sm space-y-6 pt-4">
        <CampusImageUploadField
          id={id}
          label={label}
          variant={variant}
          previewUrl={programme.coverUrl}
          error={errors.coverUrl}
          inputRef={coverInputRef}
          onFileChange={handleFileChange}
          onClear={clearImage}
        />

        <LoadingButton
          type="button"
          onClick={handleCreate}
          loading={isSubmitting}
          loadingText="Creating..."
          className="bg-primary mt-4 w-full rounded-xl py-2.5 font-medium transition-all duration-200 hover:-translate-y-px active:translate-y-0"
        >
          Finish
        </LoadingButton>
      </div>
    </div>
  );
}
