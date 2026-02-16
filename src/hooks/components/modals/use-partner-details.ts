"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSchools } from "@/hooks/queries/useSchoolsQuery";
import { useProvidersQuery } from "@/hooks/queries/useProvidersQuery";
import { School } from "@/lib/types/school";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { FiUsers } from "react-icons/fi";
import { MdSchool } from "react-icons/md";
import { Handshake } from "lucide-react";
import {
  PartnerDetailsTab,
  AssociatedSchool,
  AssociatedProvider,
} from "@/lib/types/modals";

interface UsePartnerDetailsProps {
  partnerId: string;
  partnerProp: any;
  isOpen: boolean;
}

export const usePartnerDetails = ({
  partnerId,
  partnerProp,
  isOpen,
}: UsePartnerDetailsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: allSchools = [] } = useSchools();
  const { providers } = useProvidersQuery();

  const [partner, setPartner] = useState(partnerProp);
  const [activeTab, setActiveTab] = useState<PartnerDetailsTab>("overview");
  const [associatedSchools, setAssociatedSchools] = useState<
    AssociatedSchool[]
  >([]);
  const [availableSchools, setAvailableSchools] = useState<AssociatedSchool[]>(
    [],
  );
  const [associatedProviders, setAssociatedProviders] = useState<
    AssociatedProvider[]
  >([]);
  const [availableProviders, setAvailableProviders] = useState<
    AssociatedProvider[]
  >([]);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [providerSearchQuery, setProviderSearchQuery] = useState("");
  const [schoolToAdd, setSchoolToAdd] = useState<AssociatedSchool | null>(null);
  const [schoolToRemove, setSchoolToRemove] = useState<AssociatedSchool | null>(
    null,
  );
  const [providerToAdd, setProviderToAdd] = useState<AssociatedProvider | null>(
    null,
  );
  const [providerToRemove, setProviderToRemove] =
    useState<AssociatedProvider | null>(null);
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

  const loadPartnerDetails = async () => {
    setIsLoadingSchools(true);
    setIsLoadingProviders(true);
    try {
      const response = await api(ENDPOINTS.partner(partnerId));
      if (response?.success && response.data) {
        const partnerData = response.data;
        setPartner(partnerData);

        const partnerSchools: AssociatedSchool[] =
          partnerData.schools && Array.isArray(partnerData.schools)
            ? partnerData.schools.map(
                (s: { id: string | number; name: string; logo?: string }) => ({
                  id: s.id,
                  name: s.name,
                  logo: s.logo,
                }),
              )
            : [];

        setAssociatedSchools(partnerSchools);

        const associatedSchoolIds = new Set(
          partnerSchools.map((s) => String(s.id)),
        );
        const available = allSchools
          .filter((s) => !associatedSchoolIds.has(String(s.id)))
          .map((s) => ({
            id: s.id,
            name: s.name,
            logo: s.logo || undefined,
          }));
        setAvailableSchools(available);

        const partnerProviders: AssociatedProvider[] =
          partnerData.providers && Array.isArray(partnerData.providers)
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

        const providersList =
          providers?.data && Array.isArray(providers.data)
            ? providers.data
            : [];
        const associatedProviderIds = new Set(
          partnerProviders.map((p) => p.email),
        );
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
      // Background data loading error
    } finally {
      setIsLoadingSchools(false);
      setIsLoadingProviders(false);
    }
  };

  useEffect(() => {
    if (isOpen && partnerId) {
      loadPartnerDetails();
    }
  }, [isOpen, partnerId]);

  useEffect(() => {
    if (
      isOpen &&
      partnerId &&
      (allSchools.length > 0 ||
        (providers?.data &&
          Array.isArray(providers.data) &&
          providers.data.length > 0))
    ) {
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

  const handleAddSchool = async (school: AssociatedSchool) => {
    setIsAddingSchool(true);
    try {
      const response = await api(
        ENDPOINTS.addSchoolToPartner(partnerId, school.id),
        {
          method: "POST",
        },
      );

      if (response?.success) {
        toast.success(`School "${school.name}" added successfully`);
        await queryClient.invalidateQueries({
          queryKey: ["partners", partnerId],
        });
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
      const response = await api(
        ENDPOINTS.removeSchoolFromPartner(partnerId, school.id),
        {
          method: "POST",
        },
      );

      if (response?.success) {
        toast.success(`School "${school.name}" removed successfully`);
        await queryClient.invalidateQueries({
          queryKey: ["partners", partnerId],
        });
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
      const response = await api(
        ENDPOINTS.addProviderToPartner(partnerId, provider.id),
        {
          method: "POST",
        },
      );

      if (response?.success) {
        toast.success(
          `Provider "${formatProviderName(provider.providerName, provider.providerTitle)}" added successfully`,
        );
        await queryClient.invalidateQueries({
          queryKey: ["partners", partnerId],
        });
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
      const response = await api(
        ENDPOINTS.removeProviderFromPartner(partnerId, provider.id),
        {
          method: "POST",
        },
      );

      if (response?.success) {
        toast.success(
          `Provider "${formatProviderName(provider.providerName, provider.providerTitle)}" removed successfully`,
        );
        await queryClient.invalidateQueries({
          queryKey: ["partners", partnerId],
        });
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

  const filteredAvailableSchools = useMemo(() => {
    if (!schoolSearchQuery.trim()) return availableSchools;
    const query = schoolSearchQuery.toLowerCase();
    return availableSchools.filter((school) =>
      school.name.toLowerCase().includes(query),
    );
  }, [availableSchools, schoolSearchQuery]);

  const filteredAvailableProviders = useMemo(() => {
    if (!providerSearchQuery.trim()) return availableProviders;
    const query = providerSearchQuery.toLowerCase();
    return availableProviders.filter(
      (provider) =>
        formatProviderName(provider.providerName, provider.providerTitle)
          .toLowerCase()
          .includes(query) ||
        provider.email.toLowerCase().includes(query) ||
        provider.specialty?.toLowerCase().includes(query),
    );
  }, [availableProviders, providerSearchQuery]);

  const handleSchoolClick = async (school: AssociatedSchool) => {
    try {
      const response = await api(ENDPOINTS.school(String(school.id)));
      if (response?.success && response.data) {
        setSelectedSchool(response.data);
        setShowSchoolModal(true);
      }
    } catch (error) {
      // Fallback to navigation if modal fails
      router.push(`${ROUTES.curator.schools}/${String(school.id)}`);
    }
  };

  const handleProviderClick = (provider: AssociatedProvider) => {
    setSelectedProviderEmail(provider.email);
    setShowProviderModal(true);
  };

  const tabs = [
    { id: "overview" as PartnerDetailsTab, label: "Overview", icon: Handshake },
    {
      id: "schools" as PartnerDetailsTab,
      label: "Schools",
      icon: MdSchool,
      count: associatedSchools.length,
    },
    {
      id: "providers" as PartnerDetailsTab,
      label: "Providers",
      icon: FiUsers,
      count: associatedProviders.length,
    },
  ];

  return {
    partner,
    activeTab,
    setActiveTab,
    associatedSchools,
    associatedProviders,
    schoolSearchQuery,
    setSchoolSearchQuery,
    providerSearchQuery,
    setProviderSearchQuery,
    schoolToAdd,
    setSchoolToAdd,
    schoolToRemove,
    setSchoolToRemove,
    providerToAdd,
    setProviderToAdd,
    providerToRemove,
    setProviderToRemove,
    isLoadingSchools,
    isLoadingProviders,
    isAddingSchool,
    isRemovingSchool,
    isAddingProvider,
    isRemovingProvider,
    showProviderModal,
    setShowProviderModal,
    selectedProviderEmail,
    setSelectedProviderEmail,
    showSchoolModal,
    setShowSchoolModal,
    selectedSchool,
    setSelectedSchool,
    filteredAvailableSchools,
    filteredAvailableProviders,
    handleAddSchool,
    handleRemoveSchool,
    handleAddProvider,
    handleRemoveProvider,
    loadPartnerDetails,
    handleSchoolClick,
    handleProviderClick,
    tabs,
  };
};
