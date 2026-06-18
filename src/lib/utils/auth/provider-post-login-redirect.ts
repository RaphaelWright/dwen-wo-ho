import type { SignInResponse } from "@/lib/types/api/auth";
import { getProviderRedirectInfo } from "@/lib/utils/auth/redirect";
import { buildProviderAuthRedirectTarget } from "@/lib/utils/provider/signup-resume";

type ProviderPostLoginUserData = Parameters<
  typeof getProviderRedirectInfo
>[0] & {
  email?: string;
};

export function syncProviderPendingUser(
  userData: ProviderPostLoginUserData,
  isPending: boolean,
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (isPending) {
    localStorage.setItem("pendingUser:v1", JSON.stringify(userData));
    return;
  }

  localStorage.removeItem("pendingUser:v1");
}

export function getProviderPostLoginTarget(
  userData: ProviderPostLoginUserData,
  fallbackEmail: string,
  loginResponse?: SignInResponse,
): string {
  const redirectInfo = getProviderRedirectInfo(userData, loginResponse);
  syncProviderPendingUser(userData, redirectInfo.isPending);
  return buildProviderAuthRedirectTarget(
    redirectInfo,
    userData.email ?? fallbackEmail,
  );
}
