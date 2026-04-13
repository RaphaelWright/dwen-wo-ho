"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useAtom, useSetAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  activeSchoolAtom,
  activeStatusAtom,
  searchQueryAtom,
  appliedSearchQueryAtom,
  profileOpenAtom,
  editOpenAtom,
  profileDataAtom,
  editFieldKeyAtom,
  editFieldLabelAtom,
  editValueAtom,
} from "@/atoms/new-provider";
import {
  providerNotificationListAtom,
  isProviderNotificationSheetOpenAtom,
} from "@/atoms/notification";
import { PROVIDER_SEARCH_QUICK_FILTERS } from "@/lib/constants/provider-search";
import {
  useProviderDashboardInit,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUpdatePhoneNumberMutation,
  useProviderUrgentPatients,
} from "@/hooks/queries/use-provider-dashboard";
import {
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useClearNotificationsMutation,
} from "@/hooks/queries/use-notifications-mutations";
import type { PatientCase } from "@/lib/types/api/patient-results";
import type { ProviderAssociatedSchool } from "@/lib/types/api/providers";
import type { FilterOption } from "@/components/shared/search-dropdown";
import { useProviderSearchConfig } from "./use-provider-search-config";
import { useProviderDashboardMobile } from "./use-provider-dashboard-mobile";

function matchesFilter(item: any, filter: FilterOption): boolean {
  if (!filter.filterKey || !filter.filterValue) return true;

  const value = item[filter.filterKey];

  if (value === undefined || value === null) return true;

  const filterValue = filter.filterValue;

  switch (filter.filterType) {
    case "exact":
      return String(value).toLowerCase() === String(filterValue).toLowerCase();
    case "contains":
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    default:
      return true;
  }
}

export type ProviderDashboardState = ReturnType<typeof useProviderDashboard>;

