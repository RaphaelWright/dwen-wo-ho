"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { ROUTES } from "@/lib/constants/routes";
import { School, SchoolIcon } from "@/lib/types/school";
import { PatientResultItem, UrgentCarePatient } from "@/lib/types/patient";
import { LockInStudent } from "@/lib/types/lockin";
import { SchoolProvider } from "@/lib/types/provider";
import { useDisableSchool } from "@/hooks/queries/useSchoolsQuery";

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
  const [school, setSchool] = useState<School | null>(null);
  const [patients, setPatients] = useState<PatientResultItem[]>([]);
  const [lockinStudents, setLockinStudents] = useState<LockInStudent[]>([]);
  const [patientComments, setPatientComments] = useState<
    Record<number, string | null>
  >({});
  const [providers, setProviders] = useState<SchoolProvider[]>([]);
  const [icons, setIcons] = useState<SchoolIcon[]>([]);
  const [urgentCare, setUrgentCare] = useState<{
    totalUrgentCarePatients: number;
    patients: UrgentCarePatient[];
  }>({ totalUrgentCarePatients: 0, patients: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [urgentLoading, setUrgentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const loadSchoolDetails = useCallback(async () => {
    if (!schoolId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api(ENDPOINTS.school(schoolId));
      if (response?.success && response.data) {
        const d = response.data as School & { campuses?: unknown };
        if (d.campuses)
          (d as School).campuses = parseCampuses(d.campuses as string[]);
        setSchool(d);
      } else if (Array.isArray(response) && response.length > 0) {
        const d = response[0] as School & { campuses?: unknown };
        if (d.campuses)
          (d as School).campuses = parseCampuses(d.campuses as string[]);
        setSchool(d);
      } else {
        setError("Failed to load school details");
      }
    } catch {
      setError("Failed to load school details");
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  const loadPatients = useCallback(async () => {
    setPatientsLoading(true);
    try {
      const [resResults, resLockIn] = await Promise.all([
        api(ENDPOINTS.getSchoolPatientResults(schoolId)),
        api(ENDPOINTS.getSchoolLockIn(schoolId)).catch(() => null),
      ]);

      if (resResults?.success && resResults.data) {
        const list = Array.isArray(resResults.data) ? resResults.data : [];

        list.sort(
          (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        const processedPatients = list.map(
          (p: {
            id: number;
            lockinId: number;
            patientName: string;
            createdAt: string;
            visibilityStatus: string;
            treatingProviders?: Array<{ id: string; fullName: string }>;
          }) => ({
            id: p.id,
            lockinId: p.lockinId,
            patientName: p.patientName,
            createdAt: p.createdAt,
            visibilityStatus: p.visibilityStatus,
            treatingProviders: p.treatingProviders ?? [],
          }),
        );

        setPatients(processedPatients);
      }
      if (
        resLockIn?.success &&
        (resLockIn.data as { students?: LockInStudent[] })?.students
      ) {
        const students = (resLockIn.data as { students: LockInStudent[] })
          .students;
        setLockinStudents(students);
      }
      if (resResults?.success && resResults.data) {
        const list = Array.isArray(resResults.data) ? resResults.data : [];
        const first = list.slice(0, 15) as Array<{ lockinId: number }>;
        const comments: Record<number, string | null> = {};
        await Promise.all(
          first.map(async (p: { lockinId: number }) => {
            try {
              const update = await api(ENDPOINTS.getLockInUpdate(p.lockinId));
              if (
                update?.success &&
                (update.data as { comment?: string | null })?.comment != null
              ) {
                comments[p.lockinId] = (
                  update.data as { comment: string }
                ).comment;
              }
            } catch {
              // ignore
            }
          }),
        );
        setPatientComments((prev) => {
          const updated = { ...prev, ...comments } as Record<
            number,
            string | null
          >;
          return updated;
        });
      }
    } catch {
      // silent
    } finally {
      setPatientsLoading(false);
    }
  }, [schoolId]);

  const loadUrgentCare = useCallback(async () => {
    setUrgentLoading(true);
    try {
      const response = await api(ENDPOINTS.getUrgentCare(schoolId));

      if (response?.success && response.data) {
        const data = response.data as {
          totalUrgentCarePatients?: number;
          patients?: UrgentCarePatient[];
        };

        setUrgentCare({
          totalUrgentCarePatients: data.totalUrgentCarePatients ?? 0,
          patients: data.patients ?? [],
        });
      }
    } catch {
      setUrgentCare({ totalUrgentCarePatients: 0, patients: [] });
    } finally {
      setUrgentLoading(false);
    }
  }, [schoolId]);

  const loadProviders = useCallback(async () => {
    setProvidersLoading(true);
    try {
      const response = await api(ENDPOINTS.schoolProviders(schoolId));
      if (response?.success && response.data) {
        const data = response.data as { providers?: SchoolProvider[] };
        setProviders(data.providers || []);
      } else {
        const direct = response as { providers?: SchoolProvider[] };
        if (direct?.providers) setProviders(direct.providers);
      }
    } catch {
      // silent
    } finally {
      setProvidersLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    loadSchoolDetails();
  }, [loadSchoolDetails]);

  useEffect(() => {
    if (activeTab === "patients") loadPatients();
    if (activeTab === "providers") loadProviders();
  }, [activeTab, loadPatients, loadProviders]);

  useEffect(() => {
    if (schoolId) {
      loadUrgentCare();
      loadProviders();
    }
  }, [schoolId, loadUrgentCare, loadProviders]);

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

  const handleProviderClick = useCallback((provider: SchoolProvider) => {
    setSelectedProviderEmail(provider.email);
    setShowProviderModal(true);
  }, []);

  const handleSchoolUpdated = useCallback(async () => {
    await loadSchoolDetails();
  }, [loadSchoolDetails]);

  const handleDisableSchool = useCallback(() => setShowDisableModal(true), []);

  const handleDisableConfirm = useCallback(async () => {
    if (!school) return;
    setIsActionLoading(true);
    try {
      await disableSchoolMutation.mutateAsync(String(school.id));
      router.push(ROUTES.curator.schools);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to disable school");
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
    patientsLoading,
    providersLoading,
    urgentLoading,
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
