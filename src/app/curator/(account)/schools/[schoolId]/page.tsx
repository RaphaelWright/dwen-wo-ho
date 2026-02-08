"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import { School } from "@/types/school";
import { Search, Users, Pencil, Ban, Lock } from "lucide-react";
import { MdSchool } from "react-icons/md";
import { Button } from "@/components/ui/button";
import SchoolEditModal from "@/components/modals/school-edit";
import ProviderDetailsModal from "@/components/modals/provider-details";
import PatientDetailsModal from "@/components/modals/patient-details-curator";
import AddIconModal from "@/components/modals/add-icon";
import { useDisableSchool } from "@/hooks/queries/useSchoolsQuery";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ProvidersTab, SchoolProvider } from "@/components/curator/school-detail-tabs";
import { formatProviderName, getProviderTitle } from "@/lib/utils/formatProviderName";
import { timeAgo } from "@/lib/utils/timeAgo";
import { ProviderDetails } from "@/types/provider";
import JustGoHealth from "@/components/logo-purple";

// Add custom CSS for hiding scrollbar
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
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
  const [patientComments, setPatientComments] = useState<Record<number, string | null>>({});
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
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddIconModal, setShowAddIconModal] = useState(false);
  const [editingIcon, setEditingIcon] = useState<IconItem | null>(null);
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
        if (d.campuses) (d as School).campuses = parseCampuses(d.campuses as string[]);
        setSchool(d);
      } else if (Array.isArray(response) && response.length > 0) {
        const d = response[0] as School & { campuses?: unknown };
        if (d.campuses) (d as School).campuses = parseCampuses(d.campuses as string[]);
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
        
        list.sort((a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        const processedPatients = list.map((p: { id: number; lockinId: number; patientName: string; createdAt: string; visibilityStatus: string; treatingProviders?: Array<{ id: string; fullName: string }> }) => ({
          id: p.id,
          lockinId: p.lockinId,
          patientName: p.patientName,
          createdAt: p.createdAt,
          visibilityStatus: p.visibilityStatus,
          treatingProviders: p.treatingProviders ?? [],
        }));
        
        setPatients(processedPatients);
      }
      if (resLockIn?.success && (resLockIn.data as { students?: LockInStudent[] })?.students) {
        const students = (resLockIn.data as { students: LockInStudent[] }).students;
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
              if (update?.success && (update.data as { comment?: string | null })?.comment != null) {
                comments[p.lockinId] = (update.data as { comment: string }).comment;
              }
            } catch {
              // ignore
            }
          })
        );
        setPatientComments((prev) => {
          const updated = { ...prev, ...comments } as Record<number, string | null>;
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
    if (schoolId) loadUrgentCare();
  }, [schoolId, loadUrgentCare]);

  const patientsWithScore = patients.map((p) => {
    const match = lockinStudents.find(
      (s) => s.studentName.trim().toLowerCase() === p.patientName.trim().toLowerCase()
    );
    return {
      ...p,
      lockinScore: match?.lockinScore,
      comment: patientComments[p.lockinId] ?? null,
    };
  });

  const filteredPatients = searchQuery.trim()
    ? patientsWithScore.filter((p) =>
        p.patientName.toLowerCase().includes(searchQuery.toLowerCase())
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
  const schoolIcons = school ? icons.filter((i) => i.schoolId === Number(school.id)) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4" />
          <p className="text-gray-500">Loading school details...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#faf9f7]">
        <button
          onClick={() => router.push(ROUTES.curator.schools)}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          ← Back to Schools
        </button>
        <p className="text-red-500">{error || "School not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7]">
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Background logo - very low opacity watermark */}
        {school.logo && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]"
            aria-hidden
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={school.logo}
                alt=""
                width={800}
                height={800}
                className="object-contain w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px]"
              />
            </div>
          </div>
        )}

        {/* Main content - centered with margins */}
        <div className="flex-1 min-w-0 flex flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-12 lg:py-8 xl:px-16 relative z-10 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="relative flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-10">
            <div className="flex items-start gap-3 sm:gap-4 lg:gap-8 min-w-0 flex-1 w-full">
              {/* Logo and Info - clickable to edit */}
              <div
                onClick={() => setShowEditModal(true)}
                className="flex items-start gap-3 sm:gap-4 lg:gap-8 min-w-0 flex-1 group cursor-pointer"
              >
                {school.logo ? (
                  <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-xl lg:rounded-2xl overflow-hidden flex-shrink-0 border-2 border-gray-300 bg-white group-hover:border-[#955aa4] transition-all">
                    <Image src={school.logo} alt={school.name} width={160} height={160} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-xl lg:rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0 border-2 border-gray-300 group-hover:border-[#955aa4] transition-all">
                    <MdSchool className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-gray-400" />
                  </div>
                )}
                <div className="min-w-0 pt-0 sm:pt-1 lg:pt-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-0.5 sm:mb-1 group-hover:text-[#955aa4] transition-colors line-clamp-2">
                    {school.name}
                  </h1>
                  {school.nickname && (
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mt-1 sm:mt-2 line-clamp-1">{school.nickname}</p>
                  )}
                  {school.motto && (
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 italic mt-1 sm:mt-2 line-clamp-2">{school.motto}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Search - always open */}
            <div className="w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 flex-shrink-0">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full py-2.5 sm:py-3 lg:py-3.5 pl-4 sm:pl-5 pr-12 sm:pr-14 rounded-full border-2 border-gray-300 bg-white shadow-md focus:outline-none focus:border-gray-400 text-gray-900 placeholder-gray-400 text-sm sm:text-base lg:text-lg"
                />
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab("patients")}
              className={`px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-full text-sm sm:text-base font-semibold transition-all whitespace-nowrap ${
                activeTab === "patients"
                  ? "bg-[#955aa4] text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {patients.length} Patients
            </button>
            <button
              onClick={() => setActiveTab("icons")}
              className={`px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-full text-sm sm:text-base font-semibold transition-all whitespace-nowrap ${
                activeTab === "icons"
                  ? "bg-[#955aa4] text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {schoolIcons.length} Icons
            </button>
            <button
              onClick={() => setActiveTab("providers")}
              className={`px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-full text-sm sm:text-base font-semibold transition-all whitespace-nowrap ${
                activeTab === "providers"
                  ? "bg-[#955aa4] text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {providers.length} Providers
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "patients" && (
            <div className="divide-y divide-black">
              {patientsLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#955aa4]" />
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm sm:text-base">No patients for this school</p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-3 sm:gap-4 lg:gap-6 py-3 sm:py-4 lg:py-5"
                  >
                    {/* Lock-in score */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg sm:rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl">
                        {patient.lockinScore != null ? patient.lockinScore.toFixed(1) : "–"}
                      </span>
                    </div>
                    
                    {/* Patient info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-base sm:text-lg lg:text-xl mb-0.5 sm:mb-1">
                        {patient.patientName}. {compactTimeAgo(patient.createdAt)}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                        {patient.comment ? `"${patient.comment}"` : "—"}
                      </p>
                    </div>
                    
                    {/* Action button */}
                    <Button
                      onClick={() => setSelectedPatientId(patient.id)}
                      className={`flex-shrink-0 rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 font-medium text-sm sm:text-base ${
                        (patient.treatingProviders?.length ?? 0) > 0
                          ? "bg-gray-400 text-white hover:bg-gray-500"
                          : patient.visibilityStatus === "SEEN"
                            ? "bg-gray-400 text-white hover:bg-gray-500"
                            : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      {(patient.treatingProviders?.length ?? 0) > 0
                        ? "Treating"
                        : patient.visibilityStatus === "SEEN"
                          ? "Opened"
                          : "Open >"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "icons" && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    setEditingIcon(null);
                    setShowAddIconModal(true);
                  }}
                  className="bg-black text-white hover:bg-gray-800 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base"
                >
                  + ADD Icon
                </Button>
              </div>
              {schoolIcons.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <p className="text-sm sm:text-base">No icons yet. Add one above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {schoolIcons
                    .sort((a, b) => a.rank - b.rank)
                    .map((icon) => (
                      <button
                        key={icon.id}
                        onClick={() => {
                          setEditingIcon(icon);
                          setShowAddIconModal(true);
                        }}
                        className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-[#955aa4]/50 hover:shadow-md transition-all text-left bg-white"
                      >
                        <div className="aspect-[4/3] relative bg-gray-100">
                          {icon.photoPreview && (
                            <Image src={icon.photoPreview} alt={icon.name} fill className="object-cover" />
                          )}
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">
                            #{icon.rank}
                          </div>
                        </div>
                        <div className="p-3 sm:p-4">
                          <p className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">{icon.name}</p>
                          <div className="flex flex-col items-start gap-1">
                            {(icon.lockIns || []).slice(0, 2).map((item, i) => (
                              <span key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                                <Lock className="w-3 h-3" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "providers" && (
            <ProvidersTab
              providers={providers}
              isLoading={providersLoading}
              onProviderClick={handleProviderClick}
            />
          )}
        </div>

        {/* Urgent Care Sidebar - responsive placement */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-300 bg-[#f5f1e8] p-4 sm:p-5 lg:p-6 relative z-10 order-last lg:order-none">
          {/* Logo with click to go back */}
          <div 
            onClick={() => router.push(ROUTES.curator.schools)}
            className="mb-4 sm:mb-5 lg:mb-6 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <JustGoHealth className="scale-75 sm:scale-85 lg:scale-90 origin-left" />
          </div>
          
          {/* Urgent Care header */}
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <p className="text-red-600 font-bold text-lg sm:text-xl">
              Urgent Care. {urgentLoading ? "…" : urgentCare.totalUrgentCarePatients}
            </p>
          </div>
          
          {/* Urgent Care list */}
          {urgentLoading ? (
            <div className="animate-pulse space-y-2 sm:space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 sm:h-16 bg-gray-200 rounded-lg sm:rounded-xl" />
              ))}
            </div>
          ) : urgentCare.patients.length === 0 ? (
            <p className="text-gray-500 text-xs sm:text-sm">No urgent care patients</p>
          ) : (
            <ul className="divide-y divide-black">
              {urgentCare.patients.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 sm:gap-3 py-2.5 sm:py-3"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg sm:text-xl font-bold">
                      {p.lockedInScore != null ? p.lockedInScore.toFixed(1) : "–"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-red-600 truncate text-sm sm:text-base">{p.patientName ?? "Patient"}</p>
                    <p className="text-xs text-gray-500">
                      {p.urgentCareEnteredAt || p.lockinDate || p.createdAt
                        ? timeAgo(p.urgentCareEnteredAt || p.lockinDate || p.createdAt || "")
                        : "—"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
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

      {selectedPatientId && (
        <PatientDetailsModal
          isOpen={!!selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
          patientId={selectedPatientId}
          schoolId={schoolId}
        />
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
                const p = providers.find((p) => p.email === selectedProviderEmail)!;
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