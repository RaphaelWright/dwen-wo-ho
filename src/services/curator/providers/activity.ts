import { api } from "@/lib/api";
import { STATIC_ENDPOINTS } from "@/lib/constants/endpoints";
import type {
  ProviderActivityParams,
  ProviderActivityListResponse,
} from "@/lib/types/api/providers";

export const activityService = {
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
