import { api } from "@/lib/api";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { LockInData } from "@/lib/types/lockin";
import { UrgentCarePatient } from "@/lib/types/patient";

export const lockinsService = {
  submitLockInForm: async (data: Record<string, unknown>) => {
    const response = await api(STATIC_ENDPOINTS.LOCKIN.SUBMIT, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response?.success) return response;
    throw new Error("Failed to submit lock-in form");
  },

  getSchoolLockIn: async (schoolId: string | number): Promise<LockInData> => {
    const response = await api(DYNAMIC_ENDPOINTS.SCHOOLS.GET_LOCKIN(schoolId));
    if (response?.success && response.data) {
      return response.data as LockInData;
    }
    throw new Error("Failed to fetch school lock-in data");
  },

  getLockInUpdate: async (lockinId: string | number): Promise<Record<string, unknown>> => {
    const response = await api(DYNAMIC_ENDPOINTS.LOCKIN.GET_UPDATE(lockinId));
    if (response?.success && response.data) {
      return response.data as Record<string, unknown>;
    }
    throw new Error("Failed to fetch lock-in update");
  },

  getSchoolUrgentCare: async (
    schoolId: string | number
  ): Promise<{ totalUrgentCarePatients: number; patients: UrgentCarePatient[] }> => {
    const response = await api(DYNAMIC_ENDPOINTS.LOCKIN.GET_URGENT_CARE(schoolId));
    if (response?.success && response.data) {
      const data = response.data as {
        totalUrgentCarePatients?: number;
        patients?: UrgentCarePatient[];
      };
      return {
        totalUrgentCarePatients: data.totalUrgentCarePatients ?? 0,
        patients: data.patients ?? [],
      };
    }
    return { totalUrgentCarePatients: 0, patients: [] };
  },
};
