"use client";
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { providersService } from "@/services/providers";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export const useProvidersQuery = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();

  const providersQuery = useQuery({
    queryKey: [QUERY_KEYS.providers],
    queryFn: providersService.getProviders,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

  // Get single provider
  const useProvider = (email: string) =>
    useQuery({
      queryKey: [QUERY_KEYS.providers, email],
      queryFn: () => providersService.getProvider(email),
      enabled: !!email,
      staleTime: 3 * 60 * 1000, // 3 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });

  // Approve provider mutation
  const approveProviderMutation = useMutation({
    mutationFn: providersService.approveProvider,
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
    mutationFn: providersService.rejectProvider,
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
    }) => providersService.addSchoolToProvider(providerId, schoolId),
    onSuccess: (_, { providerId }) => {
      if (typeof providerId === "string") invalidateProvider(providerId);
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
    }) => providersService.removeSchoolFromProvider(providerId, schoolId),
    onSuccess: (_, { providerId }) => {
      if (typeof providerId === "string") invalidateProvider(providerId);
      toast.success("School removed from provider successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to remove school"),
  });

  // Return all queries and mutations
  return {
    // Queries
    providers: providersQuery.data,
    isLoading: providersQuery.isLoading,
    isError: providersQuery.isError,
    error: providersQuery.error,
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
