/**
 * Converts a local Ghana mobile number (0XXXXXXXXX) to +233XXXXXXXXX.
 */
export const formatGhanaPhoneForApi = (localPhone: string): string => {
  const digits = localPhone.replace(/\D/g, "");

  if (digits.startsWith("0") && digits.length === 10) {
    return `+233${digits.slice(1)}`;
  }

  return localPhone.trim();
};
