export function formatPersonName(value: string): string {
  return value
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function formatNickname(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function composeFullName(firstName: string, lastName: string): string {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
}

export function normalizeContactKey(
  contactMode: "phone" | "email",
  value: string,
): string {
  const trimmed = value.trim().toLowerCase();
  if (contactMode === "phone") {
    return trimmed.replace(/\D/g, "");
  }
  return trimmed;
}
