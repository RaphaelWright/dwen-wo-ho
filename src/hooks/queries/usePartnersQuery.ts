"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosFormData } from "@/configs/axiosInstance";
import { checkResponse } from "@/lib/api-utils";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { toast } from "sonner";

export interface ICreatePartner {
  name: string;
  nickname?: string;
  slogan?: string;
  logo?: File | null;
}

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

const PARTNERS_QUERY_KEY = "partners";

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
