"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import useSchoolsQuery from "@/hooks/queries/use-schools";
import { filterSchoolsBySearchQuery } from "@/lib/utils/shared/search-query";

export function useLockInSchools() {
  const router = useRouter();
  const { useSchools } = useSchoolsQuery();
  const { data: schools = [], isLoading } = useSchools();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSchools = useMemo(() => {
    return filterSchoolsBySearchQuery(schools, searchQuery);
  }, [schools, searchQuery]);

  const handleSchoolSelect = useCallback(
    (schoolId: number | string) => {
      router.push(`/patient/lock-in/${schoolId}`);
    },
    [router],
  );

  return {
    schools,
    isLoading,
    searchQuery,
    setSearchQuery,
    filteredSchools,
    handleSchoolSelect,
  };
}
