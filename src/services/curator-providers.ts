import { api } from "@/lib/api";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { checkResponse } from "@/lib/api-utils";
import {
  IProviderResponse,
  Provider,
  ProviderDetails,
  ApiActionResponse,
} from "@/lib/types/provider";
import type {
  ProviderActivityParams,
  ProviderActivityListResponse,
} from "@/lib/types/api/providers";

/**
 * Curator service for admin operations on providers.
 * Used by curators to manage provider applications, assignments, and operations.
 * Endpoints: /api/v1/providers/*
 */
export const curatorProvidersService = {
  getProviders: async (): Promise<IProviderResponse> => {
    const result = await api(STATIC_ENDPOINTS.PROVIDERS.BASE);
    if (result?.success) {
      return {
        success: true,
        data: Array.isArray(result.data) ? result.data : [],
        message: result.message ?? "",
      };
    }
    return { success: false, data: [], message: "Failed to fetch providers" };
  },

  getProvider: async (email: string): Promise<ProviderDetails> => {
    const result = await api(DYNAMIC_ENDPOINTS.PROVIDERS.GET(email));
    if (result?.success && result.data) return result.data as ProviderDetails;
    throw new Error("Failed to fetch provider");
  },

  approveProvider: async (email: string): Promise<ApiActionResponse> => {
    const refreshToken =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : "";
    const headers = refreshToken
      ? { Authorization: `Bearer ${refreshToken}` }
      : undefined;

    const result = await api(DYNAMIC_ENDPOINTS.PROVIDERS.APPROVE(email), {
      method: "PUT",
      headers,
    });
    return {
      success: !!result?.success,
      message: result?.message,
      data: result?.data as Provider | undefined,
    };
  },

  rejectProvider: async (email: string): Promise<ApiActionResponse> => {
    const refreshToken =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : "";
    const headers = refreshToken
      ? { Authorization: `Bearer ${refreshToken}` }
      : undefined;

    const result = await api(DYNAMIC_ENDPOINTS.PROVIDERS.REJECT(email), {
      method: "PUT",
      headers,
    });
    return {
      success: !!result?.success,
      message: result?.message,
      data: result?.data as Provider | undefined,
    };
  },

  addSchoolToProvider: async (
    providerId: string | number,
    schoolId: string | number,
  ) => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PROVIDERS.ADD_SCHOOL(providerId),
      {
        method: "POST",
        body: JSON.stringify({ schoolId }),
      },
    );
    if (response?.success) return response;
    throw new Error(response?.message || "Failed to add school to provider");
  },

  removeSchoolFromProvider: async (
    providerId: string | number,
    schoolId: string | number,
  ) => {
    const response = await api(
      DYNAMIC_ENDPOINTS.PROVIDERS.REMOVE_SCHOOL(providerId, schoolId),
      {
        method: "DELETE",
      },
    );
    if (response?.success) return response;
    throw new Error(
      response?.message || "Failed to remove school from provider",
    );
  },

  getSchoolsSummary: async () => {
    const result = await api(STATIC_ENDPOINTS.PROVIDERS.SCHOOLS_SUMMARY);
    if (result?.success && result.data)
      return Array.isArray(result.data) ? result.data : [];
    return [];
  },

  getNotifications: async () => {
    const result = await api(STATIC_ENDPOINTS.PROVIDERS.NOTIFICATIONS);
    if (result?.success && result.data) return result.data;
    return { notifications: [], unreadCount: 0, totalCount: 0 };
  },

  clearNotifications: async (): Promise<void> => {
    await api(STATIC_ENDPOINTS.PROVIDERS.NOTIFICATIONS, { method: "DELETE" });
  },

  markNotificationRead: async (id: string): Promise<void> => {
    await api(`${STATIC_ENDPOINTS.PROVIDERS.NOTIFICATIONS}/${id}/read`, {
      method: "PATCH",
    });
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await api(STATIC_ENDPOINTS.PROVIDERS.NOTIFICATIONS_READ_ALL, {
      method: "PATCH",
    });
  },

  deleteNotification: async (id: string | number): Promise<void> => {
    await api(DYNAMIC_ENDPOINTS.PROVIDERS.DELETE_NOTIFICATION(id), {
      method: "DELETE",
    });
  },

  // T3-8: Provider Partners
  getProviderPartners: async (
    providerId: string | number,
  ): Promise<{ partners: Provider[] }> => {
    const result = await api(DYNAMIC_ENDPOINTS.PROVIDERS.PARTNERS(providerId));
    if (result?.success && result.data)
      return result.data as { partners: Provider[] };
    return { partners: [] };
  },

  addProviderPartner: async (
    providerId: string | number,
    partnerId: string | number,
  ): Promise<void> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.PROVIDERS.ADD_PARTNER(providerId, partnerId),
      { method: "POST" },
    );
    if (!result?.success) throw new Error("Failed to add partner to provider");
  },

  removeProviderPartner: async (
    providerId: string | number,
    partnerId: string | number,
  ): Promise<void> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.PROVIDERS.REMOVE_PARTNER(providerId, partnerId),
      { method: "POST" },
    );
    if (!result?.success)
      throw new Error("Failed to remove partner from provider");
  },

  // T3-12: Provider Activity Update
  updateLastSeen: async (): Promise<void> => {
    await api(STATIC_ENDPOINTS.PROVIDERS.ACTIVITY, { method: "PUT" });
  },

  getActivity: async (
    params?: ProviderActivityParams,
  ): Promise<ProviderActivityListResponse> => {
    const query = new URLSearchParams();
    if (params?.schoolId) query.set("schoolId", params.schoolId);
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    if (params?.page != null) query.set("page", String(params.page));
    if (params?.limit != null) query.set("limit", String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : "";

    const result = await api(`${STATIC_ENDPOINTS.PROVIDERS.ACTIVITY}${qs}`, {
      method: "GET",
    });

    if (result?.success && result.data) return result.data;
    throw new Error("Failed to fetch provider activity");
  },
};
