/**
 * Cleans and formats authentication error messages from various response formats.
 * @param error - The error object or string from the API or catch block.
 * @returns A human-readable error message string.
 */
export function getCleanErrorMessage(error: any): string {
  let message = "An unexpected error occurred.";

  if (typeof error === "string") {
    message = error;
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
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
