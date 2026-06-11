import { setUserType } from "@/lib/utils/getUserType";

export function applyProviderAuthTokens({
  token,
  refreshToken,
  userRole,
}: {
  token?: string | null;
  refreshToken?: string | null;
  userRole?: string | null;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (token) {
    localStorage.setItem("token", token);
  }

  if (userRole === "ROLE_CURATOR") {
    const curatorToken = token || refreshToken;
    if (curatorToken) {
      localStorage.setItem("curatorToken", curatorToken);
    }
    setUserType("curator");
    return;
  }

  setUserType("provider");
}
