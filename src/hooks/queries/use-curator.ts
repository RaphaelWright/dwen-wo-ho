"use client";

import { useQuery } from "@tanstack/react-query";
import { curatorService } from "@/services/curator";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";

// T3-1: Summary counts
export const useCuratorSummary = () =>
  useQuery({
    queryKey: [QUERY_KEYS.curatorSummary],
    queryFn: curatorService.getSummary,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000, // Background updates every 30s
  });
