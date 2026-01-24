"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import WidthConstraint from "@/components/ui/width-constraint";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import { School } from "@/types/school";
import { ArrowLeft, Users, Handshake, TrendingUp, Pencil, Ban } from "lucide-react";
import { MdSchool } from "react-icons/md";
import { Button } from "@/components/ui/button";
import SchoolEditModal from "@/components/modals/school-edit";
import ProviderDetailsModal from "@/components/modals/provider-details";
import PatientDetailsModal from "@/components/modals/patient-details-curator";
import { useDisableSchool } from "@/hooks/queries/useSchoolsQuery";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  OverviewTab,
  ProvidersTab,
  PartnersTab,
  ReachTab,
  SchoolProvider,
  Partner,
  SchoolReachResponse,
} from "@/components/curator/school-detail-tabs";
import { ProviderDetails } from "@/types/provider";
import { formatProviderName, getProviderTitle } from "@/lib/utils/formatProviderName";
import { toast } from "sonner";
import { FiPlus, FiMinus, FiSearch, FiUsers } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";

type TabType = "overview" | "providers" | "partners" | "reach" | "patients";

interface SchoolProvidersResponse {
  id: number;
  name: string;
  logo: string;
  totalProviders: number;
  providers: SchoolProvider[];
}

interface SchoolPartnersResponse {
  id: number;
  name: string;
  logo: string;
  totalPartners: number;
  partners: Partner[];
}

