"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/lib/constants/routes";
import { School, SchoolIcon } from "@/lib/types/school";
import { useDisableSchool, useSchool } from "@/hooks/queries/useSchoolsQuery";
import {
  useSchoolPatients,
  useSchoolProviders,
  useSchoolUrgentCare,
  useInvalidateSchoolProviders,
} from "@/hooks/queries/useSchoolDetailsQuery";

export type CuratorSchoolTabType = "patients" | "icons" | "providers";

import { parseCampuses } from "@/lib/utils/parseCampuses";

function compactTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}h`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export { compactTimeAgo, parseCampuses };

export function useCuratorSchoolDetails() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

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

  const disableSchoolMutation = useDisableSchool();
  const queryClient = useQueryClient();

  // ─── React Query hooks (all fire in parallel) ─────────────────────────
  const schoolQuery = useSchool(schoolId);
  const patientsQuery = useSchoolPatients(schoolId);
  const providersQuery = useSchoolProviders(schoolId);
  const urgentCareQuery = useSchoolUrgentCare(schoolId);
  const invalidateProviders = useInvalidateSchoolProviders();

  // ─── Derived data ─────────────────────────────────────────────────────
  const rawSchool = schoolQuery.data as
    | (School & { campuses?: unknown })
    | undefined;
  const school = useMemo(() => {
    if (!rawSchool) return null;
    const s = { ...rawSchool } as School;
    if (rawSchool.campuses) {
      s.campuses = parseCampuses(rawSchool.campuses as string[]);
    }
    return s;
  }, [rawSchool]);

  const patients = patientsQuery.data?.patients ?? [];
  const lockinStudents = patientsQuery.data?.lockinStudents ?? [];
  const patientComments = patientsQuery.data?.patientComments ?? {};
  const providers = providersQuery.data ?? [];
  const urgentCare = urgentCareQuery.data ?? {
    totalUrgentCarePatients: 0,
    patients: [],
  };
  const isLoading = schoolQuery.isLoading;
  const error = schoolQuery.error ? "Failed to load school details" : null;

  // ─── Computed data ───────────────────────────────────────────────────────
  const patientsWithScore = useMemo(
    () =>
      patients.map((p) => {
        const match = lockinStudents.find(
          (s) =>
            s.studentName.trim().toLowerCase() ===
            p.patientName.trim().toLowerCase(),
        );
        return {
          ...p,
          lockinScore: match?.lockinScore,
          comment: patientComments[p.lockinId] ?? null,
        };
      }),
    [patients, lockinStudents, patientComments],
  );

  const filteredPatients = useMemo(
    () =>
      searchQuery.trim()
        ? patientsWithScore.filter((p) =>
            p.patientName.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : patientsWithScore,
    [patientsWithScore, searchQuery],
  );

  // ─── Handlers ────────────────────────────────────────────────────────────
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

  const campusLabel = school ? parseCampuses(school.campuses)[0] : null;
  const schoolIcons = school
    ? icons.filter((i) => i.schoolId === Number(school.id))
    : [];

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

    // Loading states
    isLoading,
    patientsLoading: patientsQuery.isLoading,
    providersLoading: providersQuery.isLoading,
    urgentLoading: urgentCareQuery.isLoading,
    isActionLoading,
    error,

    // Tab
    activeTab,
    setActiveTab,

    // Search
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    searchInputRef,

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

    // Utilities
    compactTimeAgo,

    // Reloaders (for modal callbacks)
    loadProviders,
  };
}
