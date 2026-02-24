"use client";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { useQuery } from "@tanstack/react-query";

const useUserQuery = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const getProfileQuery = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => getProfile(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });

  async function getProfile() {
    const response = await api(ENDPOINTS.profile, { method: "GET" });
    return response.data;
  }

  return {
    getProfileQuery,
  };
};

export default useUserQuery;
