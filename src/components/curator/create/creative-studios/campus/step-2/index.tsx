"use client";

import { CampusImageUploadField } from "@/components/curator/create/creative-studios/campus/image-upload-field";
import { LoadingButton } from "@/components/ui/loading-button";
import { CAMPUS_STEP_2_IMAGE_FIELDS } from "@/lib/constants/components/curator/create/creative-studios";
import { useCampusStep2 } from "@/hooks/components/curator/create/campus/use-campus-step-2";

export function CampusStep2() {
  const {
    campus,
    errors,
    inputRefs,
    isSubmitting,
    clearImage,
    handleFileChange,
    handleCreate,
  } = useCampusStep2();

  return (
    <div className="cs-page-enter p-4 md:p-8">
      <h2 className="text-foreground text-2xl font-semibold tracking-tight">
        Add Logo & Photo
      </h2>
      <p className="text-muted-foreground mt-1 mb-8 text-sm">
        Upload visuals for the campus
      </p>

      <div className="mx-auto max-w-sm space-y-6">
        {CAMPUS_STEP_2_IMAGE_FIELDS.map(({ field, id, label, variant }) => (
          <CampusImageUploadField
            key={field}
            id={id}
            label={label}
            variant={variant}
            previewUrl={campus[field]}
            error={errors[field]}
            inputRef={inputRefs[field]}
            onFileChange={handleFileChange(field)}
            onClear={() => clearImage(field)}
          />
        ))}

        <LoadingButton
          type="button"
          onClick={handleCreate}
          loading={isSubmitting}
          loadingText="Creating..."
          className="mt-4 w-full rounded-xl py-3"
        >
          Finish
        </LoadingButton>
      </div>
    </div>
  );
}
