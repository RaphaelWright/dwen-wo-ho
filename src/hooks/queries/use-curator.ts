"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { curatorService } from "@/services/curator";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import type { SendNotificationRequest } from "@/lib/types/api/curator";

// T3-1: Summary counts
export const useCuratorSummary = () =>
  useQuery({
    queryKey: [QUERY_KEYS.curatorSummary],
    queryFn: curatorService.getSummary,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000, // Background updates every 30s
  });

// T3-2: Provider detail (schools + partners)
export const useCuratorProviderDetail = (
  providerId: string | number,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: [QUERY_KEYS.curator, "provider-detail", String(providerId)],
    queryFn: () => curatorService.getProviderDetail(providerId),
    enabled: (options?.enabled ?? true) && !!providerId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// T3-3: Curator notifications
export const useCuratorNotifications = () =>
  useQuery({
    queryKey: [QUERY_KEYS.curatorNotifications],
    queryFn: curatorService.getNotifications,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const useCuratorUnreadNotifications = () =>
  useQuery({
    queryKey: [QUERY_KEYS.curatorNotifications, "unread"],
    queryFn: curatorService.getUnreadNotifications,
    staleTime: 30 * 1000,
  });

export const useSendCuratorNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendNotificationRequest) => curatorService.sendNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.curatorNotifications] });
      toast.success("Notification sent");
    },
    onError: (error: Error) => toast.error(error.message || "Failed to send notification"),
  });
};

export const useMarkCuratorNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: curatorService.markNotificationsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.curatorNotifications] }),
    onError: (error: Error) => toast.error(error.message || "Failed to mark as read"),
  });
};

export const useMarkAllCuratorNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: curatorService.markAllNotificationsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.curatorNotifications] }),
    onError: (error: Error) => toast.error(error.message || "Failed to mark all as read"),
  });
};

export const useDeleteCuratorNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => curatorService.deleteNotification(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.curatorNotifications] }),
    onError: (error: Error) => toast.error(error.message || "Failed to delete notification"),
  });
};
