import { api } from "@/lib/api";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { PatientResult } from "@/lib/types/patient";

export const patientsService = {
  getPatientResult: async (resultId: string | number): Promise<PatientResult> => {
    const response = await api(DYNAMIC_ENDPOINTS.PATIENT_RESULTS.GET(resultId));
    if (response?.success && response.data) {
      return response.data as PatientResult;
    }
    throw new Error("Failed to fetch patient result");
  },

  getSchoolResults: async (schoolId: string | number): Promise<PatientResult[]> => {
    const response = await api(DYNAMIC_ENDPOINTS.PATIENT_RESULTS.GET_SCHOOL_RESULTS(schoolId));
    if (response?.success && response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }
    return [];
  },

  openPatientResult: async (resultId: string | number): Promise<PatientResult> => {
    const response = await api(DYNAMIC_ENDPOINTS.PATIENT_RESULTS.OPEN(resultId), {
      method: "POST",
    });
    if (response?.success && response.data) {
      return response.data as PatientResult;
    }
    throw new Error("Failed to open patient result");
  },

  updateActionStatus: async (
    resultId: string | number,
    data: { providerId: string | number; actionStatus: string }
  ) => {
    const response = await api(DYNAMIC_ENDPOINTS.PATIENT_RESULTS.UPDATE_ACTION_STATUS(resultId), {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (response?.success) return response;
    throw new Error("Failed to update action status");
  },

  createPatientResult: async (data: { lockinId: number; schoolId: number }) => {
    const response = await api(STATIC_ENDPOINTS.PATIENT_RESULTS.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response?.success) return response;
    throw new Error("Failed to create patient result");
  },
};
