import { api } from "@/lib/api";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";

export const schoolsService = {
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
};
