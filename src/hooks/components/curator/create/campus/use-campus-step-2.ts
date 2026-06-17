"use client";

import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";
import { useCreativeStudiosSubmit } from "@/hooks/components/curator/create/use-creative-studios-submit";
import { applyImageFileSelection } from "@/hooks/components/curator/create/use-creative-studios-image-field";
import type { CampusImageFieldKey } from "@/lib/types/components/curator/create/creative-studios";
import { revokeObjectUrl } from "@/lib/utils/shared/revoke-object-url";
import { selectImageFile } from "@/lib/utils/shared/select-image-file";

export function useCampusStep2() {
  const { campus, updateCampus, submitCampus } =
    useCreativeStudiosFlowContext();
  const { isSubmitting, handleSubmit } = useCreativeStudiosSubmit(submitCampus);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<CampusImageFieldKey, string>>({
    logoUrl: "",
    photoUrl: "",
  });

  const inputRefs = {
    logoUrl: logoInputRef,
    photoUrl: photoInputRef,
  } as const;

  const clearImage = useCallback(
    (field: CampusImageFieldKey) => {
      revokeObjectUrl(campus[field]);
      updateCampus({ [field]: null });
      setErrors((prev) => ({ ...prev, [field]: "" }));

      const input =
        field === "logoUrl" ? logoInputRef.current : photoInputRef.current;
      if (input) {
        input.value = "";
      }
    },
    [campus, updateCampus],
  );

  const handleFileChange = useCallback(
    (field: CampusImageFieldKey) => (event: ChangeEvent<HTMLInputElement>) => {
      applyImageFileSelection(
        selectImageFile(event.target.files?.[0]),
        field,
        event,
        setErrors,
        (url) => {
          revokeObjectUrl(campus[field]);
          updateCampus({ [field]: url });
        },
      );
    },
    [campus, updateCampus],
  );

  return {
    campus,
    errors,
    inputRefs,
    isSubmitting,
    clearImage,
    handleFileChange,
    handleCreate: handleSubmit,
  };
}
