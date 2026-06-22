"use client";
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { curatorProvidersService } from "@/services/curator/providers";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import type { ProviderActivityParams } from "@/lib/types/api/providers";

export const useProviderActivityQuery = (params?: ProviderActivityParams) =>
  useQuery({
    queryKey: [QUERY_KEYS.providers, "activity", params],
    queryFn: () => curatorProvidersService.getActivity(params),
    staleTime: 60 * 1000,
  });

export const useProviderSchoolsSummary = () =>
  useQuery({
    queryKey: [QUERY_KEYS.providerSchoolsSummary],
    queryFn: curatorProvidersService.getSchoolsSummary,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// Single provider query — hoisted; closes over no component state.
const useProvider = (email: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.providers, email],
    queryFn: () => curatorProvidersService.getProvider(email),
    enabled: !!email,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useProvidersQuery = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();

  const {
    data: providers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.providers],
    queryFn: curatorProvidersService.getProviders,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

  // Approve provider mutation
  const approveProviderMutation = useMutation({
    mutationFn: curatorProvidersService.approveProvider,
    onSuccess: (data, email) => {
      // Invalidate providers queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.providers] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providers, email],
      });

      toast.success("Provider approved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve provider");
    },
  });

  // Reject provider mutation
  const rejectProviderMutation = useMutation({
    mutationFn: curatorProvidersService.rejectProvider,
    onSuccess: (data, email) => {
      // Invalidate providers queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.providers] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providers, email],
      });

      toast.success("Provider rejected successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject provider");
    },
  });

  const invalidateProvider = useCallback(
    async (email: string) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.providers] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providers, email],
      });
    },
    [queryClient],
  );

  const addSchoolMutation = useMutation({
    mutationFn: ({
      providerId,
      schoolId,
    }: {
      providerId: string | number;
      schoolId: string | number;
    }) => curatorProvidersService.addSchoolToProvider(providerId, schoolId),
    onSuccess: (_, { providerId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.providers] });
      if (typeof providerId === "string") {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.providers, providerId],
        });
      }
      toast.success("School added to provider successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to add school"),
  });

  const removeSchoolMutation = useMutation({
    mutationFn: ({
      providerId,
      schoolId,
    }: {
      providerId: string | number;
      schoolId: string | number;
    }) =>
      curatorProvidersService.removeSchoolFromProvider(providerId, schoolId),
    onSuccess: (_, { providerId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.providers] });
      if (typeof providerId === "string") {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.providers, providerId],
        });
      }
      toast.success("School removed from provider successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to remove school"),
  });

  // Return all queries and mutations
  return {
    // Queries
    providers,
    isLoading,
    isError,
    error,
    // Single provider query helper
    useProvider,
    // Mutations
    approveProvider: (email: string, options?: { onSettled?: () => void }) => {
      approveProviderMutation.mutate(email, {
        onSettled: options?.onSettled,
      });
    },
    rejectProvider: (email: string, options?: { onSettled?: () => void }) => {
      rejectProviderMutation.mutate(email, {
        onSettled: options?.onSettled,
      });
    },
    isModerating:
      approveProviderMutation.isPending || rejectProviderMutation.isPending,
    // New
    addSchoolToProvider: addSchoolMutation.mutateAsync,
    isAddingSchool: addSchoolMutation.isPending,
    removeSchoolFromProvider: removeSchoolMutation.mutateAsync,
    isRemovingSchool: removeSchoolMutation.isPending,
    invalidateProvider,
  };
};
