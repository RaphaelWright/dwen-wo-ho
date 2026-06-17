import { api } from "@/lib/api";
import { DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import type {
  LatestSchoolPatientResult,
  SchoolNewPatientCheck,
} from "@/lib/types/api/providers";

interface PatientResultSummary {
  id: number;
  patientName: string;
  createdAt: string;
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(items: T[]): T[] {
  return items.toSorted(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export const schoolsService = {
  getLockInCount: async (schoolId: string | number): Promise<number> => {
    try {
      const response = await api(
        DYNAMIC_ENDPOINTS.SCHOOLS.GET_LOCKIN(schoolId),
      );

      if (response?.success && response.data) {
        return response.data.students?.length || 0;
      }

      return 0;
    } catch {
      return 0;
    }
  },

  getLatestPatientResult: async (
    schoolId: string | number,
  ): Promise<LatestSchoolPatientResult | null> => {
    try {
      const response = await api(
        DYNAMIC_ENDPOINTS.PATIENT_RESULTS.GET_SCHOOL_RESULTS(schoolId),
      );

      if (response?.success && response.data && response.data.length > 0) {
        const sorted = sortByCreatedAtDesc(
          response.data as PatientResultSummary[],
        );

        return {
          id: sorted[0].id,
          patientName: sorted[0].patientName,
          createdAt: sorted[0].createdAt,
        };
      }

      return null;
    } catch {
      return null;
    }
  },

  checkForNewPatients: async (
    schoolId: string | number,
    previousPatientName?: string,
  ): Promise<SchoolNewPatientCheck | null> => {
    try {
      const response = await api(
        DYNAMIC_ENDPOINTS.PATIENT_RESULTS.GET_NEW_SCHOOL_RESULTS(schoolId),
      );

      if (response?.success && response.data && response.data.length > 0) {
        const sorted = sortByCreatedAtDesc(
          response.data as PatientResultSummary[],
        );

        const latest = sorted[0];
        const hasNew = previousPatientName !== latest.patientName;

        return {
          hasNew,
          latestPatient: hasNew
            ? {
                patientName: latest.patientName,
                createdAt: latest.createdAt,
              }
            : undefined,
        };
      }

      return { hasNew: false };
    } catch {
      return null;
    }
  },
};
