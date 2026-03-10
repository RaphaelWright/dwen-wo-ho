import { api } from "@/lib/api";
import { STATIC_ENDPOINTS, DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { axiosFormData } from "@/configs/axiosInstance";
import { checkResponse } from "@/lib/api-utils";

export interface ICreatePartner {
  name: string;
  nickname?: string;
  slogan?: string;
  logo?: File | null;
}

export interface Partner {
  id: string | number;
  name: string;
  nickname?: string;
  slogan?: string;
  logo?: string;
  [key: string]: unknown;
}

export const partnersService = {
  getPartners: async (): Promise<Partner[]> => {
    const response = await api(STATIC_ENDPOINTS.PARTNERS);
    if (response?.success && response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }
    return [];
  },

  getPartner: async (partnerId: string): Promise<Partner> => {
    const response = await api(DYNAMIC_ENDPOINTS.PARTNERS.GET(partnerId));
    if (response?.success && response.data) {
      return response.data as Partner;
    }
    throw new Error("Failed to fetch partner");
  },

  createPartner: async (data: ICreatePartner): Promise<{ id: string; name: string; nickname?: string; slogan?: string; logo?: string }> => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.nickname) formData.append("nickname", data.nickname);
    if (data.slogan) formData.append("slogan", data.slogan);
    if (data.logo) formData.append("logo", data.logo);

    const response = await axiosFormData.post(STATIC_ENDPOINTS.PARTNERS, formData);
    return checkResponse(response, 201);
  },
};
