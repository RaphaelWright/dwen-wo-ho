import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth";

const useUserQuery = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const getProfileQuery = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: authService.getProfile,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });

  return {
    getProfileQuery,
  };
};

export default useUserQuery;
