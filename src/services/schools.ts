import { api } from "@/lib/api";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { axiosFormData, axiosInstance } from "@/configs/axiosInstance";
import { checkResponse } from "@/lib/api-utils";
import { ICreateSchool, IUpdateSchool, School } from "@/lib/types/school";
import { SchoolProvider } from "@/lib/types/provider";

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

    const response = await axiosFormData.post(STATIC_ENDPOINTS.SCHOOLS, formData);
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

    const response = await axiosInstance.put(
      DYNAMIC_ENDPOINTS.SCHOOLS.UPDATE(data.id),
      body,
    );
    return checkResponse(response, 200);
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
};
