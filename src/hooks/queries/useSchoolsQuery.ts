"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosFormData, axiosInstance } from "@/configs/axiosInstance";
import { checkError, checkResponse } from "@/lib/api-utils";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { ICreateSchool, IUpdateSchool, School } from "@/lib/types/school";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { LockInData } from "@/lib/types/lockin";

const getSchools = async (): Promise<School[]> => {
  const result = await api(`/api/v1/schools`);

  if (result?.success && Array.isArray(result.data)) {
    return result.data;
  }

  if (Array.isArray(result)) {
    return result;
  }

  return [];
};

const getSchool = async (schoolId: string): Promise<School> => {
  const result = await api(`/api/v1/schools/${schoolId}`);

  if (result?.success && result.data) {
    return result.data;
  }

  throw new Error("Failed to fetch school");
};

const disableSchool = async (schoolId: string): Promise<School> => {
  const result = await api(`/api/v1/schools/disable`, {
    method: "POST",
    body: JSON.stringify({ id: schoolId }),
  });

  if (result?.success && result.data) {
    return result.data;
  }

  throw new Error("Failed to disable school");
};

const createSchool = async (data: ICreateSchool): Promise<School> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("nickname", data.nickname);
  formData.append("type", data.type);
  formData.append("baseline", data.baseline);
  formData.append("motto", data.motto);
  // Send campuses as comma-separated string instead of JSON.stringify
  formData.append("campuses", data.campuses.join(","));

  if (data.logo) {
    formData.append("logo", data.logo);
  }

  const response = await axiosFormData.post(ENDPOINTS.schools, formData);
  return checkResponse(response, 201);
};

const updateSchool = async (data: IUpdateSchool): Promise<School> => {
  // Update school uses JSON body, not FormData, and doesn't include logo
  const body: Record<string, unknown> = {};
  if (data.name !== undefined) body.name = data.name;
  if (data.nickname !== undefined) body.nickname = data.nickname;
  if (data.type !== undefined) body.type = data.type;
  if (data.baseline !== undefined) body.baseline = data.baseline;
  if (data.motto !== undefined) body.motto = data.motto;
  // Send campuses as array directly in JSON, not stringified
  if (data.campuses !== undefined) body.campuses = data.campuses;

  const response = await axiosInstance.put(
    ENDPOINTS.updateSchool(data.id),
    body,
  );
  return checkResponse(response, 200);
};

const SCHOOLS_QUERY_KEY = "schools";
const SCHOOLS_LOCKIN_QUERY_KEY = "schools_lockin";

export const useSchools = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [SCHOOLS_QUERY_KEY],
    queryFn: () => getSchools(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

// Add this helper to force bypass cache
export const useSchoolsWithRefetch = () => {
  const queryClient = useQueryClient();
  const query = useSchools();

  const forceRefetch = async () => {
    await queryClient.invalidateQueries({ queryKey: [SCHOOLS_QUERY_KEY] });
    return query.refetch();
  };

  return { ...query, forceRefetch };
};

export const useSchool = (schoolId: string) => {
  return useQuery({
    queryKey: [SCHOOLS_QUERY_KEY, schoolId],
    queryFn: () => getSchool(schoolId),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

const getSchoolLockIn = async (schoolId: string) => {
  const result = await api(ENDPOINTS.getSchoolLockIn(schoolId));

  if (result?.success && result.data) {
    return result.data;
  }

  throw new Error("Failed to fetch school lockin");
};

export const useSchoolLockin = (schoolId: string) => {
  return useQuery({
    queryKey: [SCHOOLS_LOCKIN_QUERY_KEY, schoolId],
    queryFn: () => getSchoolLockIn(schoolId),
    enabled: !!schoolId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSchool,
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
    mutationFn: disableSchool,
    onSuccess: (data, schoolId) => {
      queryClient.invalidateQueries({ queryKey: [SCHOOLS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [SCHOOLS_QUERY_KEY, schoolId],
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
    mutationFn: updateSchool,
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