export default function SchoolDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [school, setSchool] = useState<School | null>(null);
  const [providers, setProviders] = useState<SchoolProvider[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [reach, setReach] = useState<SchoolReachResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [reachLoading, setReachLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderEmail, setSelectedProviderEmail] = useState("");
  const [allPartners, setAllPartners] = useState<Partner[]>([]);
  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const [partnerToAdd, setPartnerToAdd] = useState<Partner | null>(null);
  const [partnerToRemove, setPartnerToRemove] = useState<Partner | null>(null);
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [isRemovingPartner, setIsRemovingPartner] = useState(false);

  const disableSchoolMutation = useDisableSchool();
  const queryClient = useQueryClient();

  useEffect(() => {
    const parseCampuses = (campuses: string[] | null | undefined): string[] => {
      if (!campuses || campuses.length === 0) {
        return [];
      }

      return campuses.flatMap((campus) => {
        // Handle stringified arrays like '["Cape Coast"]'
        if (typeof campus === "string" && campus.trim().startsWith("[")) {
          try {
            const parsed = JSON.parse(campus);
            return Array.isArray(parsed) ? parsed : [campus];
          } catch {
            return [campus];
          }
        }
        return [campus];
      });
    };

    const loadSchoolDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api(ENDPOINTS.school(schoolId));
        if (response?.success && response.data) {
          const schoolData = response.data;
          // Parse campuses if they exist
          if (schoolData.campuses) {
            schoolData.campuses = parseCampuses(schoolData.campuses);
          }
          setSchool(schoolData);
        } else if (Array.isArray(response) && response.length > 0) {
          const schoolData = response[0];
          if (schoolData.campuses) {
            schoolData.campuses = parseCampuses(schoolData.campuses);
          }
          setSchool(schoolData);
        } else {
          setError("Failed to load school details");
        }
      } catch {
        setError("Failed to load school details");
      } finally {
        setIsLoading(false);
      }
    };

    if (schoolId) {
      loadSchoolDetails();
    }
  }, [schoolId]);

  const loadPatients = async () => {
    setPatientsLoading(true);
    try {
      const response = await api(ENDPOINTS.getSchoolPatientResults(schoolId));
      if (response?.success && response.data) {
        const patientsList = Array.isArray(response.data) ? response.data : [];
        // Sort by newest first
        patientsList.sort((a: { createdAt: string }, b: { createdAt: string }) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPatients(patientsList);
      }
    } catch (error) {
      // Error loading patients
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "providers" && providers.length === 0 && !providersLoading) {
      loadProviders();
    }
    if (activeTab === "partners") {
      if (partners.length === 0 && !partnersLoading) {
        loadPartners();
      }
      if (allPartners.length === 0) {
        loadAllPartners();
      }
    }
    if (activeTab === "reach" && !reach && !reachLoading) {
      loadReach();
    }
    if (activeTab === "patients" && patients.length === 0 && !patientsLoading) {
      loadPatients();
    }
  }, [activeTab, schoolId]);

  const loadAllPartners = async () => {
    try {
      const response = await api(ENDPOINTS.partners);
      if (response?.success && response.data) {
        const partnersList = Array.isArray(response.data) ? response.data : [];
        setAllPartners(partnersList);
      }
    } catch (error) {
      // Note: Background data loading error
    }
  };

  const loadProviders = async () => {
    setProvidersLoading(true);
    try {
      const response = await api(ENDPOINTS.schoolProviders(schoolId));
      if (response?.success && response.data) {
        const data = response.data as unknown as SchoolProvidersResponse;
        setProviders(data.providers || []);
      } else {
        const directResponse = response as unknown as SchoolProvidersResponse;
        if (directResponse?.providers) {
          setProviders(directResponse.providers || []);
        }
      }
    } catch {
    } finally {
      setProvidersLoading(false);
    }
  };

  const loadPartners = async () => {
    setPartnersLoading(true);
    try {
      const response = await api(ENDPOINTS.schoolPartners(schoolId));
      if (response?.success && response.data) {
        const data = response.data as unknown as SchoolPartnersResponse;
        setPartners(data.partners || []);
      } else {
        const directResponse = response as unknown as SchoolPartnersResponse;
        if (directResponse?.partners) {
          setPartners(directResponse.partners || []);
        }
      }
    } catch {
    } finally {
      setPartnersLoading(false);
    }
  };

  const loadReach = async () => {
    setReachLoading(true);
    try {
      const response = await api(ENDPOINTS.schoolReach(schoolId));
      if (response?.success && response.data) {
        setReach(response.data as unknown as SchoolReachResponse);
      } else {
        const directResponse = response as unknown as SchoolReachResponse;
        if (directResponse?.schoolName) {
          setReach(directResponse);
        }
      }
    } catch {
    } finally {
      setReachLoading(false);
    }
  };

  const handleProviderClick = (provider: SchoolProvider) => {
    setSelectedProviderEmail(provider.email);
    setShowProviderModal(true);
  };

  const handleAddPartner = async (partner: Partner) => {
    setIsAddingPartner(true);
    try {
      const response = await api(ENDPOINTS.addPartnerToSchool(schoolId, partner.id), {
        method: "POST",
      });
      
      if (response?.success) {
        toast.success(`Partner "${partner.name}" added successfully`);
        await queryClient.invalidateQueries({ queryKey: ["schools", schoolId] });
        await loadPartners();
        setPartnerToAdd(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to add partner");
    } finally {
      setIsAddingPartner(false);
    }
  };

  const handleRemovePartner = async (partner: Partner) => {
    setIsRemovingPartner(true);
    try {
      const response = await api(ENDPOINTS.removePartnerFromSchool(schoolId, partner.id), {
        method: "POST",
      });
      
      if (response?.success) {
        toast.success(`Partner "${partner.name}" removed successfully`);
        await queryClient.invalidateQueries({ queryKey: ["schools", schoolId] });
        await loadPartners();
        setPartnerToRemove(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to remove partner");
    } finally {
      setIsRemovingPartner(false);
    }
  };

  const availablePartners = allPartners.filter(
    (p) => !partners.some((sp) => String(sp.id) === String(p.id))
  );

  const filteredAvailablePartners = availablePartners.filter((partner) =>
    partner.name.toLowerCase().includes(partnerSearchQuery.toLowerCase()) ||
    partner.nickname?.toLowerCase().includes(partnerSearchQuery.toLowerCase()) ||
    partner.slogan?.toLowerCase().includes(partnerSearchQuery.toLowerCase())
  );

  const handleSchoolUpdated = async () => {
    const response = await api(ENDPOINTS.school(schoolId));
    if (response?.success && response.data) {
      setSchool(response.data);
    }
  };

  const handleDisableSchool = () => {
    setShowDisableModal(true);
  };

  const handleDisableConfirm = async () => {
    if (!school) return;
    setIsActionLoading(true);
    try {
      await disableSchoolMutation.mutateAsync(String(school.id));
      router.push(ROUTES.curator.schools);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to disable school");
    } finally {
      setIsActionLoading(false);
      setShowDisableModal(false);
    }
  };

  const [patients, setPatients] = useState<Array<{
    id: number;
    patientName: string;
    patientAge: number;
    patientSex: string;
    createdAt: string;
    visibilityStatus: string;
    starProvider: {
      id: string;
      fullName: string;
      email: string;
      professionalTitle: string;
      specialty: string;
    } | null;
    referredProvider: {
      id: string;
      fullName: string;
      email: string;
    } | null;
  }>>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: MdSchool },
    { id: "providers" as TabType, label: "Providers", icon: Users, count: school?.totalProviders ?? providers.length },
    { id: "partners" as TabType, label: "Partners", icon: Handshake, count: school?.totalPartners ?? partners.length },
    { id: "reach" as TabType, label: "Reach", icon: TrendingUp, count: reach?.reach },
    { id: "patients" as TabType, label: "Patients", icon: Users, count: patients.length },
  ];

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
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Button
            onClick={() => router.push(ROUTES.curator.schools)}
            variant="outline"
            className="mb-4"
          >
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
      <div className="flex flex-col gap-8 p-8">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push(ROUTES.curator.schools)}
            variant="outline"
            className="w-fit"
          >
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#955aa4] to-[#7a4a88] p-8">
            <div className="flex items-start gap-6">
              {school.logo ? (
                <div className="w-24 h-24 rounded-2xl bg-white p-4 flex items-center justify-center shadow-lg">
                  <Image
                    src={school.logo}
                    alt={school.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white/20 p-4 flex items-center justify-center">
                  <MdSchool className="text-white text-5xl" />
                </div>
              )}

              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold mb-2">{school.name}</h1>
                {school.nickname && (
                  <p className="text-xl text-white/90 mb-4">&quot;{school.nickname}&quot;</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="px-3 py-1 rounded-full bg-white/20 font-medium">
                    {school.type}
                  </span>
                  {school.totalProviders !== undefined && (
                    <span className="px-3 py-1 rounded-full bg-white/20 font-medium">
                      {school.totalProviders} Providers
                    </span>
                  )}
                  {school.totalPartners !== undefined && (
                    <span className="px-3 py-1 rounded-full bg-white/20 font-medium">
                      {school.totalPartners} Partners
              </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[#955aa4] text-[#955aa4]"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {tab.count !== undefined && tab.count !== null && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === "overview" && <OverviewTab school={school} />}
            {activeTab === "providers" && (
              <ProvidersTab
                providers={providers}
                isLoading={providersLoading}
                onProviderClick={handleProviderClick}
              />
            )}
            {activeTab === "partners" && (
              <div className="space-y-6">
                {/* Associated Partners */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Associated Partners</h4>
                  {partnersLoading ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-2"></div>
                      <p>Loading partners...</p>
                    </div>
                  ) : partners.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FiUsers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No partners associated yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {partners.map((partner) => (
                        <div key={partner.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors">
                          <div className="flex items-center gap-3">
                            {partner.logo ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                <Image
                                  src={partner.logo}
                                  alt={partner.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FiUsers className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{partner.name}</p>
                              {partner.nickname && (
                                <p className="text-sm text-gray-600">@{partner.nickname}</p>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => setPartnerToRemove(partner)} 
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-red-400 text-red-500 hover:bg-red-50 transition-colors" 
                            aria-label="Remove partner"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Partners */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Available Partners</h4>
                  {partnersLoading ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>Loading...</p>
                    </div>
                  ) : (
                    <>
                      {/* Search Bar */}
                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search partners..."
                          value={partnerSearchQuery}
                          onChange={(e) => setPartnerSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
                        />
                      </div>

                      {filteredAvailablePartners.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          {partnerSearchQuery ? "No partners found matching your search." : "All partners are already associated."}
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {filteredAvailablePartners.map((partner) => (
                            <div key={partner.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors">
                              <div className="flex items-center gap-3">
                                {partner.logo ? (
                                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    <Image
                                      src={partner.logo}
                                      alt={partner.name}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FiUsers className="w-6 h-6 text-white" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-gray-900">{partner.name}</p>
                                  {partner.nickname && (
                                    <p className="text-sm text-gray-600">@{partner.nickname}</p>
                                  )}
                                </div>
                              </div>
                              <button 
                                onClick={() => setPartnerToAdd(partner)} 
                                className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-green-400 text-green-500 hover:bg-green-50 transition-colors" 
                                aria-label="Add partner"
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            {activeTab === "reach" && <ReachTab reach={reach} isLoading={reachLoading} />}
            {activeTab === "patients" && (
              <div className="space-y-6">
                {patientsLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-2"></div>
                    <p>Loading patients...</p>
                  </div>
                ) : patients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No patients found for this school</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {patients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => setSelectedPatientId(patient.id)}
                        className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#955aa4] to-[#7a4a88] flex items-center justify-center text-white font-bold text-lg">
                            {patient.patientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{patient.patientName}</p>
                            <p className="text-sm text-gray-600">
                              {patient.patientAge} years old • {patient.patientSex}
                            </p>
                            {patient.starProvider && (
                              <p className="text-xs text-[#955aa4] mt-1">
                                Assigned to: {patient.starProvider.fullName}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {patient.visibilityStatus === "NEW" && (
                            <span className="px-2 py-1 rounded-full bg-[#955aa4]/10 text-[#955aa4] text-xs font-semibold">
                              New
                            </span>
                          )}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Details Modal */}
      {selectedPatientId && (
        <PatientDetailsModal
          isOpen={!!selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
          patientId={selectedPatientId}
          schoolId={schoolId}
        />
      )}

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
            title="Disable School Confirmation"
            message={`Are you sure you want to disable ${school.name}? This action cannot be undone.`}
            confirmText="Yes, Disable"
            variant="danger"
            isLoading={isActionLoading}
          />
          
          {/* Add Partner Confirmation Modal */}
          <ConfirmationModal
            isOpen={!!partnerToAdd}
            onClose={() => setPartnerToAdd(null)}
            onConfirm={() => partnerToAdd && handleAddPartner(partnerToAdd)}
            title="Add Partner"
            message={`Are you sure you want to add "${partnerToAdd?.name}" to this school?`}
            confirmText="Yes, Add"
            variant="success"
            isLoading={isAddingPartner}
          />
        </>
      )}

      {/* Provider Details Modal */}
      <ProviderDetailsModal
        isOpen={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        providerEmail={selectedProviderEmail}
        provider={
          providers.find((p) => p.email === selectedProviderEmail)
            ? (() => {
                const foundProvider = providers.find(
                  (p) => p.email === selectedProviderEmail
                )!;
                return {
                  id: foundProvider.id,
                  email: foundProvider.email,
                  fullName: formatProviderName(foundProvider.providerName, foundProvider.providerTitle),
                  providerTitle: getProviderTitle(foundProvider.providerName, foundProvider.providerTitle) || undefined,
                  professionalTitle: foundProvider.specialty || undefined,
                  profileImage: foundProvider.profilePhotoURL || undefined,
                  createdAt: "",
                  updatedAt: "",
                  applicationStatus: foundProvider.applicationStatus as "PENDING" | "APPROVED" | "REJECTED",
                  applicationDate: "",
                  bio: undefined,
                  officePhoneNumber: foundProvider.officePhoneNumber || undefined,
                } as ProviderDetails;
              })()
            : undefined
        }
      />
        </WidthConstraint>
  );
}
