import { api } from "@/lib/api";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { axiosInstance } from "@/configs/axiosInstance";
import { checkResponse } from "@/lib/api-utils";
import { IProviderResponse, Provider, ProviderDetails } from "@/lib/types/provider";

export interface ApiActionResponse {
  success: boolean;
  message?: string;
  data?: Provider;
}

export const providersService = {
  getProviders: async (): Promise<IProviderResponse> => {
    try {
      const response = await axiosInstance.get(STATIC_ENDPOINTS.PROVIDERS.BASE);
      const data = checkResponse(response, 200);

      if (data && typeof data === "object" && "data" in data) {
        return data as IProviderResponse;
      }
      if (Array.isArray(data)) return { success: true, data, message: "" };
      return { success: true, data: [], message: "" };
    } catch {
      const result = await api(STATIC_ENDPOINTS.PROVIDERS.BASE);
      if (result?.success) {
        return {
          success: true,
          data: Array.isArray(result.data) ? result.data : [],
          message: result.message ?? "",
        };
      }
      return { success: false, data: [], message: "Failed to fetch providers" };
    }
  },

  getProvider: async (email: string): Promise<ProviderDetails> => {
    const result = await api(DYNAMIC_ENDPOINTS.PROVIDERS.GET(email));
    if (result?.success && result.data) return result.data as ProviderDetails;
    throw new Error("Failed to fetch provider");
  },

  approveProvider: async (email: string): Promise<ApiActionResponse> => {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : "";
    const headers = refreshToken ? { Authorization: `Bearer ${refreshToken}` } : undefined;

    const result = await api(DYNAMIC_ENDPOINTS.PROVIDERS.APPROVE(email), { method: "PUT", headers });
    return {
      success: !!result?.success,
      message: result?.message,
      data: result?.data as Provider | undefined,
    };
  },

  rejectProvider: async (email: string): Promise<ApiActionResponse> => {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : "";
    const headers = refreshToken ? { Authorization: `Bearer ${refreshToken}` } : undefined;

    const result = await api(DYNAMIC_ENDPOINTS.PROVIDERS.REJECT(email), { method: "PUT", headers });
    return {
      success: !!result?.success,
      message: result?.message,
      data: result?.data as Provider | undefined,
    };
  },
};

