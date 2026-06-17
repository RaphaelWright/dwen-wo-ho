"use client";

import { useCallback } from "react";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";
import { useCreativeStudiosImageField } from "@/hooks/components/curator/create/use-creative-studios-image-field";
import { useCreativeStudiosSubmit } from "@/hooks/components/curator/create/use-creative-studios-submit";

export function useProgrammeStep2() {
  const { programme, updateProgramme, submitProgramme } =
    useCreativeStudiosFlowContext();
  const { isSubmitting, handleSubmit } =
    useCreativeStudiosSubmit(submitProgramme);
  const updateCoverUrl = useCallback(
    (coverUrl: string | null) => updateProgramme({ coverUrl }),
    [updateProgramme],
  );
  const {
    errors,
    inputRef: coverInputRef,
    clearImage,
    handleFileChange,
  } = useCreativeStudiosImageField({
    field: "coverUrl",
    imageUrl: programme.coverUrl,
    updateImageUrl: updateCoverUrl,
  });

  return {
    programme,
    errors,
    coverInputRef,
    isSubmitting,
    clearImage,
    handleFileChange,
    handleCreate: handleSubmit,
  };
}
