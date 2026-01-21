import { handleTokenExpiration, isAuthError } from "./auth-utils";
import { toast } from "sonner";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://justgo.up.railway.app";

const PUBLIC_ENDPOINTS = [
  "/api/v1/auth/check-email",
  "/api/v1/auth/sign-in",
  "/api/v1/auth/create-account",
  "/api/v1/auth/submit-signup-code",
  "/api/v1/email/send-verification",
  "/api/v1/auth/recover-account",
  "/api/v1/auth/submit-account-recovery-code",
  "/api/v1/auth/refresh-token",
];

const isPublicEndpoint = (endpoint: string): boolean => {
  return PUBLIC_ENDPOINTS.some((path) => endpoint.includes(path));
};

const prepareRequestBody = (body: unknown): BodyInit | undefined => {
  if (!body) return undefined;
  if (body instanceof FormData) return body;
  if (body instanceof Blob) return body;
  if (body instanceof URLSearchParams) return body;
  if (typeof body === "object") return JSON.stringify(body);
  return body as BodyInit;
};

const prepareHeaders = (endpoint: string, options: RequestInit): Record<string, string> => {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;
  const refreshToken = typeof window !== "undefined"
    ? localStorage.getItem("refreshToken")
    : null;
  const headers: Record<string, string> = {
    Accept: "*/*",
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // For provider signup flow, prioritize token from OTP verification over refreshToken
  // Token is set after OTP verification and should be used for subsequent signup requests
  // After signin endpoint returns refreshToken, we switch to using refreshToken
  if (!headers.Authorization && !isPublicEndpoint(endpoint)) {
    // If refreshToken exists, use it (means signup is complete and we've signed in)
    // Otherwise, use token (during signup flow before signin)
    if (refreshToken) {
      headers.Authorization = `Bearer ${refreshToken}`;
    } else if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const extractErrorFromResponse = async (response: Response): Promise<Error> => {
  const responseText = await response.text();
  const isExpectedFlow =
    responseText.includes("ACCOUNT PENDING") ||
    responseText.includes("User not found") ||
    responseText.includes("Profile is not complete") ||
    responseText.includes("Invalid or missing Authorization header");

  try {
    const errorData = JSON.parse(responseText);
    return new Error(JSON.stringify(errorData));
  } catch {
    return new Error(responseText || `API request failed with status ${response.status}`);
  }
};

const parseSuccessResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await response.json();
    // Handle cases where token/userData might be at root level or in data property
    return {
      success: true,
      message: data.message,
      data: data.data || data // Fallback to root data if data.data is undefined
    };
  }
  return { success: true, message: "Success", data: null };
};

export async function api(endpoint: string, options: RequestInit = {}) {
  const body = prepareRequestBody(options.body);
  const headers = prepareHeaders(endpoint, { ...options, body });

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      body,
    });

    if (!response.ok) {
      if (isAuthError(response.status) && !isPublicEndpoint(endpoint)) {
        if (typeof window !== "undefined") {
          toast.error("Your session has expired. Please log in again.");
          handleTokenExpiration();
        }
      }
      throw await extractErrorFromResponse(response);
    }

    return await parseSuccessResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error");
  }
}
