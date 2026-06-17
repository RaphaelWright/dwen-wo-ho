export function revokeObjectUrl(url: string | null | undefined) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}
