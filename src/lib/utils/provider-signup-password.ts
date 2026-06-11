const STORAGE_KEY_PREFIX = "provider-signup-password:";

function buildStorageKey(email: string): string {
  return `${STORAGE_KEY_PREFIX}${email.trim().toLowerCase()}`;
}

export function saveProviderSignupPassword(
  email: string,
  password: string,
): void {
  if (typeof window === "undefined" || !email.trim() || !password) {
    return;
  }

  sessionStorage.setItem(buildStorageKey(email), password);
}

export function getProviderSignupPassword(email: string): string | null {
  if (typeof window === "undefined" || !email.trim()) {
    return null;
  }

  return sessionStorage.getItem(buildStorageKey(email));
}

export function clearProviderSignupPassword(email: string): void {
  if (typeof window === "undefined" || !email.trim()) {
    return;
  }

  sessionStorage.removeItem(buildStorageKey(email));
}
