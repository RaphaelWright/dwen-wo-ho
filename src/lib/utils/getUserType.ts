const USER_TYPE_KEY = "userType";

/**
 * Stores the user type in localStorage
 * @param userType - The user type to store
 */
export const setUserType = (userType: "curator" | "provider" | "patient" | null): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (userType) {
    localStorage.setItem(USER_TYPE_KEY, userType);
  } else {
    localStorage.removeItem(USER_TYPE_KEY);
  }
};

/**
 * Gets the stored user type from localStorage
 * @returns "curator" | "provider" | "patient" | null
 */
export const getStoredUserType = (): "curator" | "provider" | "patient" | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(USER_TYPE_KEY) as "curator" | "provider" | "patient" | null;
};

/**
 * Determines the user type based on stored tokens and user type flag
 * @returns "curator" | "provider" | "patient" | null
 */
export const getUserType = (): "curator" | "provider" | "patient" | null => {
  if (typeof window === "undefined") {
    return null;
  }

  // First check stored user type
  const storedUserType = getStoredUserType();
  if (storedUserType) {
    // Verify tokens exist for the stored type
    const curatorToken = localStorage.getItem("curatorToken");
    const providerToken = localStorage.getItem("token");
    const patientToken = localStorage.getItem("patientToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (storedUserType === "curator" && (curatorToken || refreshToken)) {
      return "curator";
    }
    if (storedUserType === "provider" && (providerToken || refreshToken)) {
      return "provider";
    }
    if (storedUserType === "patient" && (patientToken || refreshToken)) {
      return "patient";
    }
  }

  // Fallback: Check for curator token first (curators have both curatorToken and token)
  const curatorToken = localStorage.getItem("curatorToken");
  if (curatorToken) {
    setUserType("curator");
    return "curator";
  }

  // Check for provider token
  const providerToken = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  
  // If we have refreshToken and stored type is provider, return provider
  if (refreshToken && storedUserType === "provider") {
    return "provider";
  }
  
  if (providerToken) {
    setUserType("provider");
    return "provider";
  }

  // Check for patient token (if exists)
  const patientToken = localStorage.getItem("patientToken");
  if (patientToken) {
    setUserType("patient");
    return "patient";
  }

  // Check for refresh token - if exists, return stored type or null
  if (refreshToken && storedUserType) {
    return storedUserType;
  }

  return null;
};

/**
 * Checks if user has a valid token (access token or refresh token)
 * @returns boolean
 */
export const hasValidToken = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const curatorToken = localStorage.getItem("curatorToken");
  const providerToken = localStorage.getItem("token");
  const patientToken = localStorage.getItem("patientToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return !!(curatorToken || providerToken || patientToken || refreshToken);
};


