"use client";

import { useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProviderDetails } from "@/lib/types/provider";
import { SCHOOL_TABS_CONFIG } from "@/lib/constants/components/curator/school-details";
import { compactTimeAgo } from "@/lib/utils/compactTimeAgo";
import {
  formatProviderName,
  getProviderTitle,
} from "@/lib/utils/formatProviderName";
import { useCuratorSchoolSearch } from "./use-curator-school-search";
import { useSchoolData } from "./school/use-school-data";
import { useSchoolUI, CuratorSchoolTabType } from "./school/use-school-ui";
import { useSchoolActions } from "./school/use-school-actions";
import { useSchoolIcons } from "./school/use-school-icons";
import { useSchoolSubscription } from "@/hooks/use-school-subscription";
import type { FilterOption } from "@/components/shared/search-dropdown";

function matchesFilter(patient: any, filter: FilterOption): boolean {
  if (!filter.filterKey || !filter.filterValue) return true;

  const value = patient[filter.filterKey];

  if (value === undefined || value === null) return true;

  const filterValue = filter.filterValue;

  switch (filter.filterType) {
    case "exact":
      return String(value).toLowerCase() === String(filterValue).toLowerCase();
    case "contains":
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    case "score":
      if (filterValue === "high") {
        return typeof value === "number" && value >= 5;
      }
      return true;
    case "date":
      if (filterValue === "recent") {
        const createdDate = new Date(value);
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return createdDate >= sevenDaysAgo;
      }
      return true;
    default:
      return true;
  }
}

export type { CuratorSchoolTabType };

export function useCuratorSchoolDetails() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

  // Subscribe to school-specific WebSocket topics for real-time updates
  useSchoolSubscription(schoolId);

  // ─── Sub-Hooks ───────────────────────────────────────────────────────────
  const schoolUI = useSchoolUI();
  const schoolData = useSchoolData(schoolId);
  const schoolIconsState = useSchoolIcons();

  const {
    school,
    patients,
    providers,
    invalidateSchool,
    disableSchool,
    invalidateSchoolProviders,
  } = schoolData;
  const { icons, addOrUpdateIcon } = schoolIconsState;
  const {
    searchQuery,
    appliedSearchQuery,
    setAppliedSearchQuery,
    activeTab,
    selectedProviderEmail,
    editingIcon,
    setShowAddIconModal,
    setEditingIcon,
    setShowDisableModal,
    activeFilter,
    setActiveFilter,
  } = schoolUI;

  const schoolActions = useSchoolActions(
    schoolId,
    school,
    router,
    disableSchool,
    invalidateSchool,
    setShowDisableModal,
  );

  // ─── Derived Data ────────────────────────────────────────────────────────

  const filteredPatients = useMemo(() => {
    if (!appliedSearchQuery.trim()) return patients;
    return patients.filter((p) =>
      p.patientName.toLowerCase().includes(appliedSearchQuery.toLowerCase()),
    );
  }, [patients, appliedSearchQuery]);

  const schoolIcons = useMemo(
    () => (school ? icons.filter((i) => i.schoolId === Number(school.id)) : []),
    [school, icons],
  );

  const tabs = useMemo(
    () =>
      SCHOOL_TABS_CONFIG.map((tab) => ({
        ...tab,
        count:
          tab.key === "patients"
            ? patients.length
            : tab.key === "icons"
              ? schoolIcons.length
              : providers.length,
      })),
    [patients.length, schoolIcons.length, providers.length],
  );

  const selectedProvider = useMemo(() => {
    if (!selectedProviderEmail) return undefined;
    const p = providers.find((p: any) => p.email === selectedProviderEmail);
    if (!p) return undefined;

    return {
      id: p.id,
      email: p.email,
      fullName: formatProviderName(p.providerName, p.providerTitle),
      providerTitle:
        getProviderTitle(p.providerName, p.providerTitle) || undefined,
      professionalTitle: p.specialty || undefined,
      profileImage: p.profilePhotoURL || undefined,
      createdAt: "",
      updatedAt: "",
      applicationStatus: p.applicationStatus as
        | "PENDING"
        | "APPROVED"
        | "REJECTED",
      applicationDate: "",
      bio: undefined,
      officePhoneNumber: p.officePhoneNumber || undefined,
    } as ProviderDetails;
  }, [selectedProviderEmail, providers]);

  const searchResult = useCuratorSchoolSearch({
    searchQuery,
    activeTab: activeTab as any,
    patients: patients,
    schoolIcons,
    providers,
  });

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleDisableSchool = useCallback(
    () => setShowDisableModal(true),
    [setShowDisableModal],
  );

  const handleIconComplete = useCallback(
    (data: {
      photo: File | null;
      name: string;
      slogan: string;
      rank: number;
      lockIns: string[];
    }) => {
      addOrUpdateIcon(
        data,
        editingIcon,
        school ? Number(school.id) : null,
        () => {
          setShowAddIconModal(false);
          setEditingIcon(null);
        },
      );
    },
    [addOrUpdateIcon, editingIcon, school, setShowAddIconModal, setEditingIcon],
  );

  const loadProviders = useCallback(() => {
    invalidateSchoolProviders();
  }, [invalidateSchoolProviders]);

  // ─── Return ──────────────────────────────────────────────────────────────
  return {
    router,
    schoolId,
    ...schoolUI,
    ...schoolData,
    ...schoolActions,
    ...searchResult,
    patients: filteredPatients, // Override raw patients with filtered
    icons: schoolIcons, // Override raw icons with filtered
    tabs,
    selectedProvider,
    handleDisableSchool,
    handleIconComplete,
    loadProviders,
    compactTimeAgo,
    localActiveFilters: searchResult.localActiveFilters,
    toggleFilter: searchResult.toggleFilter,
    removeFilter: searchResult.removeFilter,
    clearFilters: searchResult.clearFilters,
  };
}