export default function useProviderDashboard() {
  /* ── API data ─────────────────────────────────────── */
  const {
    data: dashboardInit,
    isLoading: isInitLoading,
    isError: isInitError,
    error: initError,
  } = useProviderDashboardInit();
  // Note: useProviderNotifications removed - WebSocket now handles real-time notifications
  const updateProfileMutation = useUpdateProfileMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const updatePhoneNumberMutation = useUpdatePhoneNumberMutation();

  const apiPatients: PatientCase[] = dashboardInit?.patients ?? [];
  const apiSchools: ProviderAssociatedSchool[] = dashboardInit?.schools ?? [];

  /* ── Filter state ─────────────────────────────────── */
  const [activeSchool, setActiveSchool] = useAtom(activeSchoolAtom);
  const [activeStatus, setActiveStatus] = useAtom(activeStatusAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [appliedSearchQuery, setAppliedSearchQuery] = useAtom(
    appliedSearchQueryAtom,
  );
  const [localActiveFilters, setLocalActiveFilters] = useState<FilterOption[]>(
    [],
  );

  const toggleFilter = useCallback((filter: FilterOption) => {
    setLocalActiveFilters((prev) => {
      const exists = prev.some((f) => f.id === filter.id);
      if (exists) {
        return prev.filter((f) => f.id !== filter.id);
      }
      return [...prev, filter];
    });
  }, []);

  const clearFilters = useCallback(() => {
    setLocalActiveFilters([]);
  }, []);

  const removeFilter = useCallback((filter: FilterOption) => {
    setLocalActiveFilters((prev) => prev.filter((f) => f.id !== filter.id));
  }, []);

  /* ── Modal / sheet open state ─────────────────────── */
  const setNotifOpen = useSetAtom(isProviderNotificationSheetOpenAtom);
  const [profileOpen, setProfileOpen] = useAtom(profileOpenAtom);
  const [editOpen, setEditOpen] = useAtom(editOpenAtom);

  /* ── Profile data ─────────────────────────────────── */
  const [profileData, setProfileData] = useAtom(profileDataAtom);

  // Seed profile atom from API on first successful load
  useEffect(() => {
    if (dashboardInit?.profile) {
      setProfileData((prev) => ({ ...prev, ...dashboardInit.profile }));
    }
  }, [dashboardInit?.profile, setProfileData]);

  /* ── Notifications ────────────────────────────────── */
  const [notifications, setNotifications] = useAtom(
    providerNotificationListAtom,
  );
  const queryClient = useQueryClient();

  // Note: Notifications now populated via WebSocket (useNotificationWebSocket)
  // HTTP polling removed - real-time updates through STOMP

  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();
  const deleteMutation = useDeleteNotificationMutation();
  const clearMutation = useClearNotificationsMutation();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev: any[]) => prev.map((n) => ({ ...n, read: true })));
    // Persist to backend
    await markAllReadMutation.mutateAsync();
    // Invalidate cache to ensure consistency
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.providers, "notifications"],
    });
  }, [setNotifications, markAllReadMutation, queryClient]);

  const markOneRead = useCallback(
    async (id: string | number) => {
      // Optimistic update - handle both 'id' (curator) and 'notificationId' (provider) fields
      setNotifications((prev: any[]) =>
        prev.map((n) =>
          n.id === id || n.notificationId === id
            ? { ...n, read: true, unread: false }
            : n,
        ),
      );
      // Persist to backend if it's a string ID
      if (typeof id === "string") {
        await markReadMutation.mutateAsync(id);
      }
      // Invalidate cache
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providers, "notifications"],
      });
    },
    [setNotifications, markReadMutation, queryClient],
  );

  const clearAllNotifications = useCallback(async () => {
    setNotifications([]);
    await clearMutation.mutateAsync();
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.providers, "notifications"],
    });
  }, [setNotifications, clearMutation, queryClient]);

  const deleteNotification = useCallback(
    async (id: string | number) => {
      // Optimistic update - handle both 'id' (curator) and 'notificationId' (provider) fields
      setNotifications((prev: any[]) =>
        prev.filter((n) => n.id !== id && n.notificationId !== id),
      );
      // Persist to backend
      await deleteMutation.mutateAsync(id);
      // Invalidate cache and refetch immediately
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.providers, "notifications"],
      });
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.providers, "notifications"],
      });
    },
    [setNotifications, deleteMutation, queryClient],
  );

  /* ── Edit-field dialog state ──────────────────────── */
  const [editFieldKey, setEditFieldKey] = useAtom(editFieldKeyAtom);
  const [editFieldLabel, setEditFieldLabel] = useAtom(editFieldLabelAtom);
  const [editValue, setEditValue] = useAtom(editValueAtom);

  /** Open the edit dialog for a given profile field */
  const openEdit = useCallback(
    (key: any, label: any, current: any) => {
      setEditFieldKey(key);
      setEditFieldLabel(label);
      setEditValue(current);
      setEditOpen(true);
    },
    [setEditFieldKey, setEditFieldLabel, setEditValue, setEditOpen],
  );

  /** Commit the edited value — persists via API then updates local atom */
  const saveEdit = useCallback(async () => {
    if (editFieldKey === "photo") {
      // Photo is handled separately via file input, not text edit
      setEditOpen(false);
      return;
    }
    if (editFieldKey && editValue.trim()) {
      // Phone number uses separate mutation
      if (editFieldKey === "phone") {
        await updatePhoneNumberMutation.mutateAsync({
          officePhoneNumber: editValue.trim(),
          currentStatus: profileData?.status ?? "",
        });
      } else {
        const allowedKeys = ["title", "name", "specialty", "status"] as const;
        type AllowedKey = (typeof allowedKeys)[number];
        if (allowedKeys.includes(editFieldKey as AllowedKey)) {
          await updateProfileMutation.mutateAsync({
            fieldKey: editFieldKey as AllowedKey,
            value: editValue.trim(),
          });
        }
      }
      setProfileData((prev) => ({
        ...prev,
        [editFieldKey as string]: editValue.trim(),
      }));
    }
    setEditOpen(false);
  }, [
    editFieldKey,
    editValue,
    updateProfileMutation,
    updatePhoneNumberMutation,
    profileData?.status,
    setProfileData,
    setEditOpen,
  ]);

  /* ── School filter helpers ────────────────────────── */
  const handleSelectSchool = (id: any) => {
    setActiveSchool(id);
    // Reset status chip when switching school so counts feel fresh
    setActiveStatus("all");
  };

  const handleClearSchool = () => {
    setActiveSchool("all");
    setActiveStatus("all");
  };

  /* ── Derived filtered list ── */
  const filteredPatients: PatientCase[] = apiPatients.filter((p) => {
    const schoolMatch =
      activeSchool === "all" || String(p.schoolId) === activeSchool;
    const statusMatch = activeStatus === "all" || p.status === activeStatus;
    const q = appliedSearchQuery.toLowerCase();
    const searchMatch =
      !appliedSearchQuery ||
      (p.patientName?.toLowerCase().includes(q) ?? false) ||
      (p.schoolName?.toLowerCase().includes(q) ?? false);
    // Apply localActiveFilters like curator does
    const matchesAllFilters = localActiveFilters.every((filter) =>
      matchesFilter(p, filter),
    );
    return schoolMatch && statusMatch && searchMatch && matchesAllFilters;
  });

  const schoolLabel =
    apiSchools.find((s) => String(s.schoolId) === activeSchool)?.schoolName ??
    "";

  // Compute suggestions with active filters applied
  const topSuggestions: PatientCase[] = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    // Check if score sorting filters are active
    const hasHighScoreFilter = localActiveFilters.some(
      (f) => f.id === "high-score",
    );
    const hasLowScoreFilter = localActiveFilters.some(
      (f) => f.id === "low-score",
    );

    // Helper to check if an item matches all active filters (excluding score sorts)
    const matchesAllFilters = (item: any) => {
      return localActiveFilters.every((filter) => {
        // Skip score sorting filters - they only sort, don't filter
        if (filter.id === "high-score" || filter.id === "low-score")
          return true;
        return matchesFilter(item, filter);
      });
    };

    let filtered = filteredPatients.filter((p) => matchesAllFilters(p));

    if (query) {
      filtered = filtered.filter((p) => {
        const nameMatch = p.patientName?.toLowerCase().includes(query);
        const schoolMatch = p.schoolName?.toLowerCase().includes(query);
        return nameMatch || schoolMatch;
      });
    }

    // Sort by score if High/Low Score filter is active
    if (hasHighScoreFilter) {
      filtered = [...filtered].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    } else if (hasLowScoreFilter) {
      filtered = [...filtered].sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
    }

    return filtered.slice(0, query ? 5 : 4);
  }, [searchQuery, filteredPatients, localActiveFilters]);

  const { theme } = useTheme();

  /* Count per status chip after school + search filter (ignoring status) */
  const countForChip = (chipId: string) =>
    apiPatients.filter((p) => {
      const schoolMatch =
        activeSchool === "all" || String(p.schoolId) === activeSchool;
      const q = appliedSearchQuery.toLowerCase();
      const searchMatch =
        !appliedSearchQuery ||
        (p.patientName?.toLowerCase().includes(q) ?? false) ||
        (p.schoolName?.toLowerCase().includes(q) ?? false);
      const statusMatch = chipId === "all" || p.status === chipId;
      return schoolMatch && searchMatch && statusMatch;
    }).length;

  // Centralized search config
  const searchConfig = useProviderSearchConfig({
    searchQuery,
    setSearchQuery,
    appliedSearchQuery: "",
    setAppliedSearchQuery,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
    filteredPatients,
  });

  const {
    activePanel,
    setActivePanel,
    searchOpen,
    setSearchOpen,
    mobileTabs,
    panelVariants,
    panelTransition,
  } = useProviderDashboardMobile(setProfileOpen);

  const { data: urgentData } = useProviderUrgentPatients();
  return {
    activeSchool,
    setActiveSchool,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    appliedSearchQuery,
    setAppliedSearchQuery,
    setNotifOpen,
    profileOpen,
    setProfileOpen,
    editOpen,
    setEditOpen,
    profileData,
    setProfileData,
    notifications,
    setNotifications,
    unreadCount,
    markAllRead,
    markOneRead,
    clearAllNotifications,
    deleteNotification,
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isClearing: clearMutation.isPending,
    editFieldKey,
    setEditFieldKey,
    editFieldLabel,
    setEditFieldLabel,
    editValue,
    setEditValue,
    openEdit,
    saveEdit,
    handleSelectSchool,
    handleClearSchool,
    schools: apiSchools,
    filteredPatients,
    totalPatientCount: apiPatients.length,
    topSuggestions,
    theme,
    countForChip,
    schoolLabel,
    quickFilters: PROVIDER_SEARCH_QUICK_FILTERS,
    isInitLoading,
    isInitError,
    initError,
    isSaving: updateProfileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isUpdatingPhoneNumber: updatePhoneNumberMutation.isPending,
    updatePhoneNumber: updatePhoneNumberMutation.mutateAsync,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
    searchConfig,
    activePanel,
    setActivePanel,
    searchOpen,
    setSearchOpen,
    mobileTabs,
    panelVariants,
    panelTransition,
    urgentData,
  };
}
