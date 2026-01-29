"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import WidthConstraint from "@/components/ui/width-constraint";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import { School } from "@/types/school";
import { ArrowLeft, Search, Users, Pencil, Ban, Lock } from "lucide-react";
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
  patientName?: string;
  lockinScore?: number;
  lockinDate?: string;
  createdAt?: string;
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
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddIconModal, setShowAddIconModal] = useState(false);
  const [editingIcon, setEditingIcon] = useState<IconItem | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
        setPatients(
          list.map((p: { id: number; lockinId: number; patientName: string; createdAt: string; visibilityStatus: string; treatingProviders?: Array<{ id: string; fullName: string }> }) => ({
            id: p.id,
            lockinId: p.lockinId,
            patientName: p.patientName,
            createdAt: p.createdAt,
            visibilityStatus: p.visibilityStatus,
            treatingProviders: p.treatingProviders ?? [],
          }))
        );
      }
      if (resLockIn?.success && (resLockIn.data as { students?: LockInStudent[] })?.students) {
        setLockinStudents((resLockIn.data as { students: LockInStudent[] }).students);
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
        setPatientComments((prev) => ({ ...prev, ...comments } as Record<number, string | null>));
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
    if (schoolId) loadUrgentCare();
  }, [schoolId, loadUrgentCare]);

  useEffect(() => {
    if (!searchExpanded) return;
    searchInputRef.current?.focus();
  }, [searchExpanded]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <WidthConstraint>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4" />
            <p className="text-gray-500">Loading school details...</p>
          </div>
        </div>
      </WidthConstraint>
    );
  }

  if (error || !school) {
    return (
      <WidthConstraint>
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <Button onClick={() => router.push(ROUTES.curator.schools)} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schools
          </Button>
          <p className="text-red-500">{error || "School not found"}</p>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <Button onClick={() => router.push(ROUTES.curator.schools)} variant="outline" className="w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schools
          </Button>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowEditModal(true)}
              variant="outline"
              className="w-fit border-[#955aa4] text-[#955aa4] hover:bg-[#955aa4]/10"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit School
            </Button>
            <Button
              onClick={handleDisableSchool}
              variant="outline"
              disabled={disableSchoolMutation.isPending}
              className="w-fit border-red-500 text-red-500 hover:bg-red-50"
            >
              <Ban className="w-4 h-4 mr-2" />
              {disableSchoolMutation.isPending ? "Disabling..." : "Disable"}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex relative">
          {/* Background logo - low opacity */}
          {school.logo && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]"
              aria-hidden
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={school.logo}
                  alt=""
                  width={400}
                  height={400}
                  className="object-contain w-[400px] h-[400px]"
                />
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col p-6 relative z-10">
            {/* Header: logo, name, campus, motto, search (expandable overlay) */}
            <div ref={searchContainerRef} className="relative flex items-start justify-between gap-4 mb-6">
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {school.logo ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 bg-white">
                    <Image src={school.logo} alt={school.name} width={80} height={80} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MdSchool className="text-4xl text-gray-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 truncate">{school.name}</h1>
                  {campusLabel && (
                    <p className="text-gray-600 text-sm">({campusLabel})</p>
                  )}
                  {school.motto && (
                    <p className="text-gray-500 text-sm mt-0.5 italic">{school.motto}</p>
                  )}
                </div>
              </div>

              {searchExpanded ? (
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="absolute inset-0 w-full py-3 pl-4 pr-10 rounded-xl border-2 border-[#955aa4] bg-white shadow-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/30 z-20 text-gray-900 placeholder-gray-400"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchExpanded(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              )}
            </div>

            {/* Tabs: Patients, Icons, Providers */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab("patients")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === "patients"
                    ? "bg-[#955aa4] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {patients.length} Patients
              </button>
              <button
                onClick={() => setActiveTab("icons")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === "icons"
                    ? "bg-[#955aa4] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {schoolIcons.length} Icons
              </button>
              <button
                onClick={() => setActiveTab("providers")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === "providers"
                    ? "bg-[#955aa4] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {providers.length} Providers
              </button>
            </div>

            {/* Tab content */}
            {activeTab === "patients" && (
              <div className="space-y-3">
                {patientsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#955aa4]" />
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No patients for this school</p>
                  </div>
                ) : (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-[#955aa4]/30 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {patient.lockinScore != null ? patient.lockinScore.toFixed(1) : "–"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                          {patient.patientName}. {compactTimeAgo(patient.createdAt)}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                          {patient.comment ? `"${patient.comment}"` : "—"}
                        </p>
                      </div>
                      <Button
                        onClick={() => setSelectedPatientId(patient.id)}
                        className={`flex-shrink-0 rounded-lg ${
                          (patient.treatingProviders?.length ?? 0) > 0
                            ? "bg-gray-500 text-white hover:bg-gray-600"
                            : patient.visibilityStatus === "SEEN"
                              ? "bg-gray-500 text-white hover:bg-gray-600"
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
                    className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
                  >
                    + ADD Icon
                  </Button>
                </div>
                {schoolIcons.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No icons yet. Add one above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {schoolIcons
                      .sort((a, b) => a.rank - b.rank)
                      .map((icon) => (
                        <button
                          key={icon.id}
                          onClick={() => {
                            setEditingIcon(icon);
                            setShowAddIconModal(true);
                          }}
                          className="rounded-xl overflow-hidden border border-gray-200 hover:border-[#955aa4]/50 transition-colors text-left"
                        >
                          <div className="aspect-[4/3] relative bg-gray-100">
                            {icon.photoPreview && (
                              <Image src={icon.photoPreview} alt={icon.name} fill className="object-cover" />
                            )}
                            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-xs font-bold">
                              #{icon.rank}
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="font-semibold text-gray-900">{icon.name}</p>
                            <div className="flex flex-col items-start gap-0.5 mt-1">
                              {(icon.lockIns || []).slice(0, 2).map((item, i) => (
                                <span key={i} className="text-xs text-gray-600 flex items-center gap-1">
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

          {/* Urgent Care Sidebar */}
          <aside className="w-80 flex-shrink-0 border-l border-gray-200 bg-gray-50/80 p-6 relative z-10">
            <div className="mb-4">
              <JustGoHealth className="mb-2 scale-90 origin-left" />
              <p className="text-red-600 font-bold text-lg">
                Urgent Care. {urgentLoading ? "…" : urgentCare.totalUrgentCarePatients}
              </p>
            </div>
            {urgentLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg" />
                ))}
              </div>
            ) : urgentCare.patients.length === 0 ? (
              <p className="text-gray-500 text-sm">No urgent care patients</p>
            ) : (
              <ul className="space-y-3">
                {urgentCare.patients.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="w-10 h-10 rounded bg-black flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">
                        {p.lockinScore != null ? p.lockinScore.toFixed(1) : "–"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{p.patientName ?? "Patient"}</p>
                      <p className="text-xs text-gray-500">
                        {p.lockinDate || p.createdAt
                          ? timeAgo(p.lockinDate || p.createdAt || "")
                          : "—"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>

      {school && (
        <>
          <SchoolEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            school={school}
            onSchoolUpdated={handleSchoolUpdated}
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
    </WidthConstraint>
  );
}
