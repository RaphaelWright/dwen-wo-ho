import { api } from "@/lib/api";
import { STATIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import type {
  CampusResponse,
  CreateCampusInput,
} from "@/lib/types/api/creative-studios";
import {
  appendFormDataArray,
  appendFormDataFile,
  appendFormDataScalar,
} from "@/lib/utils/shared/append-form-data";
import { requireSuccessData } from "@/lib/utils/shared/api-result";
import { toCampusApiType } from "@/lib/utils/curator/create/to-campus-api-type";

function buildCampusFormData(input: CreateCampusInput): FormData {
  const formData = new FormData();
  appendFormDataScalar(formData, "fullName", input.fullName);
  appendFormDataArray(formData, "nicknames", input.nicknames);
  appendFormDataScalar(formData, "motto", input.motto ?? "");
  appendFormDataScalar(formData, "type", toCampusApiType(input.type));
  appendFormDataScalar(formData, "location", input.location);
  appendFormDataFile(formData, "logo", input.logo);
  appendFormDataFile(formData, "bannerPhoto", input.bannerPhoto);
  return formData;
}

export const campusesService = {
  createCampus: async (input: CreateCampusInput): Promise<CampusResponse> => {
    const result = await api(STATIC_ENDPOINTS.CAMPUSES, {
      method: "POST",
      body: buildCampusFormData(input),
    });
    return requireSuccessData<CampusResponse>(
      result,
      "Failed to create campus",
    );
  },
};
