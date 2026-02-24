"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { toast } from "@/components/ui/sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

interface PartnerDetailsData {
  partner: any;
  associatedSchools: AssociatedSchool[];
  associatedProviders: AssociatedProvider[];
}

async function fetchPartnerDetails(
  partnerId: string,
  allSchools: School[],
  providersList: any[],
): Promise<PartnerDetailsData> {
  const response = await api(ENDPOINTS.partner(partnerId));
  if (!response?.success || !response.data) {
    throw new Error("Failed to load partner details");
  }

  const partnerData = response.data;

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

  return {
    partner: partnerData,
    associatedSchools: partnerSchools,
    associatedProviders: partnerProviders,
  };
}

export const usePartnerDetails = ({
  partnerId,
  partnerProp,
  isOpen,
}: {
  partnerId: string;
  partnerProp: any;
  isOpen: boolean;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: allSchools = [] } = useSchools();
  const { providers } = useProvidersQuery();

  const providersList =
    providers?.data && Array.isArray(providers.data) ? providers.data : [];

  const [activeTab, setActiveTab] = useState<PartnerDetailsTab>("overview");
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
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [isRemovingSchool, setIsRemovingSchool] = useState(false);
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [isRemovingProvider, setIsRemovingProvider] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderEmail, setSelectedProviderEmail] = useState("");
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // React Query for partner details
  const { data: partnerDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["partner-details", partnerId],
    queryFn: () => fetchPartnerDetails(partnerId, allSchools, providersList),
    enabled: isOpen && !!partnerId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  });

  const partner = partnerDetails?.partner ?? partnerProp;
  const associatedSchools = partnerDetails?.associatedSchools ?? [];
  const associatedProviders = partnerDetails?.associatedProviders ?? [];

  const isLoadingSchools = isLoadingDetails;
  const isLoadingProviders = isLoadingDetails;

  // Compute available schools/providers
  const availableSchools = useMemo(() => {
    const associatedSchoolIds = new Set(
      associatedSchools.map((s) => String(s.id)),
    );
    return allSchools
      .filter((s) => !associatedSchoolIds.has(String(s.id)))
      .map((s) => ({
        id: s.id,
        name: s.name,
        logo: s.logo || undefined,
      }));
  }, [allSchools, associatedSchools]);

  const availableProviders = useMemo(() => {
    const associatedProviderIds = new Set(
      associatedProviders.map((p) => p.email),
    );
    return providersList
      .filter((p: any) => !associatedProviderIds.has(p.email))
      .map((p: any) => ({
        id: p.email,
        email: p.email,
        providerName: p.providerName,
        providerTitle: p.providerTitle,
        specialty: p.specialty,
        profilePhotoURL: p.profilePhotoURL,
      }));
  }, [providersList, associatedProviders]);

  const loadPartnerDetails = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["partner-details", partnerId],
    });
  };

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
