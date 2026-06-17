import { api } from "@/lib/api";
import { STATIC_ENDPOINTS } from "@/lib/constants/endpoints";
import type { SpecialtyResponse } from "@/lib/types/api/common";

export const specialtiesService = {
  list: async (): Promise<SpecialtyResponse[]> => {
    const result = await api(STATIC_ENDPOINTS.SPECIALTIES);
    if (result?.success && result.data) {
      return Array.isArray(result.data) ? result.data : [];
    }
    return [];
  },

  add: async (name: string): Promise<void> => {
    const result = await api(STATIC_ENDPOINTS.SPECIALTIES, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    if (!result?.success) throw new Error("Failed to add specialty");
  },
};
