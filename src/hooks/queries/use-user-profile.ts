import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/shared/auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

const useUserQuery = (options?: {
  refetchInterval?: number | false;
  enabled?: boolean;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.auth, QUERY_KEYS.profile],
    queryFn: authService.getProfile,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });

  return {
    getProfileQuery: { data, isLoading },
  };
};

export default useUserQuery;
