import { ROUTES } from "@/lib/constants/infra/routes";
import type { SignInResponse } from "@/lib/types/api/auth";
import { applyProviderAuthTokens } from "@/lib/utils/auth/provider-tokens";
import { getProviderPostLoginTarget } from "@/lib/utils/auth/provider-post-login-redirect";
import {
  clearProviderSignupPassword,
  getProviderSignupPassword,
} from "@/lib/utils/provider/signup-password";
import { hasProviderAuthToken } from "@/lib/utils/provider/signup-resume";
import { setUserType } from "@/lib/utils/auth/get-user-type";

export type ProviderFinishSignupLogin = (credentials: {
  email: string;
  password: string;
}) => Promise<SignInResponse | null | undefined>;

export type ProviderFinishSignupAutoLoginResult =
  | { kind: "missing-password" }
  | { kind: "login-failed" }
  | {
      kind: "success";
      targetPath: string;
      token?: string;
      refreshToken?: string;
      userRole?: string;
    };

function buildProviderSignInUrl(email: string): string {
  return `${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(email)}`;
}

export async function runProviderFinishSignupAutoLogin(
  email: string,
  password: string | undefined,
  login: ProviderFinishSignupLogin,
): Promise<ProviderFinishSignupAutoLoginResult> {
  const trimmedPassword = password?.trim();
  if (!trimmedPassword) {
    return { kind: "missing-password" };
  }

  let loginResponse: SignInResponse | null | undefined;
  try {
    loginResponse = await login({ email, password: trimmedPassword });
  } catch {
    return { kind: "login-failed" };
  }

  if (!loginResponse) {
    return { kind: "login-failed" };
  }

  const targetPath = loginResponse.userData
    ? getProviderPostLoginTarget(loginResponse.userData, email, loginResponse)
    : ROUTES.provider.home;

  return {
    kind: "success",
    targetPath,
    token: loginResponse.token,
    refreshToken: loginResponse.refreshToken,
    userRole: loginResponse.userData?.userRole,
  };
}

export async function executeProviderFinishSignup({
  email,
  password,
  login,
  navigate,
  onAutoLoginFailed,
}: {
  email: string;
  password?: string;
  login: ProviderFinishSignupLogin;
  navigate: (path: string) => void;
  onAutoLoginFailed: () => void;
}): Promise<void> {
  if (hasProviderAuthToken()) {
    clearProviderSignupPassword(email);
    setUserType("provider");
    navigate(ROUTES.provider.home);
    return;
  }

  const resolvedPassword =
    password?.trim() || getProviderSignupPassword(email) || undefined;
  const result = await runProviderFinishSignupAutoLogin(
    email,
    resolvedPassword,
    login,
  );

  if (result.kind !== "success") {
    if (result.kind === "login-failed") {
      onAutoLoginFailed();
    }
    navigate(buildProviderSignInUrl(email));
    return;
  }

  clearProviderSignupPassword(email);
  applyProviderAuthTokens({
    token: result.token,
    refreshToken: result.refreshToken,
    userRole: result.userRole,
  });
  navigate(result.targetPath);
}
