"use client";

import { useRouter } from "next/navigation";
import WidthConstraint from "@/components/ui/width-constraint";
import { useProviderSchools } from "@/hooks/provider/useProviderSchools";
import {
  ProviderSchoolsHeader,
  ProviderSchoolsFilter,
  ProviderSchoolsList,
} from "@/features/provider/components/schools";

export default function ProviderSchoolsPage() {
  const router = useRouter();
  const {
    schoolsList,
    cachedSchools,
    atomLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoadingProfile,
  } = useProviderSchools();

  const handleSchoolClick = (schoolId: string | number) => {
    router.push(`/provider/schools/${schoolId}`);
  };

  const isLoading =
    (atomLoading || isLoadingProfile) && cachedSchools.length === 0;

  return (
    <WidthConstraint>
      <div className="p-8">
        <ProviderSchoolsHeader />

        <ProviderSchoolsFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <ProviderSchoolsList
          schools={schoolsList}
          isLoading={isLoading}
          activeFilter={activeFilter}
          onSchoolClick={handleSchoolClick}
        />
      </div>
    </WidthConstraint>
  );
}
