import { api } from "@/lib/api";
import { STATIC_ENDPOINTS } from "@/lib/constants/endpoints";
import type {
  CreateSpecialtyInput,
  SpecialtyCreateResponse,
} from "@/lib/types/api/creative-studios";
import type { SpecialtyResponse } from "@/lib/types/api/common";
import {
  appendFormDataArray,
  appendFormDataFile,
  appendFormDataScalar,
} from "@/lib/utils/shared/append-form-data";
import { requireSuccessData } from "@/lib/utils/shared/api-result";

function buildSpecialtyFormData(input: CreateSpecialtyInput): FormData {
  const formData = new FormData();
  appendFormDataScalar(formData, "name", input.name);
  appendFormDataArray(formData, "nicknames", input.nicknames);
  appendFormDataScalar(formData, "bio", input.bio ?? "");
  appendFormDataScalar(formData, "clinical", input.clinical);
  appendFormDataFile(formData, "icon", input.icon);
  return formData;
}

export const specialtiesService = {
  list: async (): Promise<SpecialtyResponse[]> => {
    const result = await api(STATIC_ENDPOINTS.SPECIALTIES);
    if (result?.success && result.data) {
      return Array.isArray(result.data) ? result.data : [];
    }
    return [];
  },

  createSpecialty: async (
    input: CreateSpecialtyInput,
  ): Promise<SpecialtyCreateResponse> => {
    const result = await api(STATIC_ENDPOINTS.SPECIALTIES, {
      method: "POST",
      body: buildSpecialtyFormData(input),
    });
    return requireSuccessData<SpecialtyCreateResponse>(
      result,
      "Failed to create provider",
    );
  },
};
