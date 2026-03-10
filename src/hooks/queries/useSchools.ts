"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { schoolsService } from "@/services/schools";
import { lockinsService } from "@/services/lockins";

const SCHOOLS_QUERY_KEY = "schools";
const SCHOOLS_LOCKIN_QUERY_KEY = "schools_lockin";

export const useSchools = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [SCHOOLS_QUERY_KEY],
    queryFn: () => schoolsService.getSchools(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

export const useSchoolsWithRefetch = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [SCHOOLS_QUERY_KEY],
    queryFn: () => schoolsService.getSchools(),
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

export const useSchool = (schoolId: string) => {
  return useQuery({
    queryKey: [SCHOOLS_QUERY_KEY, schoolId],
    queryFn: () => schoolsService.getSchool(schoolId),
    enabled: !!schoolId,
  });
};

export const useSchoolLockin = (schoolId: string) => {
  return useQuery({
    queryKey: [SCHOOLS_LOCKIN_QUERY_KEY, schoolId],
    queryFn: () => lockinsService.getSchoolLockIn(schoolId),
    enabled: !!schoolId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schoolsService.createSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHOOLS_QUERY_KEY] });
      toast.success("School created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create school");
    },
  });
};

export const useDisableSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schoolsService.disableSchool,
    onSuccess: (data, schoolId) => {
      queryClient.invalidateQueries({ queryKey: [SCHOOLS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [SCHOOLS_QUERY_KEY, String(schoolId)],
      });
      toast.success("School disabled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to disable school");
    },
  });
};

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schoolsService.updateSchool,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [SCHOOLS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [SCHOOLS_QUERY_KEY, String(variables.id)],
      });
      toast.success("School updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update school");
    },
  });
};
