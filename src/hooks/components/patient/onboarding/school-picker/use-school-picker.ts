"use client";

import { useMemo, useState } from "react";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import type { SchoolType } from "@/lib/types/components/patient/onboarding";
import { filterSchoolsByType } from "@/lib/utils/patient/filter-schools-by-type";
import { schoolMatchesSearchQuery } from "@/lib/utils/shared/search-query";

export function useSchoolPicker(schoolType: SchoolType, open: boolean) {
  const { useSchools } = useSchoolsQuery();
  const { data: schools = [], isLoading } = useSchools({ enabled: open });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSchools = useMemo(() => {
    const typed = filterSchoolsByType(schools, schoolType);
    const query = searchQuery.trim();
    if (!query) {
      return typed;
    }

    return typed.filter((school) => schoolMatchesSearchQuery(school, query));
  }, [schoolType, schools, searchQuery]);

  return {
    schools: filteredSchools,
    isLoading,
    searchQuery,
    setSearchQuery,
  };
}
