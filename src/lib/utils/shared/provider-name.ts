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

const TITLE_PATTERNS = COMMON_TITLES.map((title) => ({
  title,
  regex: new RegExp(`^${title.replace(".", "\\.")}\\s+`, "i"),
}));

const extractTitleFromName = (
  name: string,
): { title: string | null; cleanedName: string } => {
  if (!name || typeof name !== "string") {
    return { title: null, cleanedName: name };
  }

  const trimmedName = name.trim();

  for (const { title, regex } of TITLE_PATTERNS) {
    if (regex.test(trimmedName)) {
      const cleanedName = trimmedName.replace(regex, "").trim();
      return { title, cleanedName };
    }
  }

  return { title: null, cleanedName: trimmedName };
};

export const formatProviderName = (
  providerName: string,
  providerTitle?: string | null,
): string => {
  if (!providerName) {
    return "";
  }

  if (providerTitle) {
    return `${providerTitle} ${providerName}`.trim();
  }

  const { title, cleanedName } = extractTitleFromName(providerName);

  if (title) {
    return `${title} ${cleanedName}`.trim();
  }

  return providerName.trim();
};

export const getProviderTitle = (
  providerName: string,
  providerTitle?: string | null,
): string | null => {
  if (providerTitle) {
    return providerTitle;
  }

  const { title } = extractTitleFromName(providerName);
  return title;
};

import type { ProviderDisplayNameInput } from "@/lib/types/components/shared/provider-name";

export type { ProviderDisplayNameInput };

export function resolveProviderDisplayName(
  profile: ProviderDisplayNameInput,
): string {
  const honorific = (profile.title ?? profile.professionalTitle)?.trim();
  const name = (profile.name ?? profile.providerName)?.trim() ?? "";

  return honorific ? `${honorific} ${name}` : name;
}
