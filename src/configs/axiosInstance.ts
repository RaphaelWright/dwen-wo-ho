import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { handleTokenExpiration, isAuthError } from "@/lib/auth-utils";
import { toast } from "sonner";
import { API_BASE_URL } from "@/configs/config";
import { PUBLIC_ENDPOINTS } from "@/lib/constants/endpoints";

/**
 * Checks if the request URL matches any public endpoint that doesn't require authentication.
 * @param url The request URL string.
 * @returns True if the URL is public, false otherwise.
 */
const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some((path) => url.includes(path));
};

/**
 * Axios instance for standard JSON API requests.
 * Sets default headers for JSON content type.
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Axios instance for multipart/form-data requests (e.g., file uploads).
 * Does not set Content-Type header to allow browser to set it with boundary.
 */
export const axiosFormData = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Helper function to attach authentication tokens to the request config.
 * Prioritizes refreshToken if available (user is signed in), otherwise acts as a fallback or uses normal token (e.g., during signup flow).
 * @param config The axios request config object.
 * @returns The modified config with Authorization header if token exists.
 */
const attachAuthToken = (config: InternalAxiosRequestConfig) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

  // Prioritize refreshToken if available (signed in), else token (signup flow)
  if (refreshToken) {
    config.headers.Authorization = `Bearer ${refreshToken}`;
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

// Request interceptor for JSON requests - Add token to all requests
axiosInstance.interceptors.request.use(
  (config) => attachAuthToken(config),
  (error) => Promise.reject(error),
);

// Request interceptor for form data requests
axiosFormData.interceptors.request.use(
  (config) => attachAuthToken(config),
  (error) => Promise.reject(error),
);

/**
 * Shared error handler for response interceptors.
 * Checks for authentication errors (401) on protected routes and triggers token expiration handling.
 * @param error The axios error object.
 * @returns Promise rejection with the error.
 */
const handleResponseError = (error: AxiosError) => {
  if (error.response) {
    const status = error.response.status;
    const config = error.config as InternalAxiosRequestConfig;

    if (isAuthError(status) && config && !isPublicEndpoint(config.url || "")) {
      if (typeof window !== "undefined") {
        toast.error("Your session has expired. Please log in again.");
        handleTokenExpiration();
      }
    }
  }
  return Promise.reject(error);
};

// Response interceptor for axiosInstance
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  handleResponseError,
);

// Response interceptor for axiosFormData
axiosFormData.interceptors.response.use(
  (response: AxiosResponse) => response,
  handleResponseError,
);
