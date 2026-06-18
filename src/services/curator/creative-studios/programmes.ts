import { api } from "@/lib/api";
import { STATIC_ENDPOINTS } from "@/lib/constants/endpoints";
import type {
  CreateProgrammeInput,
  ProgrammeResponse,
} from "@/lib/types/api/creative-studios";
import {
  appendFormDataArray,
  appendFormDataFile,
  appendFormDataScalar,
} from "@/lib/utils/shared/append-form-data";
import { requireSuccessData } from "@/lib/utils/shared/api-result";

function buildProgrammeFormData(input: CreateProgrammeInput): FormData {
  const formData = new FormData();
  appendFormDataScalar(formData, "fullName", input.fullName);
  appendFormDataArray(formData, "nicknames", input.nicknames);
  appendFormDataScalar(formData, "bio", input.bio ?? "");
  appendFormDataScalar(
    formData,
    "durationFrom",
    String(input.durationFromYear),
  );
  appendFormDataScalar(formData, "durationTo", String(input.durationToYear));
  appendFormDataFile(formData, "coverPhoto", input.coverPhoto);
  return formData;
}

export const programmesService = {
  createProgramme: async (
    input: CreateProgrammeInput,
  ): Promise<ProgrammeResponse> => {
    const result = await api(STATIC_ENDPOINTS.PROGRAMMES, {
      method: "POST",
      body: buildProgrammeFormData(input),
    });
    return requireSuccessData<ProgrammeResponse>(
      result,
      "Failed to create programme",
    );
  },
};
