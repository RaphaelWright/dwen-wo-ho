import { validateImageFile } from "@/lib/utils/shared/validate-image-file";

export type ImageFileSelection =
  | { status: "empty" }
  | { status: "invalid"; error: string }
  | { status: "valid"; url: string };

export function selectImageFile(file: File | undefined): ImageFileSelection {
  if (!file) {
    return { status: "empty" };
  }

  const error = validateImageFile(file);
  if (error) {
    return { status: "invalid", error };
  }

  return { status: "valid", url: URL.createObjectURL(file) };
}
