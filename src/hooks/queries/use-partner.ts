"use client";
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { partnersService } from "@/services/partners";
import { api } from "@/lib/api";
import { DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export default function usePartnerQuery() {
  const queryClient = useQueryClient();

  const createPartnerMutation = useMutation({
    mutationFn: partnersService.createPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.partners] });
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Partner created successfully");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to create partner";
      try {
        const parsed = JSON.parse(errorMessage);
        toast.error(parsed.message || errorMessage);
      } catch {
        toast.error(errorMessage);
      }
    },
  });

  const usePartnersList = (options?: { enabled?: boolean }) =>
    useQuery({
      queryKey: [QUERY_KEYS.partners],
      queryFn: partnersService.getPartners,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      enabled: options?.enabled ?? true,
    });

  const usePartner = (partnerId: string) =>
    useQuery({
      queryKey: [QUERY_KEYS.partners, partnerId],
      queryFn: () => partnersService.getPartner(partnerId),
      enabled: !!partnerId,
      staleTime: 3 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  const addSchoolMutation = useMutation({
    mutationFn: ({
      partnerId,
      schoolId,
    }: {
      partnerId: string;
      schoolId: string | number;
    }) =>
      api(DYNAMIC_ENDPOINTS.PARTNERS.ADD_SCHOOL(partnerId, schoolId), {
        method: "POST",
      }),
    onSuccess: (_, { partnerId }) => {
      invalidatePartners(partnerId);
      toast.success("School added successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to add school"),
  });

  const usePartnerFullDetails = (
    partnerId: string,
    options?: { enabled?: boolean },
  ) =>
    useQuery({
      queryKey: [QUERY_KEYS.partners, "details", partnerId],
      queryFn: () => partnersService.getPartnerDetails(partnerId),
      enabled: (options?.enabled ?? true) && !!partnerId,
      staleTime: 3 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  const invalidatePartners = useCallback(
    async (partnerId?: string) => {
      if (partnerId) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.partners, "details", partnerId],
        });
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.partners, partnerId],
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.partners],
        });
      }
    },
    [queryClient],
  );

  const removeSchoolMutation = useMutation({
    mutationFn: ({
      partnerId,
      schoolId,
    }: {
      partnerId: string;
      schoolId: string | number;
    }) =>
      api(DYNAMIC_ENDPOINTS.PARTNERS.REMOVE_SCHOOL(partnerId, schoolId), {
        method: "POST",
      }),
    onSuccess: (_, { partnerId }) => {
      invalidatePartners(partnerId);
      toast.success("School removed successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to remove school"),
  });

  const addProviderMutation = useMutation({
    mutationFn: ({
      partnerId,
      providerId,
    }: {
      partnerId: string;
      providerId: string | number;
    }) =>
      api(DYNAMIC_ENDPOINTS.PARTNERS.ADD_PROVIDER(partnerId, providerId), {
        method: "POST",
      }),
    onSuccess: (_, { partnerId }) => {
      invalidatePartners(partnerId);
      toast.success("Provider added successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to add provider"),
  });

  const removeProviderMutation = useMutation({
    mutationFn: ({
      partnerId,
      providerId,
    }: {
      partnerId: string;
      providerId: string | number;
    }) =>
      api(DYNAMIC_ENDPOINTS.PARTNERS.REMOVE_PROVIDER(partnerId, providerId), {
        method: "POST",
      }),
    onSuccess: (_, { partnerId }) => {
      invalidatePartners(partnerId);
      toast.success("Provider removed successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to remove provider"),
  });

  return {
    usePartnersList,
    usePartner,
    createPartner: createPartnerMutation.mutateAsync,
    isCreating: createPartnerMutation.isPending,
    addSchool: addSchoolMutation.mutateAsync,
    isAddingSchool: addSchoolMutation.isPending,
    removeSchool: removeSchoolMutation.mutateAsync,
    isRemovingSchool: removeSchoolMutation.isPending,
    addProvider: addProviderMutation.mutateAsync,
    isAddingProvider: addProviderMutation.isPending,
    removeProvider: removeProviderMutation.mutateAsync,
    isRemovingProvider: removeProviderMutation.isPending,
    usePartnerFullDetails,
    invalidatePartners,
  };
}
