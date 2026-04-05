import { API_BASE_URL } from "@/configs/config";

/**
 * Build WebSocket URL with authentication token
 * @param token JWT access token
 * @returns SockJS WebSocket URL
 */
export function buildWebSocketUrl(token: string): string {
  const baseUrl = API_BASE_URL.replace(/^https:/, "http:");
  return `${baseUrl}/ws/notifications?token=${encodeURIComponent(token)}`;
}

/**
 * Get stored token based on user type
 * @returns Token from localStorage or null
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Check for curator token first
  const curatorToken = localStorage.getItem("token");
  if (curatorToken && localStorage.getItem("userType") === "curator") {
    return curatorToken;
  }

  // Provider token
  const providerToken = localStorage.getItem("token");
  if (providerToken) {
    return providerToken;
  }

  return null;
}

/**
 * Check if WebSocket should be active based on auth state
 * @returns boolean indicating if WebSocket should connect
 */
export function shouldConnectWebSocket(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const token = getStoredToken();
  const userType = localStorage.getItem("userType");

  return !!(token && userType);
}
