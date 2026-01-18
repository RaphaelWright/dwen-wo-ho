"use client";

import { useState, useEffect, useMemo } from "react";
import { FiX, FiUsers, FiPlus, FiMinus, FiSearch } from "react-icons/fi";
import { MdSchool } from "react-icons/md";
import { Handshake } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useSchools } from "@/hooks/queries/useSchoolsQuery";
import { useProvidersQuery } from "@/hooks/queries/useProvidersQuery";
import { School } from "@/types/school";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import ProviderDetailsModal from "./provider-details";
import SchoolEditModal from "./school-edit";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

interface PartnerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId: string | number;
  partner?: {
    id: string | number;
    name: string;
    nickname?: string;
    slogan?: string;
    logo?: string;
  };
}

type TabType = "overview" | "schools" | "providers";

interface AssociatedSchool {
  id: string | number;
  name: string;
  logo?: string;
}

interface AssociatedProvider {
  id: string;
  email: string;
  providerName: string;
  providerTitle?: string | null;
  specialty?: string;
  profilePhotoURL?: string;
}

const PartnerDetailsModal = ({
  isOpen,
  onClose,
  partnerId,
  partner: partnerProp,
}: PartnerDetailsModalProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: allSchools = [] } = useSchools();
  const { providers } = useProvidersQuery();
  
  const [partner, setPartner] = useState(partnerProp);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [associatedSchools, setAssociatedSchools] = useState<AssociatedSchool[]>([]);
  const [availableSchools, setAvailableSchools] = useState<AssociatedSchool[]>([]);
  const [associatedProviders, setAssociatedProviders] = useState<AssociatedProvider[]>([]);
  const [availableProviders, setAvailableProviders] = useState<AssociatedProvider[]>([]);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [providerSearchQuery, setProviderSearchQuery] = useState("");
  const [schoolToAdd, setSchoolToAdd] = useState<AssociatedSchool | null>(null);
  const [schoolToRemove, setSchoolToRemove] = useState<AssociatedSchool | null>(null);
  const [providerToAdd, setProviderToAdd] = useState<AssociatedProvider | null>(null);
  const [providerToRemove, setProviderToRemove] = useState<AssociatedProvider | null>(null);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [isRemovingSchool, setIsRemovingSchool] = useState(false);
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [isRemovingProvider, setIsRemovingProvider] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderEmail, setSelectedProviderEmail] = useState("");
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  useEffect(() => {
    if (isOpen && partnerId) {
      loadPartnerDetails();
    }
  }, [isOpen, partnerId]);

  useEffect(() => {
    // Reload available schools/providers when allSchools or providers change
    if (isOpen && partnerId && (allSchools.length > 0 || (providers?.data && Array.isArray(providers.data) && providers.data.length > 0))) {
      loadPartnerDetails();
    }
  }, [allSchools.length, providers?.data, isOpen, partnerId]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
      setSchoolSearchQuery("");
      setProviderSearchQuery("");
    }
  }, [isOpen]);

  const loadPartnerDetails = async () => {
    setIsLoadingSchools(true);
    setIsLoadingProviders(true);
    try {
      const response = await api(ENDPOINTS.partner(partnerId));
      if (response?.success && response.data) {
        const partnerData = response.data;
        setPartner(partnerData);

        // Extract schools from partner response
        const partnerSchools: AssociatedSchool[] = partnerData.schools && Array.isArray(partnerData.schools)
          ? partnerData.schools.map((s: { id: string | number; name: string; logo?: string }) => ({
              id: s.id,
              name: s.name,
              logo: s.logo,
            }))
          : [];

        setAssociatedSchools(partnerSchools);
        
        // Get available schools from all schools list
        const associatedSchoolIds = new Set(partnerSchools.map((s) => String(s.id)));
        const available = allSchools
          .filter((s) => !associatedSchoolIds.has(String(s.id)))
          .map((s) => ({
            id: s.id,
            name: s.name,
            logo: s.logo || undefined,
          }));
        setAvailableSchools(available);

        // Extract providers from partner response
        const partnerProviders: AssociatedProvider[] = partnerData.providers && Array.isArray(partnerData.providers)
          ? partnerData.providers.map((p: any) => ({
              id: p.id || p.email,
              email: p.email,
              providerName: p.providerName || p.fullName,
              providerTitle: p.providerTitle || p.title,
              specialty: p.specialty,
              profilePhotoURL: p.profilePhotoURL || p.profileImage,
            }))
          : [];

        setAssociatedProviders(partnerProviders);
        
        // Get available providers from all providers list
        const providersList = providers?.data && Array.isArray(providers.data) ? providers.data : [];
        const associatedProviderIds = new Set(partnerProviders.map((p) => p.email));
        const availableProviders = providersList
          .filter((p: any) => !associatedProviderIds.has(p.email))
          .map((p: any) => ({
            id: p.email,
            email: p.email,
            providerName: p.providerName,
            providerTitle: p.providerTitle,
            specialty: p.specialty,
            profilePhotoURL: p.profilePhotoURL,
          }));
        setAvailableProviders(availableProviders);
      }
    } catch (error) {
      console.error("Failed to load partner details:", error);
    } finally {
      setIsLoadingSchools(false);
      setIsLoadingProviders(false);
    }
  };

  const handleAddSchool = async (school: AssociatedSchool) => {
    setIsAddingSchool(true);
    try {
      const response = await api(ENDPOINTS.addSchoolToPartner(partnerId, school.id), {
        method: "POST",
      });
      
      if (response?.success) {
        toast.success(`School "${school.name}" added successfully`);
        await queryClient.invalidateQueries({ queryKey: ["partners", partnerId] });
        await loadPartnerDetails();
        setSchoolToAdd(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to add school");
    } finally {
      setIsAddingSchool(false);
    }
  };

  const handleRemoveSchool = async (school: AssociatedSchool) => {
    setIsRemovingSchool(true);
    try {
      const response = await api(ENDPOINTS.removeSchoolFromPartner(partnerId, school.id), {
        method: "POST",
      });
      
      if (response?.success) {
        toast.success(`School "${school.name}" removed successfully`);
        await queryClient.invalidateQueries({ queryKey: ["partners", partnerId] });
        await loadPartnerDetails();
        setSchoolToRemove(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to remove school");
    } finally {
      setIsRemovingSchool(false);
    }
  };

  const handleAddProvider = async (provider: AssociatedProvider) => {
    setIsAddingProvider(true);
    try {
      const response = await api(ENDPOINTS.addProviderToPartner(partnerId, provider.id), {
        method: "POST",
      });
      
      if (response?.success) {
        toast.success(`Provider "${formatProviderName(provider.providerName, provider.providerTitle)}" added successfully`);
        await queryClient.invalidateQueries({ queryKey: ["partners", partnerId] });
        await loadPartnerDetails();
        setProviderToAdd(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to add provider");
    } finally {
      setIsAddingProvider(false);
    }
  };

  const handleRemoveProvider = async (provider: AssociatedProvider) => {
    setIsRemovingProvider(true);
    try {
      const response = await api(ENDPOINTS.removeProviderFromPartner(partnerId, provider.id), {
        method: "POST",
      });
      
      if (response?.success) {
        toast.success(`Provider "${formatProviderName(provider.providerName, provider.providerTitle)}" removed successfully`);
        await queryClient.invalidateQueries({ queryKey: ["partners", partnerId] });
        await loadPartnerDetails();
        setProviderToRemove(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to remove provider");
    } finally {
      setIsRemovingProvider(false);
    }
  };

  const handleSchoolClick = async (school: AssociatedSchool) => {
    try {
      const response = await api(ENDPOINTS.school(school.id));
      if (response?.success && response.data) {
        setSelectedSchool(response.data);
        setShowSchoolModal(true);
      }
    } catch (error) {
      console.error("Failed to load school details:", error);
      router.push(`${ROUTES.curator.schools}/${school.id}`);
    }
  };

  const handleProviderClick = (provider: AssociatedProvider) => {
    setSelectedProviderEmail(provider.email);
    setShowProviderModal(true);
  };

  const filteredAvailableSchools = useMemo(() => {
    if (!schoolSearchQuery.trim()) return availableSchools;
    const query = schoolSearchQuery.toLowerCase();
    return availableSchools.filter((school) =>
      school.name.toLowerCase().includes(query)
    );
  }, [availableSchools, schoolSearchQuery]);

  const filteredAvailableProviders = useMemo(() => {
    if (!providerSearchQuery.trim()) return availableProviders;
    const query = providerSearchQuery.toLowerCase();
    return availableProviders.filter((provider) =>
      formatProviderName(provider.providerName, provider.providerTitle).toLowerCase().includes(query) ||
      provider.email.toLowerCase().includes(query) ||
      provider.specialty?.toLowerCase().includes(query)
    );
  }, [availableProviders, providerSearchQuery]);

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: Handshake },
    { id: "schools" as TabType, label: "Schools", icon: MdSchool, count: associatedSchools.length },
    { id: "providers" as TabType, label: "Providers", icon: FiUsers, count: associatedProviders.length },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-4">
              {partner?.logo ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={partner.logo} alt={partner.name} width={64} height={64} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{partner?.name || "Partner Details"}</h2>
                {partner?.nickname && <p className="text-sm text-gray-500">@{partner.nickname}</p>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {partner?.slogan && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Slogan</h3>
                    <p className="text-lg text-gray-900 italic">&quot;{partner.slogan}&quot;</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "schools" && (
              <div className="space-y-6">
                {/* Associated Schools */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Associated Schools</h4>
                  {isLoadingSchools ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-2"></div>
                      <p>Loading schools...</p>
                    </div>
                  ) : associatedSchools.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MdSchool className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No schools associated yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {associatedSchools.map((school) => (
                        <button
                          key={school.id}
                          onClick={() => handleSchoolClick(school)}
                          className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            {school.logo ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                <Image src={school.logo} alt={school.name} width={48} height={48} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MdSchool className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{school.name}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSchoolToRemove(school);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-red-400 text-red-500 hover:bg-red-50 transition-colors"
                            aria-label="Remove school"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Schools */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Available Schools</h4>
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search schools..."
                      value={schoolSearchQuery}
                      onChange={(e) => setSchoolSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  {filteredAvailableSchools.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      {schoolSearchQuery ? "No schools found matching your search." : "All schools are already associated."}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {filteredAvailableSchools.map((school) => (
                        <div key={school.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors">
                          <div className="flex items-center gap-3">
                            {school.logo ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                <Image src={school.logo} alt={school.name} width={48} height={48} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MdSchool className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{school.name}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSchoolToAdd(school)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-green-400 text-green-500 hover:bg-green-50 transition-colors"
                            aria-label="Add school"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "providers" && (
              <div className="space-y-6">
                {/* Associated Providers */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Associated Providers</h4>
                  {isLoadingProviders ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#955aa4] mx-auto mb-2"></div>
                      <p>Loading providers...</p>
                    </div>
                  ) : associatedProviders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FiUsers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No providers associated yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {associatedProviders.map((provider) => (
                        <button
                          key={provider.email}
                          onClick={() => handleProviderClick(provider)}
                          className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            {provider.profilePhotoURL ? (
                              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                                <Image src={provider.profilePhotoURL} alt={provider.providerName} width={48} height={48} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <FiUsers className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{formatProviderName(provider.providerName, provider.providerTitle)}</p>
                              {provider.specialty && <p className="text-sm text-gray-600">{provider.specialty}</p>}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProviderToRemove(provider);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-red-400 text-red-500 hover:bg-red-50 transition-colors"
                            aria-label="Remove provider"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Providers */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Available Providers</h4>
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search providers..."
                      value={providerSearchQuery}
                      onChange={(e) => setProviderSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  {filteredAvailableProviders.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      {providerSearchQuery ? "No providers found matching your search." : "All providers are already associated."}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {filteredAvailableProviders.map((provider) => (
                        <div key={provider.email} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-[#955aa4]/30 transition-colors">
                          <div className="flex items-center gap-3">
                            {provider.profilePhotoURL ? (
                              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                                <Image src={provider.profilePhotoURL} alt={provider.providerName} width={48} height={48} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <FiUsers className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{formatProviderName(provider.providerName, provider.providerTitle)}</p>
                              {provider.specialty && <p className="text-sm text-gray-600">{provider.specialty}</p>}
                            </div>
                          </div>
                          <button
                            onClick={() => setProviderToAdd(provider)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-green-400 text-green-500 hover:bg-green-50 transition-colors"
                            aria-label="Add provider"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={!!schoolToAdd}
        onClose={() => setSchoolToAdd(null)}
        onConfirm={() => schoolToAdd && handleAddSchool(schoolToAdd)}
        title="Add School"
        message={`Are you sure you want to add "${schoolToAdd?.name}" to this partner?`}
        confirmText="Yes, Add"
            variant="success"
        isLoading={isAddingSchool}
      />

      <ConfirmationModal
        isOpen={!!schoolToRemove}
        onClose={() => setSchoolToRemove(null)}
        onConfirm={() => schoolToRemove && handleRemoveSchool(schoolToRemove)}
        title="Remove School"
        message={`Are you sure you want to remove "${schoolToRemove?.name}" from this partner?`}
        confirmText="Yes, Remove"
        variant="danger"
        isLoading={isRemovingSchool}
      />

      <ConfirmationModal
        isOpen={!!providerToAdd}
        onClose={() => setProviderToAdd(null)}
        onConfirm={() => providerToAdd && handleAddProvider(providerToAdd)}
        title="Add Provider"
        message={`Are you sure you want to add "${providerToAdd ? formatProviderName(providerToAdd.providerName, providerToAdd.providerTitle) : ""}" to this partner?`}
        confirmText="Yes, Add"
            variant="success"
        isLoading={isAddingProvider}
      />

      <ConfirmationModal
        isOpen={!!providerToRemove}
        onClose={() => setProviderToRemove(null)}
        onConfirm={() => providerToRemove && handleRemoveProvider(providerToRemove)}
        title="Remove Provider"
        message={`Are you sure you want to remove "${providerToRemove ? formatProviderName(providerToRemove.providerName, providerToRemove.providerTitle) : ""}" from this partner?`}
        confirmText="Yes, Remove"
        variant="danger"
        isLoading={isRemovingProvider}
      />

      {/* Provider Details Modal */}
      {showProviderModal && (
        <ProviderDetailsModal
          isOpen={showProviderModal}
          onClose={() => setShowProviderModal(false)}
          providerEmail={selectedProviderEmail}
        />
      )}

      {/* School Edit Modal (used for viewing details) */}
      {showSchoolModal && selectedSchool && (
        <SchoolEditModal
          isOpen={showSchoolModal}
          onClose={() => {
            setShowSchoolModal(false);
            setSelectedSchool(null);
          }}
          school={selectedSchool}
          onSchoolUpdated={async () => {
            await loadPartnerDetails();
            setShowSchoolModal(false);
            setSelectedSchool(null);
          }}
        />
      )}
    </>
  );
};

export default PartnerDetailsModal;
