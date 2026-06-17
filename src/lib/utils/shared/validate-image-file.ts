const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please choose an image file.";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 5MB or smaller.";
  }

  return null;
}
