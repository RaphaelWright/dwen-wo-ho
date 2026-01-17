/**
 * Formats a provider's full name by combining providerTitle and providerName
 * @param providerName - The provider's name
 * @param providerTitle - The provider's title (optional)
 * @returns The formatted full name
 */
export const formatProviderName = (
  providerName: string,
  providerTitle?: string | null
): string => {
  if (providerTitle) {
    return `${providerTitle} ${providerName}`.trim();
  }
  return providerName;
};
