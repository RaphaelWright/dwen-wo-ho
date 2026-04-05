"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { providerDashboardService } from "@/services/provider-dashboard";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import type {
  UpdateProfileRequest,
  UpdatePatientStatusRequest,
  ProviderPatientsParams,
} from "@/lib/types/api/provider-dashboard";

const PD = QUERY_KEYS.providerDashboard;

export const useProviderDashboardInit = () =>
  useQuery({
    queryKey: [PD, "init"],
    queryFn: providerDashboardService.getDashboardInit,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useProviderProfile = () =>
  useQuery({
    queryKey: [PD, "profile"],
    queryFn: providerDashboardService.getProfile,
    staleTime: 2 * 60 * 1000,
  });

export const useProviderPatients = (params?: ProviderPatientsParams) =>
  useQuery({
    queryKey: [PD, "patients", params],
    queryFn: () => providerDashboardService.getPatients(params),
    staleTime: 60 * 1000,
  });

export const useProviderUrgentPatients = () =>
  useQuery({
    queryKey: [PD, "patients", "urgent"],
    queryFn: providerDashboardService.getUrgentPatients,
    staleTime: 60 * 1000,
  });

export const useProviderNotifications = (page?: number) =>
  useQuery({
    queryKey: [PD, "notifications", page],
    queryFn: () => providerDashboardService.getNotifications(page),
    staleTime: 60 * 1000,
  });

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) =>
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

export const useUpdatePatientStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      payload,
    }: {
      patientId: string | number;
      payload: UpdatePatientStatusRequest;
    }) => providerDashboardService.updatePatientStatus(patientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PD, "patients"] });
      toast.success("Patient status updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update patient status");
    },
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: providerDashboardService.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PD, "notifications"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark notifications read");
    },
  });
};

export const useMarkOneNotificationReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      providerDashboardService.markOneNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PD, "notifications"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark notification read");
    },
  });
};
