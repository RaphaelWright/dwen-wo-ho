"use client";

import { useCallback } from "react";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";
import { useCreativeStudiosImageField } from "@/hooks/components/curator/create/use-creative-studios-image-field";
import { useCreativeStudiosSubmit } from "@/hooks/components/curator/create/use-creative-studios-submit";

export function useProviderStep2() {
  const { provider, updateProvider, submitProvider } =
    useCreativeStudiosFlowContext();
  const { isSubmitting, handleSubmit } =
    useCreativeStudiosSubmit(submitProvider);
  const updatePhotoUrl = useCallback(
    (photoUrl: string | null) => updateProvider({ photoUrl }),
    [updateProvider],
  );
  const {
    errors,
    inputRef: photoInputRef,
    clearImage,
    handleFileChange,
  } = useCreativeStudiosImageField({
    field: "photoUrl",
    imageUrl: provider.photoUrl,
    updateImageUrl: updatePhotoUrl,
  });

  return {
    provider,
    errors,
    photoInputRef,
    isSubmitting,
    clearImage,
    handleFileChange,
    handleCreate: handleSubmit,
  };
}
