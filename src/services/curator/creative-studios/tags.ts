import { api } from "@/lib/api";
import { STATIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import type {
  CreateTagInput,
  TagResponse,
} from "@/lib/types/api/creative-studios";
import {
  appendFormDataArray,
  appendFormDataFile,
  appendFormDataScalar,
} from "@/lib/utils/shared/append-form-data";
import { requireSuccessData } from "@/lib/utils/shared/api-result";

function buildTagFormData(input: CreateTagInput): FormData {
  const formData = new FormData();
  appendFormDataScalar(formData, "mainTitle", input.mainTitle);
  appendFormDataArray(formData, "tags", input.tags);
  appendFormDataFile(formData, "image", input.image);
  return formData;
}

export const tagsService = {
  createTag: async (input: CreateTagInput): Promise<TagResponse> => {
    const result = await api(STATIC_ENDPOINTS.TAGS, {
      method: "POST",
      body: buildTagFormData(input),
    });
    return requireSuccessData<TagResponse>(result, "Failed to create tag");
  },
};
