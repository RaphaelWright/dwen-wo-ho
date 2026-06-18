import type { SignInResponse } from "@/lib/types/api/auth";
import { getProviderPostLoginTarget } from "@/lib/utils/auth/provider-post-login-redirect";
import { applyProviderAuthTokens } from "@/lib/utils/auth/provider-tokens";

export function finalizeProviderSignInSession(
  response: SignInResponse,
  fallbackEmail: string,
): string {
  applyProviderAuthTokens({
    token: response.token,
    refreshToken: response.refreshToken,
    userRole: response.userData?.userRole,
  });

  return getProviderPostLoginTarget(
    response.userData,
    response.userData?.email ?? fallbackEmail,
    response,
  );
}
