"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSchools } from "@/hooks/queries/useSchoolsQuery";
import { School } from "@/lib/types/school";

export function useLockInSchools() {
  const router = useRouter();
  const { data: schools = [], isLoading } = useSchools();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSchools = useMemo(() => {
    if (!searchQuery.trim()) {
      return schools;
    }

    const query = searchQuery.toLowerCase().trim();
    return schools.filter((school: School) => {
      const nameMatch = school.name?.toLowerCase().includes(query);
      const nicknameMatch = school.nickname?.toLowerCase().includes(query);
      const typeMatch = school.type?.toLowerCase().includes(query);
      const campusesMatch = school.campuses?.some((campus: string) =>
        campus.toLowerCase().includes(query),
      );
      return nameMatch || nicknameMatch || typeMatch || campusesMatch;
    });
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
