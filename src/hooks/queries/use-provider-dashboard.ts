"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { providerDashboardService } from "@/services/provider/dashboard";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import type { ProviderUpdateProfileRequest } from "@/lib/types/api/provider-dashboard";

const PD = QUERY_KEYS.providerDashboard;

export const useProviderDashboardInit = () =>
  useQuery({
    queryKey: [PD, "init"],
    queryFn: providerDashboardService.getDashboardInit,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useProviderUrgentPatients = () =>
  useQuery({
    queryKey: [PD, "patients", "urgent"],
    queryFn: providerDashboardService.getUrgentPatients,
    staleTime: 60 * 1000,
  });

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProviderUpdateProfileRequest) =>
      providerDashboardService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PD, "profile"] });
      queryClient.invalidateQueries({ queryKey: [PD, "init"] });
      toast.success("Profile updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => providerDashboardService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PD, "profile"] });
      queryClient.invalidateQueries({ queryKey: [PD, "init"] });
      toast.success("Avatar updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload avatar");
    },
  });
};

export const useUpdatePhoneNumberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      officePhoneNumber: string;
      currentStatus: string;
    }) =>
      providerDashboardService.updatePhoneNumber({
        officePhoneNumber: payload.officePhoneNumber,
        status: payload.currentStatus,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PD, "profile"] });
      queryClient.invalidateQueries({ queryKey: [PD, "init"] });
      toast.success("Phone number updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update phone number");
    },
  });
};
