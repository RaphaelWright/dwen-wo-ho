import { ROUTES } from "@/constants/routes";
import { ENDPOINTS } from "@/constants/endpoints";
import { api } from "./api";

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
          const isCurator = localStorage.getItem("curatorToken");
          if (isCurator) {
            localStorage.setItem("curatorToken", newAccessToken);
          } else {
            localStorage.setItem("token", newAccessToken);
          }
        }

        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        return newAccessToken || null;
      }

      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
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
  return status === 401 || status === 403;
};
