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
const TITLE_PATTERNS = COMMON_TITLES.map((title) => ({
  title,
  regex: new RegExp(`^${title.replace(".", "\\.")}\\s+`, "i"),
}));

const extractTitleFromName = (
  name: string
): { title: string | null; cleanedName: string } => {
  if (!name || typeof name !== "string") {
    return { title: null, cleanedName: name };
  }

  const trimmedName = name.trim();

  // Check if name starts with any common title
  for (const { title, regex } of TITLE_PATTERNS) {
    if (regex.test(trimmedName)) {
      const cleanedName = trimmedName.replace(regex, "").trim();
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



