/**
 * Cleans and formats authentication error messages from various response formats.
 * @param error - The error object or string from the API or catch block.
 * @returns A human-readable error message string.
 */
export function getCleanErrorMessage(error: unknown): string {
  let message = "An unexpected error occurred.";

  if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    const response = err.response as Record<string, unknown> | undefined;
    const data = response?.data as Record<string, unknown> | undefined;
    if (typeof data?.message === "string") {
      message = data.message;
    } else if (typeof err.message === "string") {
      message = err.message;
    }
  }

  // Handle stringified JSON error messages
  if (typeof message === "string" && message.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(message);
      if (parsed.message) return parsed.message;
      if (parsed.error) return parsed.error;
    } catch {
      // If parsing fails, use the original message
    }
  }

  return message;
}
