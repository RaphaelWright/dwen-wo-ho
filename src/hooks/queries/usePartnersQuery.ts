"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosFormData } from "@/configs/axiosInstance";
import { checkResponse } from "@/lib/api-utils";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { toast } from "@/components/ui/sonner";

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

const fetchPartners = async (): Promise<Partner[]> => {
  const response = await api(ENDPOINTS.partners);
  if (response?.success && response.data) {
    return Array.isArray(response.data) ? response.data : [];
  }
  return [];
};

const fetchPartner = async (partnerId: string): Promise<Partner> => {
  const response = await api(ENDPOINTS.partner(partnerId));
  if (response?.success && response.data) {
    return response.data;
  }
  throw new Error("Failed to fetch partner");
};

const createPartner = async (
  data: ICreatePartner,
): Promise<{
  id: string;
  name: string;
  nickname?: string;
  slogan?: string;
  logo?: string;
}> => {
  const formData = new FormData();
  formData.append("name", data.name);

  if (data.nickname) {
    formData.append("nickname", data.nickname);
  }

  if (data.slogan) {
    formData.append("slogan", data.slogan);
  }

  if (data.logo) {
    formData.append("logo", data.logo);
  }

  const response = await axiosFormData.post(ENDPOINTS.partners, formData);
  return checkResponse(response, 201);
};

export const PARTNERS_QUERY_KEY = "partners";

export const useCreatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPartner,
    onSuccess: () => {
      // Invalidate all partner-related queries
      queryClient.invalidateQueries({ queryKey: [PARTNERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Partner created successfully");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to create partner";
      // Try to extract a cleaner error message
      try {
        const parsed = JSON.parse(errorMessage);
        toast.error(parsed.message || errorMessage);
      } catch {
        toast.error(errorMessage);
      }
    },
  });
};

export const usePartnersList = () => {
  return useQuery({
    queryKey: [PARTNERS_QUERY_KEY],
    queryFn: fetchPartners,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePartner = (partnerId: string) => {
  return useQuery({
    queryKey: [PARTNERS_QUERY_KEY, partnerId],
    queryFn: () => fetchPartner(partnerId),
    enabled: !!partnerId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
