import { ROUTES } from "@/lib/constants/routes";
import { STATIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { API_BASE_URL } from "@/configs/config";
import { setUserType, getStoredUserType } from "@/lib/utils/auth/get-user-type";
import type { QueryClient } from "@tanstack/react-query";

let isHandlingAuthError = false;
let isRefreshingToken = false;
let refreshPromise: Promise<string | null> | null = null;

export const refreshToken = async (): Promise<string | null> => {
  if (isRefreshingToken && refreshPromise) {
    return refreshPromise;
  }

  isRefreshingToken = true;

  refreshPromise = (async () => {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      const refreshTokenValue = localStorage.getItem("refreshToken");

      if (!refreshTokenValue) {
        return null;
      }

      // Call refresh token endpoint directly (not via api()) to avoid a
      // circular dependency between this module and lib/api.
      const res = await fetch(
        `${API_BASE_URL}${STATIC_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "*/*" },
          body: JSON.stringify({ refreshToken: refreshTokenValue }),
        },
      );

      if (res.ok) {
        const json = await res.json();
        const data = json?.data ?? json;
        const newAccessToken = data?.accessToken || data?.token;
        const newRefreshToken = data?.refreshToken;

        if (newAccessToken) {
          const storedUserType = getStoredUserType();
          const isCurator =
            storedUserType === "curator" ||
            localStorage.getItem("curatorToken");

          if (isCurator) {
            localStorage.setItem("curatorToken", newAccessToken);
            setUserType("curator");
          } else {
            localStorage.setItem("token", newAccessToken);
            if (!storedUserType) {
              setUserType("provider");
            }
          }
        }

        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        return newAccessToken || null;
      }

      return null;
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem("refreshToken");
      }
      return null;
    } finally {
      isRefreshingToken = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const handleTokenExpiration = async () => {
  if (isHandlingAuthError) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const newToken = await refreshToken();

  if (newToken) {
    const isCurator = localStorage.getItem("curatorToken");
    if (isCurator) {
      localStorage.setItem("curatorToken", newToken);
    } else {
      localStorage.setItem("token", newToken);
    }
    window.location.reload();
    return;
  }

  isHandlingAuthError = true;

  localStorage.removeItem("token");
  localStorage.removeItem("curatorToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userType");

  const currentPath = window.location.pathname;
  const isAuthPage =
    currentPath.includes("/signin") ||
    currentPath.includes("/signup") ||
    currentPath.includes("/auth") ||
    currentPath.includes("/check-email") ||
    currentPath.includes("/verify") ||
    currentPath.includes("/new-password") ||
    currentPath.includes("/recover");

  if (!isAuthPage) {
    window.location.replace(ROUTES.provider.auth);
  }

  setTimeout(() => {
    isHandlingAuthError = false;
  }, 1000);
};

/**
 * Clears auth storage, optional query cache, and redirects to sign-in.
 */
export const performLogout = (
  queryClient?: QueryClient,
  redirectTo?: string,
) => {
  if (typeof window === "undefined") {
    return;
  }

  const authKeys = [
    "token",
    "curatorToken",
    "refreshToken",
    "userType",
    "pendingUser:v1",
    "recoveryToken",
    "profileCompletionEmail",
    "authToken",
  ];

  authKeys.forEach((key) => {
    localStorage.removeItem(key);
  });

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith("lockin-form-") ||
          key.startsWith("cached-") ||
          key.includes("auth") ||
          key.includes("token") ||
          key.includes("user"))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Silently handle errors when clearing cache
  }

  try {
    sessionStorage.clear();
  } catch {
    // Silently handle errors when clearing sessionStorage
  }

  if (queryClient) {
    try {
      queryClient.clear();
      queryClient.resetQueries();
    } catch {
      // Silently handle errors when clearing query cache
    }
  }

  isHandlingAuthError = false;
  isRefreshingToken = false;
  refreshPromise = null;

  const redirectPath = redirectTo || ROUTES.provider.auth;
  window.location.replace(redirectPath);
};
