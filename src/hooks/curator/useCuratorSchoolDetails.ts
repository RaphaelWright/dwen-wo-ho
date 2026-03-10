"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/lib/constants/routes";
import { School, SchoolIcon } from "@/lib/types/school";
import { ProviderDetails } from "@/lib/types/provider";
import { SchoolPatientRecord } from "@/lib/types/components/curator/school-details";
import { SCHOOL_TABS_CONFIG } from "@/lib/constants/components/curator/school-details";
import { useDisableSchool, useSchool } from "@/hooks/queries/useSchools";
import {
  useSchoolPatients,
  useSchoolProviders,
  useSchoolUrgentCare,
  useInvalidateSchoolProviders,
} from "@/hooks/queries/useSchoolDetails";
import { parseCampuses } from "@/lib/utils/parseCampuses";
import { compactTimeAgo } from "@/lib/utils/compactTimeAgo";
import { formatProviderName, getProviderTitle } from "@/lib/utils/formatProviderName";
import { useCuratorSchoolSearch } from "./useCuratorSchoolSearch";

export type CuratorSchoolTabType = "patients" | "icons" | "providers";

export function useCuratorSchoolDetails() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

  // ─── UI state ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<CuratorSchoolTabType>("patients");
  const [icons, setIcons] = useState<SchoolIcon[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderEmail, setSelectedProviderEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddIconModal, setShowAddIconModal] = useState(false);
  const [editingIcon, setEditingIcon] = useState<SchoolIcon | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ─── Mutations ───────────────────────────────────────────────────────────
  const disableSchoolMutation = useDisableSchool();
  const queryClient = useQueryClient();

  // ─── Queries (all fire in parallel) ─────────────────────────────────────
  const schoolQuery = useSchool(schoolId);
  const patientsQuery = useSchoolPatients(schoolId);
  const providersQuery = useSchoolProviders(schoolId);
  const urgentCareQuery = useSchoolUrgentCare(schoolId);
  const invalidateProviders = useInvalidateSchoolProviders();

  // ─── Derived data ─────────────────────────────────────────────────────────
  const rawSchool = schoolQuery.data as (School & { campuses?: unknown }) | undefined;

  const school = useMemo(() => {
    if (!rawSchool) return null;
    const s = { ...rawSchool } as School;
    if (rawSchool.campuses) {
      s.campuses = parseCampuses(rawSchool.campuses as string[]);
    }
    return s;
  }, [rawSchool]);

  const patients = (patientsQuery.data as SchoolPatientRecord[]) ?? [];
  const providers = providersQuery.data ?? [];
  const urgentCare = urgentCareQuery.data ?? {
    totalUrgentCarePatients: 0,
    patients: [],
  };

  const isLoading = schoolQuery.isLoading;
  // Preserve the actual error message rather than discarding it
  const error = schoolQuery.error
    ? (schoolQuery.error as Error).message ?? "Failed to load school details"
    : null;

  // ─── Filtered patients ────────────────────────────────────────────────────
  // No intermediate clone — filter directly from the query data
  const filteredPatients = useMemo(
    () =>
      searchQuery.trim()
        ? patients.filter((p) =>
            p.patientName.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : patients,
    [patients, searchQuery],
  );

  // ─── Derived UI data ─────────────────────────────────────────────────────
  const campusLabel = school ? parseCampuses(school.campuses)[0] : null;
  const schoolIcons = school
    ? icons.filter((i) => i.schoolId === Number(school.id))
    : [];

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
    const p = providers.find((p) => p.email === selectedProviderEmail);
    if (!p) return undefined;

    return {
      id: p.id,
      email: p.email,
      fullName: formatProviderName(p.providerName, p.providerTitle),
      providerTitle: getProviderTitle(p.providerName, p.providerTitle) || undefined,
      professionalTitle: p.specialty || undefined,
      profileImage: p.profilePhotoURL || undefined,
      createdAt: "",
      updatedAt: "",
      applicationStatus: p.applicationStatus as "PENDING" | "APPROVED" | "REJECTED",
      applicationDate: "",
      bio: undefined,
      officePhoneNumber: p.officePhoneNumber || undefined,
    } as ProviderDetails;
  }, [selectedProviderEmail, providers]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  /** Switch tab and reset search so stale query doesn't linger */
  const handleTabChange = useCallback(
    (tab: CuratorSchoolTabType) => {
      setActiveTab(tab);
      setSearchQuery("");
    },
    [],
  );

  const handleProviderClick = useCallback((provider: { email: string }) => {
    setSelectedProviderEmail(provider.email);
    setShowProviderModal(true);
  }, []);

  const handleSchoolUpdated = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["schools", schoolId] });
  }, [queryClient, schoolId]);

  const handleDisableSchool = useCallback(() => setShowDisableModal(true), []);

  const handleDisableConfirm = useCallback(async () => {
    if (!school) return;
    setIsActionLoading(true);
    try {
      await disableSchoolMutation.mutateAsync(String(school.id));
      router.push(ROUTES.curator.schools);
    } catch (err: unknown) {
      console.error((err as Error).message || "Failed to disable school");
    } finally {
      setIsActionLoading(false);
      setShowDisableModal(false);
    }
  }, [school, disableSchoolMutation, router]);

  /**
   * Icon add/edit complete handler.
   * NOTE: FileReader (photo processing) intentionally runs here so the component
   * stays presentation-only. The icon data is stored locally until a persist API
   * is wired up.
   */
  const handleIconComplete = useCallback(
    (data: {
      photo: File | null;
      name: string;
      slogan: string;
      rank: number;
      lockIns: string[];
    }) => {
      if (editingIcon) {
        const updated: SchoolIcon = {
          ...editingIcon,
          name: data.name,
          slogan: data.slogan,
          rank: data.rank,
          lockIns: data.lockIns,
        };
        if (data.photo) {
          const reader = new FileReader();
          reader.onloadend = () => {
            updated.photoPreview = reader.result as string;
            setIcons((prev) =>
              prev.map((i) => (i.id === editingIcon.id ? updated : i)),
            );
            setShowAddIconModal(false);
            setEditingIcon(null);
          };
          reader.readAsDataURL(data.photo);
        } else {
          setIcons((prev) =>
            prev.map((i) => (i.id === editingIcon.id ? updated : i)),
          );
          setShowAddIconModal(false);
          setEditingIcon(null);
        }
      } else if (data.photo) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newIcon: SchoolIcon = {
            id: Date.now().toString(),
            photo: data.photo!,
            photoPreview: reader.result as string,
            name: data.name,
            slogan: data.slogan,
            rank: data.rank,
            schoolId: school ? Number(school.id) : null,
            lockIns: data.lockIns,
          };
          setIcons((prev) => [...prev, newIcon]);
          setShowAddIconModal(false);
        };
        reader.readAsDataURL(data.photo);
      }
    },
    [editingIcon, school],
  );

  const loadProviders = useCallback(() => {
    invalidateProviders(schoolId);
  }, [invalidateProviders, schoolId]);

  // ─── Return ───────────────────────────────────────────────────────────────
  return {
    // Route
    router,
    schoolId,

    // Data
    school,
    patients: filteredPatients,
    providers,
    icons: schoolIcons,
    urgentCare,
    campusLabel,
    tabs,
    selectedProvider,

    // Loading / error states
    isLoading,
    patientsLoading: patientsQuery.isLoading,
    providersLoading: providersQuery.isLoading,
    urgentLoading: urgentCareQuery.isLoading,
    isActionLoading,
    error,

    // Tab — only expose handleTabChange, not raw setActiveTab,
    // so callers always go through the search-reset logic
    activeTab,
    handleTabChange,

    // Search
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    searchInputRef,
    suggestions: useCuratorSchoolSearch({
      searchQuery,
      activeTab,
      patients: filteredPatients,
      schoolIcons,
      providers,
    }).suggestions,
    quickFilters: useCuratorSchoolSearch({
      searchQuery,
      activeTab,
      patients: filteredPatients,
      schoolIcons,
      providers,
    }).quickFilters,

    // Modal state
    showEditModal,
    setShowEditModal,
    showDisableModal,
    setShowDisableModal,
    showProviderModal,
    setShowProviderModal,
    selectedProviderEmail,
    showAddIconModal,
    setShowAddIconModal,
    editingIcon,
    setEditingIcon,

    // Handlers
    handleProviderClick,
    handleSchoolUpdated,
    handleDisableSchool,
    handleDisableConfirm,
    handleIconComplete,
    loadProviders,

    // Utilities
    compactTimeAgo,
  };
}
