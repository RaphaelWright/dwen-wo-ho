import { api } from "@/lib/api";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { axiosFormData } from "@/configs/axiosInstance";
import { checkResponse } from "@/lib/api-utils";
import { ICreateSchool, IUpdateSchool, School } from "@/lib/types/school";
import { SchoolProvider } from "@/lib/types/provider";
import { patientsService } from "./patients";
import { lockinsService } from "./lockins";
import { LockInStudent } from "@/lib/types/lockin";
import { PatientResult } from "@/lib/types/patient";
import { UrgentPatient } from "@/components/shared/urgent-card";

export const schoolsService = {
  getSchools: async (): Promise<School[]> => {
    const result = await api(STATIC_ENDPOINTS.SCHOOLS);
    if (result?.success && Array.isArray(result.data)) return result.data;
    if (Array.isArray(result)) return result;
    return [];
  },

  getSchool: async (schoolId: string): Promise<School> => {
    const result = await api(DYNAMIC_ENDPOINTS.SCHOOLS.GET(schoolId));
    if (result?.success && result.data) return result.data;
    throw new Error("Failed to fetch school");
  },

  disableSchool: async (schoolId: string): Promise<School> => {
    // Both PUT /api/v1/schools/:id/disable and POST /api/v1/schools/disable were used.
    // Standardizing on the provided endpoint.
    const result = await api(DYNAMIC_ENDPOINTS.SCHOOLS.DISABLE(schoolId), {
      method: "PUT",
    });
    if (result?.success && result.data) return result.data;
    throw new Error("Failed to disable school");
  },

  createSchool: async (data: ICreateSchool): Promise<School> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("nickname", data.nickname || "");
    formData.append("type", data.type);
    formData.append("baseline", data.baseline || "");
    formData.append("motto", data.motto || "");
    // Send campuses as comma-separated string
    formData.append("campuses", data.campuses.join(","));

    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const response = await axiosFormData.post(
      STATIC_ENDPOINTS.SCHOOLS,
      formData,
    );
    return checkResponse(response, 201);
  },

  updateSchool: async (data: IUpdateSchool): Promise<School> => {
    const body: Record<string, unknown> = {};
    if (data.name !== undefined) body.name = data.name;
    if (data.nickname !== undefined) body.nickname = data.nickname;
    if (data.type !== undefined) body.type = data.type;
    if (data.baseline !== undefined) body.baseline = data.baseline;
    if (data.motto !== undefined) body.motto = data.motto;
    if (data.campuses !== undefined) body.campuses = data.campuses;

    const result = await api(DYNAMIC_ENDPOINTS.SCHOOLS.UPDATE(data.id), {
      method: "PUT",
      body: JSON.stringify(body),
    });
    if (!result?.success) throw new Error("Failed to update school");
    return result.data as School;
  },

  getSchoolProviders: async (schoolId: string): Promise<SchoolProvider[]> => {
    const response = await api(DYNAMIC_ENDPOINTS.SCHOOLS.PROVIDERS(schoolId));
    if (response?.success && response.data) {
      const data = response.data as { providers?: SchoolProvider[] };
      return data.providers || [];
    }
    const direct = response as { providers?: SchoolProvider[] };
    if (direct?.providers) return direct.providers;
    return [];
  },

  getPatientsOverview: async (schoolId: string | number) => {
    const response = await api(
      DYNAMIC_ENDPOINTS.SCHOOLS.PATIENTS_OVERVIEW(schoolId),
    );
    if (response?.success && response.data) {
      return response.data as {
        patients: unknown[];
        urgentCare: {
          totalUrgentCarePatients: number;
          patients: UrgentPatient[];
        };
      };
    }
    return {
      patients: [],
      urgentCare: { totalUrgentCarePatients: 0, patients: [] },
    };
  },

  getSchoolStudents: async (schoolId: string): Promise<LockInStudent[]> => {
    let lockInData;
    try {
      lockInData = await lockinsService.getSchoolLockIn(schoolId);
    } catch {
      return [];
    }

    if (!lockInData) return [];

    let studentsList = lockInData.students || [];

    try {
      const resultsResponse = await patientsService.getSchoolResults(schoolId);
      if (resultsResponse && Array.isArray(resultsResponse)) {
        const results = resultsResponse;

        const resultMap = new Map<string, PatientResult>();
        results.forEach((result: PatientResult) => {
          resultMap.set(result.patientName, result);
        });

        studentsList = studentsList.map((student) => {
          const result = resultMap.get(student.studentName);
          if (result) {
            return {
              ...student,
              lockinId: result.lockinId,
              createdAt: result.createdAt,
              patientResultId: result.id,
              visibilityStatus: result.visibilityStatus,
            };
          }
          return student;
        });
      }
    } catch {
      // Silently handle errors when fetching patient results
    }

    studentsList.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (a.createdAt) return -1;
      if (b.createdAt) return 1;
      return a.studentName.localeCompare(b.studentName);
    });

    return studentsList;
  },

  batchCreateSchools: async (schools: ICreateSchool[]): Promise<School[]> => {
    const result = await api(STATIC_ENDPOINTS.SCHOOLS_BATCH, {
      method: "POST",
      body: JSON.stringify({ data: schools }),
    });
    if (result?.success && Array.isArray(result.data)) return result.data;
    if (Array.isArray(result)) return result;
    throw new Error("Failed to batch create schools");
  },

  addProviderToSchool: async (
    schoolId: string | number,
    providerEmail: string,
  ): Promise<void> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.SCHOOLS.ADD_PROVIDER(schoolId, providerEmail),
      {
        method: "POST",
      },
    );
    if (!result?.success) throw new Error("Failed to add provider to school");
  },

  removeProviderFromSchool: async (
    schoolId: string | number,
    providerEmail: string,
  ): Promise<void> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.SCHOOLS.REMOVE_PROVIDER(schoolId, providerEmail),
      {
        method: "POST",
      },
    );
    if (!result?.success)
      throw new Error("Failed to remove provider from school");
  },

  getSchoolReach: async (
    schoolId: string | number,
  ): Promise<{ schoolName: string; reach: number }> => {
    const result = await api(`${STATIC_ENDPOINTS.SCHOOLS}/${schoolId}/reach`);
    if (result?.success && result.data)
      return result.data as { schoolName: string; reach: number };
    return { schoolName: "", reach: 0 };
  },
};
