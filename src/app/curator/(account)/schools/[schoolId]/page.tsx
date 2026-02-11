"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import { School } from "@/types/school";
import {
  Search,
  Users,
  Pencil,
  Ban,
  Lock,
  Star,
  Stethoscope,
} from "lucide-react";
import { MdSchool, MdHealthAndSafety } from "react-icons/md";
import { Button } from "@/components/ui/button";
import SchoolEditModal from "@/components/modals/school-edit";
import ProviderDetailsModal from "@/components/modals/provider-details";
import AddIconModal from "@/components/modals/add-icon";
import { useDisableSchool } from "@/hooks/queries/useSchoolsQuery";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  ProvidersTab,
  SchoolProvider,
} from "@/components/curator/school-detail-tabs";
import {
  formatProviderName,
  getProviderTitle,
} from "@/lib/utils/formatProviderName";
import { timeAgo } from "@/lib/utils/timeAgo";
import { ProviderDetails } from "@/types/provider";
import JustGoHealth from "@/components/logo-purple";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Add custom CSS for hiding scrollbar
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;
  document.head.appendChild(style);
}

type TabType = "patients" | "icons" | "providers";

interface PatientResultItem {
  id: number;
  lockinId: number;
  patientName: string;
  createdAt: string;
  visibilityStatus: string;
  treatingProviders: Array<{ id: string; fullName: string }>;
  lockinScore?: number;
  comment?: string | null;
}

interface LockInStudent {
  studentName: string;
  lockinScore: number;
  lockedInInterpretation: string;
  lockedInColor: string;
}

interface UrgentCarePatient {
  lockinId?: number;
  patientResultId?: number;
  patientName?: string;
  patientAge?: number;
  patientSex?: string;
  lockedInScore?: number; // Note: API returns 'lockedInScore' not 'lockinScore'
  lockinDate?: string;
  urgentCareEnteredAt?: string;
  createdAt?: string;
  [key: string]: unknown; // Allow any other fields
}

interface IconItem {
  id: string;
  photo: File | string;
  photoPreview: string;
  name: string;
  slogan: string;
  rank: number;
  schoolId: number | null;
  lockIns: string[];
}

function compactTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}h`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function parseCampuses(campuses: string[] | null | undefined): string[] {
  if (!campuses || campuses.length === 0) return [];
  return campuses.flatMap((c) => {
    if (typeof c === "string" && c.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(c);
        return Array.isArray(parsed) ? parsed : [c];
      } catch {
        return [c];
      }
    }
    return [c];
  });
}

export default function SchoolDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

  const [activeTab, setActiveTab] = useState<TabType>("patients");
  const [school, setSchool] = useState<School | null>(null);
  const [patients, setPatients] = useState<PatientResultItem[]>([]);
  const [lockinStudents, setLockinStudents] = useState<LockInStudent[]>([]);
  const [patientComments, setPatientComments] = useState<
    Record<number, string | null>
  >({});
  const [providers, setProviders] = useState<SchoolProvider[]>([]);
  const [icons, setIcons] = useState<IconItem[]>([]);
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
  const [editingIcon, setEditingIcon] = useState<IconItem | null>(null);
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
    } catch (error) {
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
      loadProviders(); // Load providers on initial page load to get the count
    }
  }, [schoolId, loadUrgentCare, loadProviders]);

  const patientsWithScore = patients.map((p) => {
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
  });

  const filteredPatients = searchQuery.trim()
    ? patientsWithScore.filter((p) =>
        p.patientName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : patientsWithScore;

  const handleProviderClick = (provider: SchoolProvider) => {
    setSelectedProviderEmail(provider.email);
    setShowProviderModal(true);
  };

  const handleSchoolUpdated = async () => {
    await loadSchoolDetails();
  };

  const handleDisableSchool = () => setShowDisableModal(true);
  const handleDisableConfirm = async () => {
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
  };

  const handleIconComplete = (data: {
    photo: File | null;
    name: string;
    slogan: string;
    rank: number;
    lockIns: string[];
  }) => {
    if (editingIcon) {
      const updated: IconItem = {
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
          setIcons(icons.map((i) => (i.id === editingIcon.id ? updated : i)));
          setShowAddIconModal(false);
          setEditingIcon(null);
        };
        reader.readAsDataURL(data.photo);
      } else {
        setIcons(icons.map((i) => (i.id === editingIcon.id ? updated : i)));
        setShowAddIconModal(false);
        setEditingIcon(null);
      }
    } else if (data.photo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newIcon: IconItem = {
          id: Date.now().toString(),
          photo: data.photo!,
          photoPreview: reader.result as string,
          name: data.name,
          slogan: data.slogan,
          rank: data.rank,
          schoolId: school ? Number(school.id) : null,
          lockIns: data.lockIns,
        };
        setIcons([...icons, newIcon]);
        setShowAddIconModal(false);
      };
      reader.readAsDataURL(data.photo);
    }
  };

  const campusLabel = school ? parseCampuses(school.campuses)[0] : null;
  const schoolIcons = school
    ? icons.filter((i) => i.schoolId === Number(school.id))
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#955aa4] mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading school details...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#faf9f7]">
        <button
          onClick={() => router.push(ROUTES.curator.schools)}
          className="mb-3 text-gray-600 hover:text-gray-900 text-sm"
        >
          ← Back to Schools
        </button>
        <p className="text-red-500 text-sm">{error || "School not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <div className="flex-1 flex flex-col lg:flex-row items-start relative">
        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col px-4 py-6 sm:px-6 lg:px-8 xl:px-10 relative z-10 max-w-7xl mx-auto w-full">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <MdSchool className="text-9xl text-[#955aa4]" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Logo */}
              <div
                onClick={() => setShowEditModal(true)}
                className="cursor-pointer relative"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white group-hover:shadow-xl transition-all duration-300">
                  {school.logo ? (
                    <Image
                      src={school.logo}
                      alt={school.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                      <MdSchool className="text-5xl" />
                    </div>
                  )}

                  {/* Edit Overlay */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <Pencil className="text-white w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div
                  onClick={() => setShowEditModal(true)}
                  className="cursor-pointer group/title"
                >
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight group-hover/title:text-[#955aa4] transition-colors">
                    {school.name}
                  </h1>
                  {campusLabel && (
                    <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm font-medium">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase tracking-wider text-gray-600">
                        Campus
                      </span>
                      {campusLabel}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
                  {school.nickname && (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#955aa4]" />
                      <span className="font-medium text-gray-900">
                        {school.nickname}
                      </span>
                    </div>
                  )}
                  {school.motto && (
                    <div className="italic text-gray-500 border-l border-gray-300 pl-4">
                      "{school.motto}"
                    </div>
                  )}
                </div>
              </div>

              {/* Actions/Search */}
              <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                <div className="relative group/search w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/search:text-[#955aa4] transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patients..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-[#955aa4]/20 rounded-xl text-sm transition-all outline-none focus:ring-4 focus:ring-[#955aa4]/10"
                  />
                </div>
                <div className="flex gap-4 mx-auto sm:mx-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisableSchool}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Disable
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                    className="bg-white text-gray-700 border hover:bg-gray-50 shadow-sm"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats/Tabs Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex w-full sm:w-auto p-1 bg-gray-100/80 rounded-xl">
              {(["patients", "icons", "providers"] as const).map((tab) => {
                const tabInfo = {
                  patients: {
                    label: "Patients",
                    icon: Users,
                    count: patients.length,
                  },
                  icons: {
                    label: "Icons",
                    icon: Star,
                    count: schoolIcons.length,
                  },
                  providers: {
                    label: "Providers",
                    icon: Stethoscope,
                    count: providers.length,
                  },
                }[tab];
                const Icon = tabInfo.icon;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#955aa4]/20",
                      activeTab === tab
                        ? "text-[#955aa4]"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-lg shadow-sm"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline capitalize">
                        {tabInfo.label}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold",
                          activeTab === tab
                            ? "bg-[#955aa4]/10 text-[#955aa4]"
                            : "bg-gray-200 text-gray-600",
                        )}
                      >
                        {tabInfo.count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Context Actions based on Tab */}
            <AnimatePresence mode="wait">
              {activeTab === "icons" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Button
                    onClick={() => {
                      setEditingIcon(null);
                      setShowAddIconModal(true);
                    }}
                    className="bg-[#955aa4] hover:bg-[#864e94] text-white shadow-md shadow-[#955aa4]/20 rounded-xl"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Add Icon
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px] p-1">
            {activeTab === "patients" && (
              <div className="flex flex-col gap-3 p-4 sm:p-6">
                {patientsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#955aa4]" />
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-900 font-medium">
                      No patients found
                    </p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search or add a new patient.
                    </p>
                  </div>
                ) : (
                  filteredPatients.map((patient) => {
                    const isTreating =
                      (patient.treatingProviders?.length ?? 0) > 0;
                    const isSeen = patient.visibilityStatus === "SEEN";

                    return (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:shadow-md hover:border-[#955aa4]/30 transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:items-center"
                      >
                        {/* Lock-in score Badge */}
                        <div
                          className={cn(
                            "w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner",
                            patient.lockinScore != null
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-400",
                          )}
                        >
                          <span className="font-bold text-2xl sm:text-3xl">
                            {patient.lockinScore != null
                              ? patient.lockinScore.toFixed(1)
                              : "–"}
                          </span>
                        </div>

                        {/* Patient info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-lg sm:text-xl group-hover:text-[#955aa4] transition-colors">
                              {patient.patientName}
                            </h3>
                            <span className="text-xs font-medium text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
                              {compactTimeAgo(patient.createdAt)} ago
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {patient.comment ? (
                              <span className="italic">
                                "{patient.comment}"
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">
                                No comments
                              </span>
                            )}
                          </p>

                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
                                isTreating
                                  ? "bg-purple-50 text-purple-700 border border-purple-100"
                                  : isSeen
                                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                                    : "bg-green-50 text-green-700 border border-green-100",
                              )}
                            >
                              {isTreating
                                ? "Treating"
                                : isSeen
                                  ? "Opened"
                                  : "New"}
                            </div>
                          </div>
                        </div>

                        {/* Action button */}
                        <Button
                          onClick={() =>
                            router.push(
                              `/curator/schools/${schoolId}/patients/${patient.id}`,
                            )
                          }
                          className={cn(
                            "sm:self-center shrink-0 rounded-lg px-6 w-full sm:w-auto",
                            isTreating || isSeen
                              ? "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                              : "bg-black text-white hover:bg-gray-800",
                          )}
                        >
                          {isTreating || isSeen ? "View Details" : "Open Case"}
                        </Button>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === "icons" && (
              <div className="p-4 sm:p-6">
                {schoolIcons.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-900 font-medium mb-1">
                      No icons added yet
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Add icons to highlight school features.
                    </p>
                    <Button
                      onClick={() => {
                        setEditingIcon(null);
                        setShowAddIconModal(true);
                      }}
                      className="bg-black text-white hover:bg-gray-800 rounded-lg px-6"
                    >
                      + Add First Icon
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {schoolIcons
                      .sort((a, b) => a.rank - b.rank)
                      .map((icon) => (
                        <motion.button
                          layout
                          key={icon.id}
                          onClick={() => {
                            setEditingIcon(icon);
                            setShowAddIconModal(true);
                          }}
                          className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left transition-all hover:border-[#955aa4]/50 hover:shadow-lg"
                        >
                          <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                            {icon.photoPreview ? (
                              <Image
                                src={icon.photoPreview}
                                alt={icon.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Users className="w-12 h-12" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs font-bold shadow-sm text-gray-900">
                              #{icon.rank}
                            </div>

                            {/* Hover Edit Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Pencil className="text-white w-6 h-6" />
                            </div>
                          </div>

                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-[#955aa4] transition-colors">
                              {icon.name}
                            </h3>

                            <div className="mt-auto flex flex-wrap gap-1.5">
                              {(icon.lockIns || [])
                                .slice(0, 3)
                                .map((item, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 rounded bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 border border-gray-100"
                                  >
                                    <Lock className="w-2.5 h-2.5" />
                                    <span className="truncate max-w-[80px]">
                                      {item}
                                    </span>
                                  </span>
                                ))}
                              {(icon.lockIns?.length || 0) > 3 && (
                                <span className="text-[10px] text-gray-400 self-center">
                                  +{icon.lockIns.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "providers" && (
              <div className="p-4 sm:p-6">
                <ProvidersTab
                  providers={providers}
                  isLoading={providersLoading}
                  onProviderClick={handleProviderClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Urgent Care Sidebar - responsive placement */}
        <aside className="w-11/12 lg:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white p-6 relative z-10 order-last lg:order-none flex flex-col lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden  mx-auto rounded-2xl sm:mx-0 sm:rounded-none mb-4 sm:mb-0 border sm:border-0">
          {/* Logo with click to go back and Title */}
          <div className="mb-8">
            <div
              onClick={() => router.push(ROUTES.curator.schools)}
              className="mb-6 cursor-pointer hover:opacity-70 transition-opacity inline-block"
            >
              <JustGoHealth className="scale-75 origin-left" />
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Urgent Care</h2>
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-bold",
                  urgentCare.totalUrgentCarePatients > 0
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                {urgentLoading ? "..." : urgentCare.totalUrgentCarePatients}{" "}
                Active
              </span>
            </div>
          </div>

          {/* Urgent Care list */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {urgentLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-50 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : urgentCare.patients.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <MdHealthAndSafety className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  No urgent care patients
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentCare.patients.map((p, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-all duration-200 bg-white shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-900 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:bg-red-600 transition-colors">
                      <span className="font-bold text-lg">
                        {p.lockedInScore != null
                          ? p.lockedInScore.toFixed(1)
                          : "-"}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 truncate text-base group-hover:text-red-700 transition-colors">
                        {p.patientName ?? "Patient"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <p className="text-xs text-gray-500">
                          {p.urgentCareEnteredAt || p.lockinDate || p.createdAt
                            ? compactTimeAgo(
                                (p.urgentCareEnteredAt ||
                                  p.lockinDate ||
                                  p.createdAt ||
                                  "") as string,
                              )
                            : "Recently"}{" "}
                          ago
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {school && (
        <>
          <SchoolEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            school={school}
            onSchoolUpdated={handleSchoolUpdated}
            onDisableSchool={handleDisableSchool}
          />
          <ConfirmationModal
            isOpen={showDisableModal}
            onClose={() => setShowDisableModal(false)}
            onConfirm={handleDisableConfirm}
            title="Disable School"
            message={`Are you sure you want to disable ${school.name}? This cannot be undone.`}
            confirmText="Yes, Disable"
            variant="danger"
            isLoading={isActionLoading}
          />
        </>
      )}

      <ProviderDetailsModal
        isOpen={showProviderModal}
        onClose={() => {
          setShowProviderModal(false);
          loadProviders();
        }}
        providerEmail={selectedProviderEmail}
        provider={
          providers.find((p) => p.email === selectedProviderEmail)
            ? (() => {
                const p = providers.find(
                  (p) => p.email === selectedProviderEmail,
                )!;
                return {
                  id: p.id,
                  email: p.email,
                  fullName: formatProviderName(p.providerName, p.providerTitle),
                  providerTitle:
                    getProviderTitle(p.providerName, p.providerTitle) ||
                    undefined,
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
              })()
            : undefined
        }
      />

      <AddIconModal
        isOpen={showAddIconModal}
        onClose={() => {
          setShowAddIconModal(false);
          setEditingIcon(null);
        }}
        onComplete={handleIconComplete}
        editData={
          editingIcon
            ? {
                photoPreview: editingIcon.photoPreview,
                name: editingIcon.name,
                slogan: editingIcon.slogan,
                rank: editingIcon.rank,
                lockIns: editingIcon.lockIns || [],
              }
            : null
        }
        selectedSchool={school}
      />
    </div>
  );
}
