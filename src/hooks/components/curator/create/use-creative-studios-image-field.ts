"use client";

import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { selectImageFile } from "@/lib/utils/shared/select-image-file";
import type { ImageFileSelection } from "@/lib/utils/shared/select-image-file";
import { revokeObjectUrl } from "@/lib/utils/shared/revoke-object-url";

export function applyImageFileSelection<TField extends string>(
  selection: ImageFileSelection,
  field: TField,
  event: ChangeEvent<HTMLInputElement>,
  setErrors: Dispatch<SetStateAction<Record<TField, string>>>,
  onValid: (url: string) => void,
): void {
  if (selection.status === "empty") {
    return;
  }

  if (selection.status === "invalid") {
    setErrors((prev) => ({ ...prev, [field]: selection.error }));
    event.target.value = "";
    return;
  }

  onValid(selection.url);
  setErrors((prev) => ({ ...prev, [field]: "" }));
}

export function useCreativeStudiosImageField<TField extends string>({
  field,
  imageUrl,
  updateImageUrl,
}: {
  field: TField;
  imageUrl: string | null;
  updateImageUrl: (url: string | null) => void;
}): {
  errors: Record<TField, string>;
  inputRef: RefObject<HTMLInputElement | null>;
  clearImage: () => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
} {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<TField, string>>({
    [field]: "",
  } as Record<TField, string>);

  const clearImage = useCallback(() => {
    revokeObjectUrl(imageUrl);
    updateImageUrl(null);
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [field, imageUrl, updateImageUrl]);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      applyImageFileSelection(
        selectImageFile(event.target.files?.[0]),
        field,
        event,
        setErrors,
        (url) => {
          revokeObjectUrl(imageUrl);
          updateImageUrl(url);
        },
      );
    },
    [field, imageUrl, updateImageUrl],
  );

  return {
    errors,
    inputRef,
    clearImage,
    handleFileChange,
  };
}
