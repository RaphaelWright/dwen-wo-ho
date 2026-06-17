/** Reads provider id from localStorage (set after login or profile load). */
export function extractProviderId(): string | null {
  const stored = localStorage.getItem("providerId");
  if (stored) return stored;

  const profileData = localStorage.getItem("userProfile");
  if (profileData) {
    try {
      const parsed = JSON.parse(profileData) as {
        id?: string;
        providerId?: string;
      };
      return parsed.id ?? parsed.providerId ?? null;
    } catch {
      // Ignore parse errors
    }
  }

  return null;
}
