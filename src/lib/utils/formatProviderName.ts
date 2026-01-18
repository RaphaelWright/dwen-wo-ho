/**
 * Common titles that might appear in provider names
 */
const COMMON_TITLES = [
  "Mr.",
  "Mrs.",
  "Miss",
  "Ms.",
  "Dr.",
  "Prof.",
  "Professor",
  "Rev.",
  "Reverend",
  "Sir",
  "Madam",
  "Hon.",
  "Honorable",
  "Esq.",
  "Esquire",
];

/**
 * Extracts title from a provider name if present
 * @param name - The provider's name that might contain a title
 * @returns An object with the extracted title and cleaned name
 */
export const extractTitleFromName = (
  name: string
): { title: string | null; cleanedName: string } => {
  if (!name || typeof name !== "string") {
    return { title: null, cleanedName: name };
  }

  const trimmedName = name.trim();
  
  // Check if name starts with any common title
  for (const title of COMMON_TITLES) {
    // Case-insensitive check with word boundary
    const titleRegex = new RegExp(`^${title.replace(".", "\\.")}\\s+`, "i");
    if (titleRegex.test(trimmedName)) {
      const cleanedName = trimmedName.replace(titleRegex, "").trim();
      return { title, cleanedName };
    }
  }

  return { title: null, cleanedName: trimmedName };
};

/**
 * Formats a provider's full name by combining providerTitle and providerName
 * If providerTitle is not provided, attempts to extract it from providerName
 * @param providerName - The provider's name
 * @param providerTitle - The provider's title (optional, explicitly provided)
 * @returns The formatted full name
 */
export const formatProviderName = (
  providerName: string,
  providerTitle?: string | null
): string => {
  if (!providerName) {
    return "";
  }

  // If title is explicitly provided, use it
  if (providerTitle) {
    return `${providerTitle} ${providerName}`.trim();
  }

  // Otherwise, try to extract title from the name
  const { title, cleanedName } = extractTitleFromName(providerName);
  
  if (title) {
    return `${title} ${cleanedName}`.trim();
  }

  // No title found, return name as-is
  return providerName.trim();
};

/**
 * Gets the provider title, either from the explicit providerTitle or extracted from providerName
 * @param providerName - The provider's name
 * @param providerTitle - The provider's title (optional, explicitly provided)
 * @returns The provider title or null
 */
export const getProviderTitle = (
  providerName: string,
  providerTitle?: string | null
): string | null => {
  // If title is explicitly provided, use it
  if (providerTitle) {
    return providerTitle;
  }

  // Otherwise, try to extract title from the name
  const { title } = extractTitleFromName(providerName);
  return title;
};

/**
 * Gets the cleaned provider name without title
 * @param providerName - The provider's name
 * @param providerTitle - The provider's title (optional, explicitly provided)
 * @returns The cleaned name without title
 */
export const getProviderNameWithoutTitle = (
  providerName: string,
  providerTitle?: string | null
): string => {
  if (!providerName) {
    return "";
  }

  // If title is explicitly provided, return name as-is (assuming it doesn't contain title)
  if (providerTitle) {
    return providerName.trim();
  }

  // Otherwise, extract and return cleaned name
  const { cleanedName } = extractTitleFromName(providerName);
  return cleanedName;
};
