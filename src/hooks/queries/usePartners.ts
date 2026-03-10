"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { partnersService, Partner, ICreatePartner } from "@/services/partners";

export type { Partner, ICreatePartner };

export const PARTNERS_QUERY_KEY = "partners";

export const useCreatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: partnersService.createPartner,
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

export const usePartnersList = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [PARTNERS_QUERY_KEY],
    queryFn: partnersService.getPartners,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled ?? true,
  });
};

export const usePartner = (partnerId: string) => {
  return useQuery({
    queryKey: [PARTNERS_QUERY_KEY, partnerId],
    queryFn: () => partnersService.getPartner(partnerId),
    enabled: !!partnerId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
