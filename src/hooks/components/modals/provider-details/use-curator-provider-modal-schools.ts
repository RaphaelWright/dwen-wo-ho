"use client";

import { useState, useMemo } from "react";
import { useProvidersQuery } from "@/hooks/queries/use-provider";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { AssociatedSchool } from "@/lib/types/partners";
import { ProviderDetails } from "@/lib/types/provider";
import { toast } from "@/components/ui/sonner";

export const useCuratorProviderModalSchools = (
  isOpen: boolean,
  providerEmail: string,
  provider: ProviderDetails | null,
) => {
  const { addSchoolToProvider, removeSchoolFromProvider, isAddingSchool, isRemovingSchool } = useProvidersQuery({
    enabled: false,
  });
  const { useSchools: useSchoolsListQuery } = useSchoolsQuery();
  const { data: allSchools = [] } = useSchoolsListQuery({ enabled: isOpen });

  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [schoolToAdd, setSchoolToAdd] = useState<AssociatedSchool | null>(null);
  const [schoolToRemove, setSchoolToRemove] = useState<AssociatedSchool | null>(null);

  const associatedSchools: AssociatedSchool[] = useMemo(() => {
    const providerSchools = provider?.schools || [];
    return providerSchools.map((s: any) => ({
      id: String(s.id),
      name: s.name,
      logo: s.logo,
      isAssociated: true,
    }));
  }, [provider?.schools]);

  const availableSchools: AssociatedSchool[] = useMemo(() => {
    const associatedIds = new Set(associatedSchools.map((s) => s.id));
    return allSchools
      .filter((s) => !associatedIds.has(String(s.id)))
      .map((s) => ({
        id: String(s.id),
        name: s.name,
        logo: s.logo,
        isAssociated: false,
      }));
  }, [allSchools, associatedSchools]);

  const filteredAvailableSchools = useMemo(() => {
    if (!schoolSearchQuery.trim()) return availableSchools;
    const query = schoolSearchQuery.toLowerCase();
    return availableSchools.filter((school) =>
      school.name.toLowerCase().includes(query),
    );
  }, [availableSchools, schoolSearchQuery]);

  const handleAddSchool = async (school: AssociatedSchool) => {
    if (provider?.applicationStatus === "REJECTED") {
      toast.error("Cannot add schools to rejected providers");
      setSchoolToAdd(null);
      return;
    }

    const providerId = String(provider?.id || providerEmail);
    await addSchoolToProvider({ providerId, schoolId: school.id });
    setSchoolToAdd(null);
  };

  const handleRemoveSchool = async (school: AssociatedSchool) => {
    const providerId = String(provider?.id || providerEmail);
    await removeSchoolFromProvider({ providerId, schoolId: school.id });
    setSchoolToRemove(null);
  };

  return {
    associatedSchools,
    availableSchools,
    filteredAvailableSchools,
    schoolSearchQuery,
    setSchoolSearchQuery,
    schoolToAdd,
    setSchoolToAdd,
    schoolToRemove,
    setSchoolToRemove,
    isAddingSchool,
    isRemovingSchool,
    handleAddSchool,
    handleRemoveSchool,
  };
};
