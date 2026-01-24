import { ROUTES } from "@/constants/routes";
import { ENDPOINTS } from "@/constants/endpoints";
import { api } from "./api";
import { setUserType, getStoredUserType } from "./utils/getUserType";

let isHandlingAuthError = false;
let isRefreshingToken = false;
let refreshPromise: Promise<string | null> | null = null;

export const refreshToken = async (): Promise<string | null> => {
  // If already refreshing, return the existing promise
  if (isRefreshingToken && refreshPromise) {
    return refreshPromise;
  }

  isRefreshingToken = true;
  
  refreshPromise = (async () => {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      // Get refresh token from localStorage
      const refreshTokenValue = localStorage.getItem("refreshToken");
      
      if (!refreshTokenValue) {
        return null;
      }

      // Call refresh token endpoint
      const response = await api(ENDPOINTS.refreshToken, {
        method: "POST",
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (response?.success && response.data) {
        // Store new access token and refresh token
        const newAccessToken = response.data.accessToken || response.data.token;
        const newRefreshToken = response.data.refreshToken;

        if (newAccessToken) {
          // Check stored user type first, then fallback to curatorToken check
          const storedUserType = getStoredUserType();
          const isCurator = storedUserType === "curator" || localStorage.getItem("curatorToken");
          
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
    } catch (error) {
      // Clear refresh token if refresh fails
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

  // Attempt to refresh token before logging out
  const newToken = await refreshToken();
  
  if (newToken) {
    // Token refreshed successfully, update localStorage
    const isCurator = localStorage.getItem("curatorToken");
    if (isCurator) {
      localStorage.setItem("curatorToken", newToken);
    } else {
      localStorage.setItem("token", newToken);
    }
    // Reload the page to retry the failed request
    window.location.reload();
    return;
  }

  // If refresh failed or not available, proceed with logout
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
    window.location.href = ROUTES.provider.auth;
  }

  setTimeout(() => {
    isHandlingAuthError = false;
  }, 1000);
};

export const isAuthError = (status: number): boolean => {
  // Only 401 (Unauthorized) is an auth error that requires token refresh
  // 403 (Forbidden) means user is authenticated but lacks permission - don't refresh/logout
  return status === 401;
};

/**
 * Comprehensive logout function that clears all authentication data,
 * cache, and storage to prevent auth confusion between different users.
 * 
 * @param queryClient - Optional React Query client to clear query cache
 * @param redirectTo - Optional route to redirect to after logout (defaults to provider auth)
 */
export const performLogout = (
  queryClient?: { clear: () => void; resetQueries: (filters?: unknown) => void },
  redirectTo?: string
) => {
  if (typeof window === "undefined") {
    return;
  }

  // Clear all localStorage items related to auth
  const authKeys = [
    "token",
    "curatorToken",
    "refreshToken",
    "userType",
    "pendingUser",
    "recoveryToken",
    "profileCompletionEmail",
    "authToken",
  ];

  // Remove all auth-related keys
  authKeys.forEach((key) => {
    localStorage.removeItem(key);
  });

  // Clear any cached form data (lock-in forms, etc.)
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
  } catch (error) {
    // Silently handle errors when clearing cache
  }

  // Clear all sessionStorage
  try {
    sessionStorage.clear();
  } catch (error) {
    // Silently handle errors when clearing sessionStorage
  }

  // Clear React Query cache if provided
  if (queryClient) {
    try {
      queryClient.clear();
      queryClient.resetQueries();
    } catch (error) {
      // Silently handle errors when clearing query cache
    }
  }

  // Reset auth state flags
  isHandlingAuthError = false;
  isRefreshingToken = false;
  refreshPromise = null;

  // Redirect to auth page
  const redirectPath = redirectTo || ROUTES.provider.auth;
  
  // Use window.location for a hard redirect to ensure complete state reset
  window.location.href = redirectPath;
};
