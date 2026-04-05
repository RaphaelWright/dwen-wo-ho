import { api } from "@/lib/api";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { LockInData } from "@/lib/types/lockin";
import { LockinUpdateResponse } from "@/lib/types/api/lockin";
import { UrgentCarePatient } from "@/lib/types/patient";

export const lockinsService = {
  submitLockInForm: async (
    data: Record<string, unknown>,
  ): Promise<{ lockinId: number }> => {
    const response = await api(STATIC_ENDPOINTS.LOCKIN.SUBMIT, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response?.success && response.data) {
      return response.data as { lockinId: number };
    }
    throw new Error("Failed to submit lock-in form");
  },

  getSchoolLockIn: async (schoolId: string | number): Promise<LockInData> => {
    const response = await api(DYNAMIC_ENDPOINTS.SCHOOLS.GET_LOCKIN(schoolId));
    if (response?.success && response.data) {
      return response.data as LockInData;
    }
    throw new Error("Failed to fetch school lock-in data");
  },

  getLockInUpdate: async (
    lockinId: string | number,
  ): Promise<LockinUpdateResponse> => {
    const response = await api(DYNAMIC_ENDPOINTS.LOCKIN.GET_UPDATE(lockinId));
    if (response?.success && response.data) {
      return response.data as LockinUpdateResponse;
    }
    throw new Error("Failed to fetch lock-in update");
  },

  addComment: async (
    lockinId: string | number,
    comment: string,
  ): Promise<void> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.LOCKIN.UPDATE_COMMENT(lockinId),
      {
        method: "PATCH",
        body: JSON.stringify({ comment }),
      },
    );
    if (!response?.success) throw new Error("Failed to save comment");
  },

  getSchoolUrgentCare: async (
    schoolId: string | number,
  ): Promise<{
    totalUrgentCarePatients: number;
    patients: UrgentCarePatient[];
  }> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.LOCKIN.GET_URGENT_CARE(schoolId),
    );
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

  // T3-9: Light Urgent Care (names + scores only)
  getSchoolUrgentCareLight: async (
    schoolId: string | number,
  ): Promise<{
    totalUrgentCarePatients: number;
    patients: Array<{ id: string; patientName: string; score: number }>;
  }> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.LOCKIN.GET_URGENT_CARE_LIGHT(schoolId),
    );
    if (response?.success && response.data) {
      const data = response.data as {
        totalUrgentCarePatients?: number;
        patients?: Array<{ id: string; patientName: string; score: number }>;
      };
      return {
        totalUrgentCarePatients: data.totalUrgentCarePatients ?? 0,
        patients: data.patients ?? [],
      };
    }
    return { totalUrgentCarePatients: 0, patients: [] };
  },

  // T3-9: Treating patients only
  getSchoolUrgentCareTreating: async (
    schoolId: string | number,
  ): Promise<{
    totalUrgentCarePatients: number;
    patients: UrgentCarePatient[];
  }> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.LOCKIN.GET_URGENT_CARE_TREATING(schoolId),
    );
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

  // T3-9: Benchmarks by school type
  getBenchmarks: async (
    schoolType: string,
  ): Promise<{
    averageLockedInScore: number;
    averageGeneralMentalHealthScore: number;
    averageDepressionScore: number;
    averageLonelinessScore: number;
    averageSuicidalityScore: number;
  }> => {
    const response = await api(
      DYNAMIC_ENDPOINTS.LOCKIN.GET_BENCHMARKS(schoolType),
    );
    if (response?.success && response.data) {
      return response.data as {
        averageLockedInScore: number;
        averageGeneralMentalHealthScore: number;
        averageDepressionScore: number;
        averageLonelinessScore: number;
        averageSuicidalityScore: number;
      };
    }
    return {
      averageLockedInScore: 0,
      averageGeneralMentalHealthScore: 0,
      averageDepressionScore: 0,
      averageLonelinessScore: 0,
      averageSuicidalityScore: 0,
    };
  },
};
